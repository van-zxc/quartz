import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import { visit } from "unist-util-visit"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { publicationSlug } from "./paths.mjs"
import { compatibleMath } from "./math-compatibility.mjs"

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const generated = ".publish-content"
const blocked =
  /^(?:\.|private$|templates$|模板$|文献摘录$|阅读笔记$|灵感$|attachment$|书籍$|书籍摘录$|项目$)/i

export function safePath(base, relative) {
  if (
    typeof relative !== "string" ||
    !relative ||
    relative.includes("\\") ||
    path.posix.isAbsolute(relative) ||
    /^[a-z]:/i.test(relative)
  )
    throw new Error("必须使用相对路径")
  if (relative.split("/").some((part) => !part || part === ".." || blocked.test(part)))
    throw new Error(`不允许的发布路径: ${relative}`)
  const target = path.resolve(base, relative)
  if (!target.startsWith(path.resolve(base) + path.sep)) throw new Error("发布路径越界")
  return target
}

export async function readSource(base, relative, encoding = "utf8") {
  const target = safePath(base, relative)
  const real = await fs.realpath(target)
  const realBase = await fs.realpath(base)
  const canonical = (value) => (process.platform === "win32" ? value.toLowerCase() : value)
  if (
    !canonical(real).startsWith(canonical(realBase) + path.sep) ||
    canonical(real) !== canonical(path.resolve(realBase, relative))
  )
    throw new Error(`不允许通过链接读取文件: ${relative}`)
  return fs.readFile(real, encoding)
}

export function resolveTarget(name, source, entries) {
  const normalized = name.replace(/\.md$/i, "").replace(/^\/+/, "")
  const relative = path.posix.normalize(path.posix.join(path.posix.dirname(source), normalized))
  const exact = entries.filter((e) => [e.source.replace(/\.md$/i, ""), e.output.replace(/\.md$/i, "")].includes(normalized))
  if (exact.length === 1) return exact[0]
  const local = entries.filter((e) => e.source.replace(/\.md$/i, "") === relative)
  if (local.length === 1) return local[0]
  const suffix = entries.filter((e) => e.source.replace(/\.md$/i, "").endsWith("/" + normalized))
  return suffix.length === 1 ? suffix[0] : undefined
}

export function validateRaster(bytes, source) {
  const ext = path.posix.extname(source).toLowerCase()
  const valid = ext === ".png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : [".jpg", ".jpeg"].includes(ext) ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : ext === ".gif" ? /GIF8[79]a/.test(bytes.subarray(0,6).toString("ascii"))
    : ext === ".webp" ? bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP" : false
  if (!valid || bytes.length > 10 * 1024 * 1024) throw new Error(`附件不是受支持的图片或超过10MB: ${source}`)
}

export function transformBody(body, source, published, changes, assets = []) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(body)
  const protectedSpans = []
  const edits = []
  const usedAsset = (name) => {
    const target = resolveTarget(name, source, assets)
    if (!target) throw new Error(`图片未在发布白名单或目标不唯一: ${source}: ${name}`)
    return target
  }
  visit(tree, (node) => {
    if (["code", "inlineCode", "math", "inlineMath"].includes(node.type))
      protectedSpans.push([node.position.start.offset, node.position.end.offset])
    if (node.type === "html" && !/^<\/?(?:sub|sup|br)\s*\/?>$/i.test(node.value.trim()))
      throw new Error(`需要审查嵌入的 HTML: ${source}`)
    if (node.type === "imageReference") throw new Error(`需要审查引用式图片: ${source}`)
    if (node.type === "image") {
      const asset = usedAsset(decodeURIComponent(node.url))
      edits.push([node.position.start.offset, node.position.end.offset, `![${node.alt || "配图"}](${asset.output})`])
    }
    if (node.type === "link" || node.type === "definition") {
      if (/^(?:https?:\/\/|#)/i.test(node.url)) return
      if (node.type === "definition" || /^[a-z]+:/i.test(node.url))
        throw new Error(`不允许的文件链接: ${source}`)
      const [name, anchor] = decodeURIComponent(node.url).split("#", 2)
      const target = resolveTarget(name, source, published)
      const label = body.slice(node.position.start.offset, node.position.end.offset).match(/^\[([^\]]*)\]/)?.[1] || path.posix.basename(name)
      const replacement = target ? `[[${target.output.slice(0, -3)}${anchor ? "#" + anchor : ""}|${label}]]` : label
      if (!target) changes.push({source, target: name, label})
      edits.push([node.position.start.offset, node.position.end.offset, replacement])
    }
  })
  for (const match of body.matchAll(/(!?)\[\[([^\]\n]+)\]\]/g)) {
    const start = match.index
    if (protectedSpans.some(([a, b]) => start >= a && start < b) || edits.some(([a,b]) => start >= a && start < b)) continue
    const [destination, alias] = match[2].split(/\\?\|/, 2)
    const [name, ...parts] = destination.split("#")
    const anchor = parts.join("#")
    if (match[1] && /\.(?:png|jpe?g|gif|webp)$/i.test(name)) {
      const asset = usedAsset(name)
      const size = alias && /^\d+(?:x\d+)?$/.test(alias) ? "|" + alias : ""
      const replacement = size ? `![[${asset.output}${size}]]` : `![${alias || "配图"}](${asset.output})`
      edits.push([start, start + match[0].length, replacement]); continue
    }
    const target = name === "" ? published.find((e) => e.source === source) : resolveTarget(name, source, published)
    if (match[1] && !target) throw new Error(`正文嵌入目标未公开: ${source}: ${name}`)
    const label = alias ?? path.posix.basename(name || source.replace(/\.md$/, ""))
    const replacement = target
      ? `${match[1]}[[${target.output.slice(0, -3)}${anchor ? "#" + anchor : ""}${alias ? "|" + alias : ""}]]`
      : label
    if (!target) changes.push({source, target: name, label})
    edits.push([start, start + match[0].length, replacement])
  }
  for (const [start, end, replacement] of edits.sort((a,b) => b[0]-a[0]))
    body = body.slice(0, start) + replacement + body.slice(end)
  if (/file:\/\/|obsidian:\/\/|zotero:\/\/|[a-z]:\\(?:Users|ObsidianVaults)/i.test(body))
    throw new Error(`存在本地文件引用: ${source}`)
  return body
}

