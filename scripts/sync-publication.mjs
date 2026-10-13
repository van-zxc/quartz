import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { createHash } from "node:crypto"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { prepare, root, publicationFolders } from "./publication.mjs"

const expectedOrigin = "git@github.com:van-zxc/quartz.git"
const manifestPath = "publication/manifest.json"

function run(repo, args, { binary = false } = {}) {
  const result = spawnSync("git", ["-C", repo, ...args], {
    encoding: binary ? undefined : "utf8", windowsHide: true,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }, maxBuffer: 16 * 1024 * 1024,
  })
  if (result.error || result.status !== 0) throw new Error(`Git ${args[0]} 失败：${result.error?.message ?? result.stderr?.toString().trim()}`)
  return binary ? result.stdout : result.stdout.trim()
}
const splitPaths = value => value.toString("utf8").split("\0").filter(Boolean)
const changed = repo => splitPaths(run(repo,["diff","--cached","--name-only","-z"],{binary:true}))
const isNote = name => publicationFolders.some(folder => name.startsWith("content/"+folder+"/")) && name.endsWith(".md")
const hash = bytes => createHash("sha256").update(bytes).digest("hex")

async function snapshot(repo, paths) {
  const result = new Map()
  for (const name of paths) {
    const file = path.resolve(repo,name)
    if (!file.startsWith(path.resolve(repo)+path.sep)) throw new Error("同步路径越界")
    const stat = await fs.lstat(file).catch(e=>{if(e.code!=="ENOENT")throw e;return null})
    if (stat?.isSymbolicLink()) throw new Error(`不能同步符号链接：${name}`)
    result.set(name,stat ? hash(await fs.readFile(file)) : null)
  }
  return result
}

async function currentNotePaths(repo) {
  const files=[]
  async function walk(relative) {
    const directory=path.join(repo,relative)
    if((await fs.lstat(directory)).isSymbolicLink())throw new Error("笔记目录不能是符号链接")
    for(const item of await fs.readdir(directory,{withFileTypes:true})) {
      if(item.name.startsWith("."))continue
      if(item.isSymbolicLink())throw new Error("笔记目录不能包含符号链接")
      const name=path.posix.join(relative,item.name)
      if(item.isDirectory())await walk(name)
      else if(item.isFile() && name.endsWith(".md"))files.push(name)
    }
  }
  for(const folder of publicationFolders)await walk("content/"+folder)
  return files
}

export async function acquireLock(repo) {
  const directory = run(repo,["rev-parse","--absolute-git-dir"])
  const file = path.join(directory,"quartz-publication-sync.lock")
  async function open() {return fs.open(file,"wx")}
  let handle
  try {handle=await open()}
  catch(e) {
    if(e.code!=="EEXIST")throw e
    const previous=JSON.parse(await fs.readFile(file,"utf8"))
    if(previous.host!==os.hostname() || !Number.isSafeInteger(previous.pid)) throw new Error("同步锁需要人工检查")
    let alive=true
    try {process.kill(previous.pid,0)} catch(error) {if(error.code==="ESRCH")alive=false}
    if(alive)throw new Error("已有同步任务正在运行")
    await fs.unlink(file)
    handle=await open()
  }
  const token=hash(Buffer.from(`${process.pid}:${Date.now()}:${Math.random()}`))
  await handle.writeFile(JSON.stringify({host:os.hostname(),pid:process.pid,token}))
  await handle.close()
  return async()=>{
    const current=JSON.parse(await fs.readFile(file,"utf8"))
    if(current.token===token)await fs.unlink(file)
  }
}

async function validate(repo) {
  const steps=[
    ["quartz/bootstrap-cli.mjs","build","-d",".publish-content"],
    ["scripts/repair-publication-links.mjs"],
    ["scripts/verify-publication.mjs"],
  ]
  for (const args of steps) {
    const result=spawnSync(process.execPath,args,{cwd:repo,encoding:"utf8",windowsHide:true,maxBuffer:32*1024*1024})
    if(result.error || result.status!==0)throw new Error(`网站检查失败：${args[0]}\n${result.error?.message ?? (result.stderr+result.stdout).slice(-6000)}`)
  }
}

