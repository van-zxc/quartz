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

export async function readSource(base, relative) {
  const target = safePath(base, relative)
  const real = await fs.realpath(target)
  const realBase = await fs.realpath(base)
  const canonical = (value) => (process.platform === "win32" ? value.toLowerCase() : value)
  if (
    !canonical(real).startsWith(canonical(realBase) + path.sep) ||
    canonical(real) !== canonical(path.resolve(realBase, relative))
  )
    throw new Error(`不允许通过链接读取文件: ${relative}`)
  return fs.readFile(real, "utf8")
}

export function transformBody(body, source, published, changes) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(body)
  const protectedSpans = []
  const edits = []
  visit(tree, (node) => {
    if (["code", "inlineCode", "math", "inlineMath"].includes(node.type))
      protectedSpans.push([node.position.start.offset, node.position.end.offset])
    if (node.type === "html" && !/^<\/?(?:sub|sup|br)\b[^>]*>$/i.test(node.value.trim()))
      throw new Error(`需要审查嵌入的 HTML: ${source}`)
    if (node.type === "image" || node.type === "imageReference")
      throw new Error(`当前发布清单不允许图片: ${source}`)
    if (node.type === "link" || node.type === "definition") {
      if (!/^https?:\/\//i.test(node.url) && !node.url.startsWith("#"))
        throw new Error(`请将内部链接写为双链: ${source}`)
    }
  })
  for (const match of body.matchAll(/(!?)\[\[([^\]\n]+)\]\]/g)) {
    const start = match.index
    if (protectedSpans.some(([a, b]) => start >= a && start < b)) continue
    if (match[1]) throw new Error(`当前发布清单不允许嵌入文件: ${source}`)
    const [destination, alias] = match[2].split(/\\?\|/, 2)
    const [name, ...parts] = destination.split("#")
    const anchor = parts.join("#")
    const normalized = name.replace(/\.md$/i, "")
    const matches = published.filter(
      (entry) =>
        entry.source.slice(0, -3) === normalized ||
        entry.output.slice(0, -3) === normalized ||
        path.posix.basename(entry.source, ".md") === normalized,
    )
    if (matches.length > 1) throw new Error(`公开链接目标不唯一: ${source}`)
    const target =
      normalized === "" ? published.find((entry) => entry.source === source) : matches[0]
    const label = alias ?? path.posix.basename(name || source.replace(/\.md$/, ""))
    const replacement = target
      ? `[[${target.output.slice(0, -3)}${anchor ? "#" + anchor : ""}${alias ? "|" + alias : ""}]]`
      : label
    if (!target) changes.push({ source, target: name, label })
    edits.push([start, start + match[0].length, replacement])
  }
  for (const [start, end, replacement] of edits.reverse())
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
  const outputs = new Set(["index.md"])
  const sources = new Set()
  const changes = []
  const pending = []
  for (const entry of manifest.notes) {
    if (
      !entry.source.startsWith("inbox/") ||
      !entry.source.endsWith(".md") ||
      !entry.output.endsWith(".md")
    )
      throw new Error("只能发布 inbox 中的 Markdown 笔记")
    safePath(path.join(repo, "content"), entry.source)
    safePath(path.join(repo, generated), entry.output)
    if (outputs.has(entry.output.toLowerCase()) || sources.has(entry.source))
      throw new Error("发布清单存在重复项")
    outputs.add(entry.output.toLowerCase())
    sources.add(entry.source)
    const raw = await readSource(path.join(repo, "content"), entry.source)
    const parsed = matter(raw.replace(/^\uFEFF/, ""))
    if (parsed.data.draft === true || parsed.data.publish === false)
      throw new Error(`笔记明确禁止发布: ${entry.source}`)
    const body = transformBody(parsed.content, entry.source, manifest.notes, changes)
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
    pages: pending.length,
    assets: 0,
    unpublishedLinksConverted: changes.length,
    changes,
  }
  await fs.writeFile(path.join(repo, ".publication-report.json"), JSON.stringify(report, null, 2))
  console.log(
    `已导出 ${report.articles} 篇文章与首页；未公开双链 ${changes.length} 处转为普通文字；附件 0 个。`,
  )
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await prepare()
