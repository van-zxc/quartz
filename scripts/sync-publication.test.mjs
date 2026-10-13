import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { syncPublication, acquireLock } from "./sync-publication.mjs"
import { publicationFolders } from "./publication.mjs"

function git(repo,...args) {
  const result=spawnSync("git",["-C",repo,...args],{encoding:"utf8",windowsHide:true})
  assert.equal(result.status,0,result.stderr)
  return result.stdout.trim()
}
async function fixture() {
  const base=await fs.mkdtemp(path.join(os.tmpdir(),"quartz-sync-test-"))
  const repo=path.join(base,"repo"),origin=path.join(base,"origin.git")
  await fs.mkdir(repo);await fs.mkdir(origin)
  git(origin,"init","--bare","--initial-branch=main")
  git(repo,"init","--initial-branch=main")
  git(repo,"config","user.name","Sync Test");git(repo,"config","user.email","sync@example.invalid")
  git(repo,"remote","add","origin",origin)
  await fs.mkdir(path.join(repo,"publication"))
  await fs.mkdir(path.join(repo,"content/attachment"),{recursive:true})
  for(const folder of publicationFolders)await fs.mkdir(path.join(repo,"content",folder),{recursive:true})
  const existing="content/inbox/数学/现有.md",deleted="content/inbox/数学/已删.md"
  await fs.writeFile(path.join(repo,existing),"原稿")
  await fs.writeFile(path.join(repo,deleted),"待删除")
  await fs.writeFile(path.join(repo,"content/private.md"),"私人原稿")
  const manifest={version:1,mode:"folders",folders:publicationFolders,notes:[
    {source:existing.slice(8),output:existing.slice(14),topic:"数学"},
    {source:deleted.slice(8),output:deleted.slice(14),topic:"数学"},
  ],assets:[]}
  const save=()=>fs.writeFile(path.join(repo,"publication/manifest.json"),JSON.stringify(manifest)+"\n")
  await save();git(repo,"add",".");git(repo,"commit","-m","initial");git(repo,"push","--set-upstream","origin","main")
  return {base,repo,origin,manifest,existing,deleted,save,
    prepareFn:async()=>{await save()},validateFn:async()=>{},
    cleanup:()=>fs.rm(base,{recursive:true,force:true})}
}

test("真实提交和推送仅包含四科笔记、引用配图、清单和已删除笔记",async()=>{
  const f=await fixture()
  try {
    await fs.writeFile(path.join(f.repo,f.existing),"更新正文")
    await fs.unlink(path.join(f.repo,f.deleted));f.manifest.notes.pop()
    const added="content/inbox/物理/新增.md",asset="content/attachment/引用.png"
    await fs.writeFile(path.join(f.repo,added),"新笔记 ![[引用.png]]")
    const bytes=Buffer.from([137,80,78,71,13,10,26,10])
    await fs.writeFile(path.join(f.repo,asset),bytes)
    f.manifest.notes.push({source:added.slice(8),output:added.slice(14),topic:"物理"})
    f.manifest.assets.push({source:asset.slice(8),output:"assets/test.png",sha256:createHash("sha256").update(bytes).digest("hex")})
    await fs.writeFile(path.join(f.repo,"content/private.md"),"私人改动")
    await fs.writeFile(path.join(f.repo,"content/private-new.md"),"不应上传")
    const result=await syncPublication(f)
    assert.equal(result.status,"pushed")
    assert.equal(git(f.origin,"show","main:"+f.existing),"更新正文")
    assert.equal(git(f.origin,"show","main:content/private.md"),"私人原稿")
    const tree=git(f.origin,"-c","core.quotepath=false","ls-tree","-r","--name-only","main")
    assert.ok(tree.includes(added) && tree.includes(asset))
    assert.ok(!tree.includes(f.deleted) && !tree.includes("private-new.md"))
    assert.equal(await fs.readFile(path.join(f.repo,"content/private.md"),"utf8"),"私人改动")
    assert.equal((await syncPublication(f)).status,"unchanged")
    assert.equal(git(f.repo,"diff","--cached","--name-only"),"")
  } finally {await f.cleanup()}
})

test("已有暂存内容时不提交、不推送、不重置暂存区",async()=>{
  const f=await fixture()
  try {
    await fs.writeFile(path.join(f.repo,"content/private.md"),"用户暂存内容")
    git(f.repo,"add","content/private.md")
    const before=git(f.repo,"rev-parse","HEAD")
    await assert.rejects(syncPublication(f),/暂存区已有改动/)
    assert.equal(git(f.repo,"rev-parse","HEAD"),before)
    assert.equal(git(f.origin,"rev-parse","main"),before)
    assert.equal(git(f.repo,"show",":content/private.md"),"用户暂存内容")
  } finally {await f.cleanup()}
})

test("网站验证失败或构建期间笔记变化时不上传",async()=>{
  const f=await fixture()
  try {
    const before=git(f.repo,"rev-parse","HEAD")
    await assert.rejects(syncPublication({...f,validateFn:async()=>{throw Error("验证失败")}}),/验证失败/)
    await assert.rejects(syncPublication({...f,prepareFn:async()=>{await f.save();await fs.writeFile(path.join(f.repo,f.existing),"导出期间的并发修改")}}),/导出期间发生变化/)
    await assert.rejects(syncPublication({...f,validateFn:async()=>fs.writeFile(path.join(f.repo,f.existing),"编辑器的并发修改")}),/构建期间发生变化/)
    assert.equal(git(f.origin,"rev-parse","main"),before)
    assert.equal(git(f.repo,"diff","--cached","--name-only"),"")
  } finally {await f.cleanup()}
})

test("不推送发布范围外的已有提交，也不覆盖已有同步任务",async()=>{
  const f=await fixture()
  try {
    await fs.writeFile(path.join(f.repo,"content/private.md"),"不应被自动推送的提交")
    git(f.repo,"add","content/private.md");git(f.repo,"commit","-m","private change")
    const before=git(f.origin,"rev-parse","main")
    await assert.rejects(syncPublication(f),/发布范围以外/)
    assert.equal(git(f.origin,"rev-parse","main"),before)
    const release=await acquireLock(f.repo)
    try {await assert.rejects(syncPublication(f),/已有同步任务/)} finally {await release()}
  } finally {await f.cleanup()}
})

test("检查模式执行验证但不暂存或推送，合法的待推送提交可重试",async()=>{
  const f=await fixture()
  try {
    await fs.writeFile(path.join(f.repo,f.existing),"可重试内容")
    const before=git(f.origin,"rev-parse","main")
    const checked=await syncPublication({...f,check:true})
    assert.equal(checked.status,"checked")
    assert.equal(git(f.repo,"diff","--cached","--name-only"),"")
    assert.equal(git(f.origin,"rev-parse","main"),before)
    git(f.repo,"add",f.existing);git(f.repo,"commit","-m","public change")
    assert.equal((await syncPublication(f)).status,"pushed")
    assert.equal(git(f.origin,"show","main:"+f.existing),"可重试内容")
  } finally {await f.cleanup()}
})
