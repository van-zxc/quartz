import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import { visit } from "unist-util-visit"
import katex from "katex"

// Put block-math delimiters on their own lines without changing the expression.
export function normalizeDisplayMath(body) {
  let display = false
  let fence = null
  const result = []
  for (const line of body.split(/\r?\n/)) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (marker) {
      if (!fence) fence = marker[0]
      else if (fence === marker[0]) fence = null
      result.push(line); continue
    }
    if (fence) { result.push(line); continue }
    let remainder = line
    if (!display && !/^\s*\$\$/.test(remainder)) { result.push(line); continue }
    while (remainder.includes("$$")) {
      const index = remainder.indexOf("$$")
      result.push(remainder.slice(0,index), "$$")
      display = !display
      remainder = remainder.slice(index+2)
      if (!display && !/^\s*\$\$/.test(remainder)) break
    }
    if (remainder) result.push(remainder)
  }
  return result.join("\n")
}

export function preserveUnrenderableMath(body, source, changes) {
  const tree = unified().use(remarkParse).use(remarkMath).parse(body)
  const edits = []
  visit(tree, (node) => {
    if (node.type !== "math" && node.type !== "inlineMath") return
    try { katex.renderToString(node.value,{displayMode:node.type === "math",strict:"ignore",throwOnError:true}) }
    catch {
      const fence = "`".repeat(Math.max(3,...[...node.value.matchAll(/`+/g)].map(m=>m[0].length+1)))
      const replacement = node.type === "math"
        ? `\n\n${fence}text\n${node.value}\n${fence}\n\n`
        : `${"`".repeat(Math.max(1,...[...node.value.matchAll(/`+/g)].map(m=>m[0].length+1)))}${node.value}${"`".repeat(Math.max(1,...[...node.value.matchAll(/`+/g)].map(m=>m[0].length+1)))}`
      edits.push([node.position.start.offset,node.position.end.offset,replacement])
      changes.push({source,kind:"formulaPreservedAsText",formula:node.value})
    }
  })
  for (const [start,end,replacement] of edits.reverse()) body = body.slice(0,start)+replacement+body.slice(end)
  return body
}
