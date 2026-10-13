import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { prepare, safePath, transformBody } from "./publication.mjs"

test("拒绝目录越界、私密目录和隐藏文件", () => {
  for (const name of [
    "../secret.md",
    "inbox/../secret.md",
    "/secret.md",
    "C:/secret.md",
    "inbox/.obsidian/a.md",
    "inbox/private/a.md",
    "inbox/项目/a.md",
    "inbox\\a.md",
  ])
    assert.throws(() => safePath(process.cwd(), name))
})
test("只保留公开双链，代码和公式保持原样", () => {
  const notes = [{ source: "inbox/数学/甲.md", output: "数学/甲.md" }]
  const body = "[[甲|标题]] [[私密计划|公开称呼]] `[[私密计划]]` $x+[[甲]]$"
  const changes = []
  assert.equal(
    transformBody(body, notes[0].source, notes, changes),
    "[[数学/甲|标题]] 公开称呼 `[[私密计划]]` $x+[[甲]]$",
  )
  assert.equal(changes.length, 1)
})
test("拒绝未经选择的附件、本地文件和脚本", () => {
  for (const body of [
    "![[image.png]]",
    "![图](image.png)",
    "[文件](file:///C:/secret)",
    "<script>alert(1)</script>",
  ])
    assert.throws(() => transformBody(body, "inbox/a.md", [], []))
})
test("导出只含清单文章，删除旧导出，拒绝显式私密笔记", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "quartz-publication-"))
  try {
    await fs.mkdir(path.join(dir, "publication"))
    await fs.mkdir(path.join(dir, "content/inbox"), { recursive: true })
    const note = "这是已经整理的文章。".repeat(30)
    await fs.writeFile(path.join(dir, "content/inbox/a.md"), note)
    await fs.writeFile(path.join(dir, "content/inbox/secret.md"), "SECRET_DO_NOT_PUBLISH")
    await fs.writeFile(path.join(dir, "publication/index.md"), "---\npublish: true\n---\n首页")
    await fs.writeFile(
      path.join(dir, "publication/manifest.json"),
      JSON.stringify({
        version: 1,
        notes: [{ source: "inbox/a.md", output: "数学/a.md", topic: "数学" }],
      }),
    )
    await fs.mkdir(path.join(dir, ".publish-content"))
    await fs.writeFile(path.join(dir, ".publish-content/obsolete.md"), "旧文件")
    await prepare(dir)
    assert.deepEqual((await fs.readdir(path.join(dir, ".publish-content"))).sort(), [
      "index.md",
      "数学",
    ])
    assert.equal(
      await fs.readFile(path.join(dir, "content/inbox/secret.md"), "utf8"),
      "SECRET_DO_NOT_PUBLISH",
    )
    await fs.writeFile(path.join(dir, "content/inbox/a.md"), "---\npublish: false\n---\n" + note)
    await assert.rejects(prepare(dir), /明确禁止发布/)
  } finally {
    await fs.rm(dir, { recursive: true, force: true })
  }
})
