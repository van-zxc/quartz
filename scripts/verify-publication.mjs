import fs from "node:fs/promises"
import path from "node:path"
import { root } from "./publication.mjs"
import { publicationSlug } from "./paths.mjs"

const manifest = JSON.parse(await fs.readFile(path.join(root, "publication/manifest.json"), "utf8"))
const expected = new Set([
  "index",
  ...manifest.notes.map((note) => publicationSlug(note.output)),
])
const output = path.resolve(root, process.argv[2] ?? "public")
const index = JSON.parse(await fs.readFile(path.join(output, "static/contentIndex.json"), "utf8"))
if (
  Object.keys(index).length !== expected.size ||
  Object.keys(index).some((slug) => !expected.has(slug))
)
  throw new Error("网站搜索索引包含清单以外的文章或缺少文章")
if (await fs.stat(path.join(output, "CNAME")).catch(() => null))
  throw new Error("默认 GitHub Pages 域名不应生成 CNAME")
const origin = "https://van-zxc.github.io"
const base = "/quartz/"
const problems = []
let checked = 0
let formulas = 0
const files = []
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(file)
    else files.push(file)
  }
}
await walk(output)
const expectedAssets = new Set((manifest.assets ?? []).map((a) => publicationSlug(a.output)))
const actualAssets = files.map((f) => path.relative(output, f).replaceAll(path.sep, "/")).filter((f) => f.startsWith("assets/"))
if (actualAssets.length !== expectedAssets.size || actualAssets.some((f) => !expectedAssets.has(f)))
  throw new Error("网站图片与发布白名单不一致")
for (const file of files.filter((file) => file.endsWith(".html"))) {
  const relative = path.relative(output, file).replaceAll(path.sep, "/")
  const html = await fs.readFile(file, "utf8")
  if (/class="[^"]*katex-error/.test(html)) problems.push(`${relative}: 公式渲染失败`)
  formulas += (html.match(/class="katex"/g) ?? []).length
  for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*?\s(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&")
    if (/^(?:https?:|mailto:|data:|tel:)/i.test(href) || !href) continue
    const url = new URL(href, `${origin}${base}${relative}`)
    if (!url.pathname.startsWith(base) && url.pathname !== base.slice(0, -1)) {
      problems.push(`${relative}: 链接超出网站目录`)
      continue
    }
    const dest =
      url.pathname === base.slice(0, -1) ? "" : decodeURIComponent(url.pathname.slice(base.length))
    const options = [dest, dest + ".html", path.posix.join(dest, "index.html")]
    let target
    for (const option of options) {
      const candidate = path.resolve(output, option)
      if (!candidate.startsWith(output + path.sep)) continue
      if ((await fs.stat(candidate).catch(() => null))?.isFile()) {
        target = candidate
        break
      }
    }
    if (!target) problems.push(`${relative}: 不存在的内部链接 ${dest}`)
    else if (url.hash && target.endsWith(".html")) {
      const anchor = decodeURIComponent(url.hash.slice(1))
      const targetHtml = await fs.readFile(target, "utf8")
      if (!targetHtml.includes(`id="${anchor}"`))
        problems.push(`${relative}: 不存在的锚点 ${anchor}`)
    }
    checked++
  }
}
for (const name of ["sitemap.xml", "index.xml"]) {
  const xml = await fs.readFile(path.join(output, name), "utf8")
  if (!xml.includes(`${origin}/quartz`)) problems.push(`${name}: 网址错误`)
}
if (
  files.some(
    (file) =>
      /\.(?:pdf|docx|canvas|base|zip)$/i.test(file) ||
      /(?:attachment|\.obsidian|文献摘录|笔记草稿)/.test(path.relative(output, file)),
  )
)
  problems.push("出现未选择的附件或私密目录")
if (problems.length) throw new Error(problems.join("\n"))
console.log(
  `网站核查通过：${expected.size} 个内容页面，${checked} 个内部链接，${formulas} 处公式；索引、订阅和网站地图网址正确。`,
)
