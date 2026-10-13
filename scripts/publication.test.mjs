import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { prepare, safePath, transformBody, validateRaster, resolveTarget } from "./publication.mjs"
import { createHash } from "node:crypto"
import { repairHtmlAnchors } from "./repair-publication-links.mjs"
import { compatibleMath } from "./math-compatibility.mjs"
import { publicationFolders } from "./publication.mjs"
import { normalizeDisplayMath, preserveUnrenderableMath } from "./full-math.mjs"

test("只整理显示公式分隔符，代码和数学表达式保留", () => {
  assert.equal(normalizeDisplayMath("$$x^2$$正文"),"\n$$\nx^2\n$$\n正文")
  assert.equal(normalizeDisplayMath("```text\n$$x$$\n```"),"```text\n$$x$$\n```")
  assert.equal(normalizeDisplayMath("$r$$\\iff$"),"$r$$\\iff$")
  const changes=[]
  const body=preserveUnrenderableMath("$\\UnknownCommand{x}$ 和 $x^2$","inbox/a.md",changes)
  assert.ok(body.includes("`\\UnknownCommand{x}`") && body.includes("$x^2$"))
  assert.equal(changes.length,1)
})

test("文件夹发布覆盖四科全部笔记，包括空白和草稿；其他文件夹不进入网页", async () => {
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),"quartz-folders-"))
  try {
    await fs.mkdir(path.join(dir,"publication"))
    await fs.mkdir(path.join(dir,"content/attachment"),{recursive:true})
    for (const folder of publicationFolders) {
      await fs.mkdir(path.join(dir,"content",folder),{recursive:true})
      await fs.writeFile(path.join(dir,"content",folder,"空白.md"),"")
      await fs.writeFile(path.join(dir,"content",folder,"草稿.md"),"# 待补充\n\n![[未公开的外部笔记]]")
    }
    await fs.mkdir(path.join(dir,"content/inbox/私人"),{recursive:true})
    await fs.writeFile(path.join(dir,"content/inbox/私人/秘密.md"),"DO_NOT_PUBLISH")
    await fs.writeFile(path.join(dir,"publication/index.md"),"---\npublish: true\n---\n首页")
    await fs.writeFile(path.join(dir,"publication/manifest.json"),JSON.stringify({version:1,mode:"folders",folders:publicationFolders,notes:[],assets:[]}))
    await prepare(dir)
    const manifest=JSON.parse(await fs.readFile(path.join(dir,"publication/manifest.json"),"utf8"))
    assert.equal(manifest.notes.length,8)
    assert.equal(await fs.readFile(path.join(dir,"content/inbox/数学/空白.md"),"utf8"),"")
    assert.ok((await fs.readFile(path.join(dir,".publish-content/数学/草稿.md"),"utf8")).includes("引用：未公开的外部笔记"))
    assert.ok((await fs.readFile(path.join(dir,".publish-content/数学/空白.md"),"utf8")).includes("尚无正文"))
    await fs.writeFile(path.join(dir,"content/inbox/数学/新增.md"),"新增内容")
    await prepare(dir)
    assert.equal(JSON.parse(await fs.readFile(path.join(dir,"publication/manifest.json"),"utf8")).notes.length,9)
  } finally {await fs.rm(dir,{recursive:true,force:true})}
})

test("旧闭合曲面积分改用等价标准符号，其他公式不改", () => {
  const legacy = String.raw`\newcommand{\oiint}{{\subset\!\supset} \mathllap{\iint}}{\oiint}`
  assert.equal(compatibleMath(`$$${legacy}_{S} F \\cdot dS = Q$$`),String.raw`$$\oiint_{S} F \cdot dS = Q$$`)
  assert.equal(compatibleMath(String.raw`$x^2$ $$\int f(x)\,dx$$`),String.raw`$x^2$ $$\int f(x)\,dx$$`)
  assert.equal(compatibleMath("`" + legacy + "`"),"`" + legacy + "`")
})

test("只允许白名单图片，公式和代码中的图名保持原样", () => {
  const assets = [{source: "attachment/甲.png", output: "assets/abc.png"}]
  const body = "![[甲.png|300]] `![[甲.png]]` $x+[[甲.png]]$"
  assert.equal(transformBody(body, "inbox/a.md", [], [], assets), "![[assets/abc.png|300]] `![[甲.png]]` $x+[[甲.png]]$")
  assert.throws(() => transformBody("![[秘密.png]]", "inbox/a.md", [], [], assets))
  assert.throws(() => validateRaster(Buffer.from("<script>bad</script>"), "attachment/a.png"))
  assert.throws(() => validateRaster(Buffer.from("<svg></svg>"), "attachment/a.svg"))
})

test("同名笔记先使用完整路径，歧义目标不任意连接", () => {
  const notes = [
    {source:"inbox/数学/甲.md",output:"数学/甲.md"},
    {source:"inbox/物理/甲.md",output:"物理/甲.md"},
  ]
  assert.equal(resolveTarget("甲", "inbox/数学/乙.md", notes),notes[0])
  assert.equal(resolveTarget("甲", "inbox/化学/乙.md", notes),undefined)
  assert.equal(resolveTarget("物理/甲", "inbox/数学/乙.md", notes),notes[1])
})

test("仅修复已存在文章的失效锚点，不掩盖缺页或改写有效链接", () => {
  const pages = new Map([["数学/甲.html",new Set(["定义"])]])
  const html = '<a href="甲#定义">有效</a><a href="甲#旧标题">旧标题</a><a href="私密#定义">缺页</a>'
  const result = repairHtmlAnchors(html,"数学/乙.html",pages)
  assert.equal(result.html,'<a href="甲#定义">有效</a><a href="甲">旧标题</a><a href="私密#定义">缺页</a>')
  assert.equal(result.repairs.length,1)
})

test("导出只携带核对过的图片，拒绝越界和被替换的附件", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "quartz-assets-"))
  try {
    await fs.mkdir(path.join(dir,"publication"))
    await fs.mkdir(path.join(dir,"content/inbox"),{recursive:true})
    await fs.mkdir(path.join(dir,"content/attachment"),{recursive:true})
    const image = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=","base64")
    const asset = {source:"attachment/a.png",output:"assets/a.png",sha256:createHash("sha256").update(image).digest("hex")}
    const manifest = {version:1,notes:[{source:"inbox/a.md",output:"数学/a.md",topic:"数学"}],assets:[asset]}
    await fs.writeFile(path.join(dir,"content/attachment/a.png"),image)
    await fs.writeFile(path.join(dir,"content/attachment/private.png"),"DO_NOT_PUBLISH")
    await fs.writeFile(path.join(dir,"content/inbox/a.md"),"完整文章。".repeat(50)+"![[a.png]]")
    await fs.writeFile(path.join(dir,"publication/index.md"),"---\npublish: true\n---\n首页")
    const save = () => fs.writeFile(path.join(dir,"publication/manifest.json"),JSON.stringify(manifest))
    await save(); await prepare(dir)
    assert.deepEqual(await fs.readdir(path.join(dir,".publish-content/assets")),["a.png"])
    assert.deepEqual(await fs.readFile(path.join(dir,".publish-content/assets/a.png")),image)
    asset.source="attachment/../inbox/a.md"; await save()
    await assert.rejects(prepare(dir), /不允许的发布路径/)
    asset.source="attachment/a.png"; await save()
    await fs.writeFile(path.join(dir,"content/attachment/a.png"),Buffer.concat([image,Buffer.from("changed")]))
    await assert.rejects(prepare(dir),/图片发生变化/)
  } finally {await fs.rm(dir,{recursive:true,force:true})}
})

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