export async function prepare(repo = root) {
  const manifest = JSON.parse(
    await fs.readFile(path.join(repo, "publication/manifest.json"), "utf8"),
  )
  if (manifest.version !== 1 || !Array.isArray(manifest.notes) || manifest.notes.length === 0)
    throw new Error("发布清单为空或版本不受支持")
  const outputs = new Set(["index"])
  const sources = new Set()
  const changes = []
  const pending = []
  const assets = manifest.assets ?? []
  for (const asset of assets) {
    if (!asset.source.startsWith("attachment/") || !asset.output.startsWith("assets/"))
      throw new Error("图片必须来自附件目录并导出至 assets")
    const relative = asset.source.slice("attachment/".length)
    if (relative.split("/").some((p) => ["文献", "Flomo", "电子书"].includes(p)))
      throw new Error("不允许发布私密附件子目录")
    const bytes = await readSource(path.join(repo, "content/attachment"), relative, null)
    validateRaster(bytes, asset.source)
    if (path.posix.extname(asset.source).toLowerCase() !== path.posix.extname(asset.output).toLowerCase())
      throw new Error("图片输出扩展名不一致")
    if (asset.sha256 !== createHash("sha256").update(bytes).digest("hex"))
      throw new Error(`图片发生变化，请重新审查清单: ${asset.source}`)
    const slug = publicationSlug(asset.output).toLowerCase()
    if (outputs.has(slug) || sources.has(asset.source)) throw new Error("图片清单存在重复项")
    outputs.add(slug); sources.add(asset.source)
    safePath(path.join(repo, generated), asset.output)
    pending.push([asset.output, bytes])
  }
  for (const entry of manifest.notes) {
    if (
      !entry.source.startsWith("inbox/") ||
      !entry.source.endsWith(".md") ||
      !entry.output.endsWith(".md")
    )
      throw new Error("只能发布 inbox 中的 Markdown 笔记")
    safePath(path.join(repo, "content"), entry.source)
    safePath(path.join(repo, generated), entry.output)
    if (outputs.has(publicationSlug(entry.output).toLowerCase()) || sources.has(entry.source))
      throw new Error("发布清单存在重复项")
    outputs.add(publicationSlug(entry.output).toLowerCase())
    sources.add(entry.source)
    const raw = await readSource(path.join(repo, "content"), entry.source)
    const parsed = matter(raw.replace(/^\uFEFF/, ""))
    if (parsed.data.draft === true || parsed.data.publish === false)
      throw new Error(`笔记明确禁止发布: ${entry.source}`)
    const body = compatibleMath(transformBody(parsed.content, entry.source, manifest.notes, changes, assets))
    if (body.trim().length < 150) throw new Error(`笔记正文过短: ${entry.source}`)
    const history = spawnSync(
      "git",
      ["-C", repo, "log", "-1", "--format=%cI", "--", "content/" + entry.source],
      { encoding: "utf8", windowsHide: true },
    ).stdout?.trim()
    const modified =
      history || (await fs.stat(path.join(repo, "content", entry.source))).mtime.toISOString()
    pending.push([
      entry.output,
      matter.stringify(body, {
        title: entry.title ?? path.posix.basename(entry.source, ".md"),
        publish: true,
        tags: [entry.topic],
        modified,
      }),
    ])
  }
  const homepage = await readSource(path.join(repo, "publication"), "index.md")
  pending.push(["index.md", homepage])
  const target = path.resolve(repo, generated)
  if (target !== path.join(path.resolve(repo), generated)) throw new Error("生成目录异常")
  // Only the fixed, generated directory is replaced; the Vault remains untouched.
  const stat = await fs.lstat(target).catch((e) => {
    if (e.code !== "ENOENT") throw e
    return null
  })
  if (stat?.isSymbolicLink()) throw new Error("生成目录不能是链接")
  await fs.rm(target, { recursive: true, force: true })
  for (const [relative, body] of pending) {
    const file = safePath(target, relative)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, body)
  }
  const report = {
    articles: manifest.notes.length,
    pages: manifest.notes.length + 1,
    assets: assets.length,
    unpublishedLinksConverted: changes.length,
    changes,
  }
  await fs.writeFile(path.join(repo, ".publication-report.json"), JSON.stringify(report, null, 2))
  console.log(
    `已导出 ${report.articles} 篇文章与首页；未公开双链 ${changes.length} 处转为普通文字；配图 ${report.assets} 个。`,
  )
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await prepare()
