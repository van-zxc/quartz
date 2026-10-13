import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import { visit } from "unist-util-visit"
// These legacy snippets draw a closed surface integral by hand.
// KaTeX already provides \oiint; redefining it causes an error.
export function compatibleMath(body) {
  const legacyMacro = String.raw`\newcommand{\oiint}{{\subset\!\supset} \mathllap{\iint}}{\oiint}`
  const legacyDrawing = String.raw`\underset{ S \;}{ {\rlap{\mspace{1mu} \boldsymbol{\bigcirc}}{\rlap{\int}{\;\int}}} }`
  if (!body.includes(legacyMacro) && !body.includes(legacyDrawing)) return body
  const edits = []
  const tree = unified().use(remarkParse).use(remarkMath).parse(body)
  visit(tree, (node) => {
    if (node.type !== "math" && node.type !== "inlineMath") return
    const start = node.position.start.offset
    const end = node.position.end.offset
    const replacement = body.slice(start,end).replaceAll(legacyMacro,String.raw`\oiint`).replaceAll(legacyDrawing,String.raw`\oiint_{S}`)
    edits.push([start,end,replacement])
  })
  for (const [start,end,replacement] of edits.reverse()) body = body.slice(0,start) + replacement + body.slice(end)
  return body
}
