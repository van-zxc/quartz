import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

export function repairHtmlAnchors(html, relative, htmlPages) {
  const edits = []
  const repairs = []
  for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&")
    if (!href.includes("#") || /^(?:https?:|mailto:|data:|tel:)/i.test(href)) continue
    const url = new URL(href, `https://van-zxc.github.io/quartz/${relative}`)
    if (!url.pathname.startsWith("/quartz/")) continue
    const dest = decodeURIComponent(url.pathname.slice("/quartz/".length))
    const target = [dest, dest + ".html", path.posix.join(dest, "index.html")].find((p) => htmlPages.has(p))
    if (!target) continue // Missing pages remain errors in verify-publication.
    const anchor = decodeURIComponent(url.hash.slice(1))
    if (!anchor || htmlPages.get(target).has(anchor)) continue
    const replacement = match[1].split("#")[0] || path.posix.basename(relative)
    const start = match.index + match[0].lastIndexOf(match[1])
    edits.push([start, start + match[1].length, replacement])
    repairs.push({page: relative, href, destination: replacement})
  }
  for (const [start, end, replacement] of edits.reverse()) html = html.slice(0,start) + replacement + html.slice(end)
  return {html, repairs}
}

export async function repair(output) {
  const pages = new Map()
  const originals = new Map()
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
      const file = path.join(dir,entry.name)
      if (entry.isDirectory()) await walk(file)
      else if (file.endsWith(".html")) {
        const html = await fs.readFile(file, "utf8")
        const relative = path.relative(output,file).replaceAll(path.sep,"/")
        originals.set(relative,html)
        pages.set(relative,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1].replaceAll("&amp;","&"))))
      }
    }
  }
  await walk(output)
  const repairs = []
  for (const [relative, original] of originals) {
    const result = repairHtmlAnchors(original,relative,pages)
    if (result.repairs.length) await fs.writeFile(path.join(output,relative),result.html)
    repairs.push(...result.repairs)
  }
  console.log(`已将 ${repairs.length} 处失效章节链接改为文章入口；有效章节链接保持不变。`)
  return repairs
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await repair(path.resolve(process.argv[2] ?? "public"))