export async function syncPublication({ repo=root, origin=expectedOrigin, prepareFn=prepare, validateFn=validate, check=false }={}) {
  repo=path.resolve(repo)
  const unlock=await acquireLock(repo)
  try {
    if(run(repo,["branch","--show-current"])!=="main")throw new Error("自动同步只在 main 分支执行")
    if(run(repo,["remote","get-url","origin"])!==origin)throw new Error("远程仓库与预期不一致")
    if(changed(repo).length)throw new Error("暂存区已有改动，保留这些改动并停止同步")
    const gitDir=run(repo,["rev-parse","--absolute-git-dir"])
    for(const name of ["MERGE_HEAD","CHERRY_PICK_HEAD","rebase-merge","rebase-apply"])
      if(await fs.stat(path.join(gitDir,name)).catch(()=>null))throw new Error("仓库正在合并或变基，停止同步")
    run(repo,["fetch","origin","main"])
    const counts=run(repo,["rev-list","--left-right","--count","HEAD...origin/main"]).split(/\s+/).map(Number)
    if(counts[0] && counts[1])throw new Error("本地与远程分支分叉，停止同步并保留现场")
    if(counts[1])run(repo,["merge","--ff-only","origin/main"])

    const previous=JSON.parse(run(repo,["show",`origin/main:${manifestPath}`]))
    const frozenNotes=await snapshot(repo,await currentNotePaths(repo))
    await prepareFn(repo)
    const manifest=JSON.parse(await fs.readFile(path.join(repo,manifestPath),"utf8"))
    if(manifest.mode!=="folders" || manifest.folders?.length!==publicationFolders.length || publicationFolders.some(f=>!manifest.folders.includes(f)))
      throw new Error("自动同步仅支持已授权的四个文件夹")
    const trackedNotes=splitPaths(run(repo,["ls-files","-z","--",...publicationFolders.map(f=>"content/"+f)],{binary:true})).filter(isNote)
    const currentNotes=manifest.notes.map(n=>"content/"+n.source)
    if(currentNotes.some(n=>!isNote(n)))throw new Error("笔记清单超出四科目录")
    const exportedNotes=await snapshot(repo,currentNotes)
    if(frozenNotes.size!==exportedNotes.size || [...frozenNotes].some(([p,h])=>exportedNotes.get(p)!==h))
      throw new Error("笔记在导出期间发生变化，留待下次同步")
    const assets=manifest.assets.map(a=>"content/"+a.source)
    const oldAssets=(previous.assets??[]).map(a=>"content/"+a.source)
    if([...assets,...oldAssets].some(a=>!a.startsWith("content/attachment/") || !/\.(png|jpe?g|gif|webp)$/i.test(a)))throw new Error("配图清单异常")
    const paths=[...new Set([manifestPath,...trackedNotes,...currentNotes,...assets])].sort()
    const allowed=new Set([...paths,...oldAssets])
    const pending=run(repo,["rev-list","--parents","origin/main..HEAD"]).split("\n").filter(Boolean)
    for(const commit of pending) {
      const parts=commit.split(" ")
      if(parts.length!==2)throw new Error("存在待推送的合并提交，停止自动推送")
      const names=splitPaths(run(repo,["diff-tree","--no-commit-id","--name-only","-r","-z",parts[0]],{binary:true}))
      if(names.some(n=>!allowed.has(n)))throw new Error("待推送提交包含发布范围以外的文件，停止自动推送")
    }
    const before=await snapshot(repo,paths)
    if(manifest.assets.some(a=>before.get("content/"+a.source)!==a.sha256))throw new Error("配图在导出期间发生变化，留待下次同步")
    await validateFn(repo)
    const after=await snapshot(repo,paths)
    if([...before].some(([p,h])=>after.get(p)!==h))throw new Error("笔记或图片在构建期间发生变化，留待下次同步")
    if(changed(repo).length)throw new Error("构建期间暂存区发生变化，停止同步")
    if(check)return {status:"checked",notes:manifest.notes.length,images:assets.length,pendingCommits:pending.length}
    const list=path.join(gitDir,"quartz-publication-sync.paths")
    await fs.writeFile(list,Buffer.from(paths.join("\0")+"\0","utf8"))
    try {run(repo,["add","--force",`--pathspec-from-file=${list}`,"--pathspec-file-nul"])}
    finally {await fs.unlink(list)}
    const staged=changed(repo)
    if(staged.some(n=>!allowed.has(n)))throw new Error("暂存范围异常，停止提交并保留现场")
    // Hash staged bytes rather than assuming an editor did not change them during git add.
    for(const name of staged) {
      const disk=await snapshot(repo,[name])
      if(disk.get(name)!==before.get(name))throw new Error("提交前文件发生变化，保留暂存内容并停止")
      if(disk.get(name)!==null) {
        const stagedBytes=run(repo,["show",`:${name}`],{binary:true})
        const workingBytes=await fs.readFile(path.join(repo,name))
        const clean=spawnSync("git",["-C",repo,"hash-object",`--path=${name}`,"--stdin"],{input:workingBytes,encoding:"utf8",windowsHide:true})
        if(clean.status!==0 || clean.stdout.trim()!==run(repo,["rev-parse",`:${name}`]))throw new Error("暂存版本与当前笔记不一致，停止提交")
        if(!stagedBytes.length && workingBytes.length)throw new Error("暂存文件异常")
      }
    }
    let committed=false
    if(staged.length) {
      const day=new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Shanghai"}).format(new Date())
      run(repo,["commit","-m",`自动同步四科笔记 ${day}`])
      committed=true
    }
    if(committed || pending.length)run(repo,["push","origin","main"])
    return {status:committed || pending.length ? "pushed" : "unchanged",notes:manifest.notes.length,images:assets.length,changedFiles:staged.length,commit:run(repo,["rev-parse","HEAD"])}
  } finally {await unlock()}
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {console.log(JSON.stringify(await syncPublication({check:process.argv.includes("--check")})))}
  catch(e) {console.error(`自动同步停止：${e.message}`);process.exitCode=1}
}
