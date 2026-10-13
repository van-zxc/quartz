import fs from "node:fs/promises"
import { createWriteStream } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"
import { finished } from "node:stream/promises"

const directory = path.dirname(fileURLToPath(import.meta.url))
const repo = path.dirname(directory)
const local = path.join(directory, "local")
await fs.mkdir(local, { recursive: true })
const startedAt = new Date().toISOString()
const log = createWriteStream(path.join(local, "latest.log"), { flags: "w" })
log.write(`开始同步：${startedAt}\n`)
let tail = ""
let result
let error
let exitCode = 1
try {
  const settings = JSON.parse(await fs.readFile(path.join(local, "settings.json"), "utf8"))
  if (!path.isAbsolute(settings.gitExecutable)) throw new Error("请先运行本地安装脚本，配置 Git 路径")
  await fs.access(settings.gitExecutable)
  const child = spawn(process.execPath, [path.join(repo, "scripts", "sync-publication.mjs")], {
    cwd: repo, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      PATH: [path.dirname(settings.gitExecutable), path.dirname(process.execPath), process.env.PATH].filter(Boolean).join(path.delimiter),
      GIT_TERMINAL_PROMPT: "0",
      GIT_SSH_COMMAND: "ssh -o BatchMode=yes -o ConnectTimeout=30",
    },
  })
  for (const output of [child.stdout, child.stderr]) {
    output.setEncoding("utf8")
    output.on("data", chunk => { log.write(chunk); tail = (tail + chunk).slice(-65536) })
  }
  exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject)
    child.once("close", (code, signal) => {
      if (signal) error = `同步进程被终止：${signal}`
      resolve(code ?? 1)
    })
  })
  for (const line of tail.trim().split(/\r?\n/).reverse()) {
    try { const value = JSON.parse(line); if (value.status) { result = value; break } } catch {}
  }
  if (exitCode !== 0) error ??= tail.trim().slice(-6000) || "同步脚本执行失败，请查看日志"
  if (exitCode === 0 && !["pushed", "unchanged"].includes(result?.status)) {
    exitCode = 1
    error = "同步脚本未返回完整结果，请查看日志"
  }
} catch (exception) {
  error = exception.message
  log.write(`运行失败：${error}\n`)
}
const status = { startedAt, finishedAt: new Date().toISOString(), exitCode, ...(result ? { result } : {}), ...(error ? { error } : {}) }
log.end(`\n结束同步：${status.finishedAt}，退出码：${exitCode}\n`)
await finished(log)
await fs.writeFile(path.join(local, "latest-status.json"), JSON.stringify(status, null, 2) + "\n", "utf8")
process.exitCode = exitCode
