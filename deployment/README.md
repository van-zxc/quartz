# 本地每日发布

部署文件全部保存在 `E:\ObsidianVaults`。Windows 任务计划程序每天本机时间09:15运行，无需启动 Codex、Obsidian 或浏览器。本机使用北京时间；时区改变后按新的本机时间执行。电脑需要开机、联网并登录 Windows，可以锁屏。错过时间后会在可运行时补执行；失败后每隔10分钟重试，最多3次，同一时间只运行一个任务。

`run-daily-publication.mjs` 是定时启动入口，调用仓库已有的 `scripts/sync-publication.mjs`。它更新四科笔记及实际引用的图片，构建检查通过后提交并推送；有变化才提交，GitHub Actions 收到推送后部署。GitHub 每天北京时间09:45另构建已上传的内容，不能读取尚未同步的本地文件。

`install-daily-publication.ps1` 安装或调整 Windows 任务 `ObsidianVaults-DailyPublish`，使用当前登录用户的普通权限和现有 Git 身份，不保存账户密码。依赖已安装的 Node.js、Git、仓库的 `node_modules` 和当前用户可用的 GitHub SSH 身份。迁移电脑或路径后重新安装；缺少依赖时先在仓库执行 `npm ci`。

在 PowerShell 中安装或调整时间：

```powershell
& 'E:\ObsidianVaults\deployment\install-daily-publication.ps1' -At '09:15'
```

安装并立即运行可加 `-RunNow`。已安装后，手动运行一次：

```powershell
Start-ScheduledTask -TaskName 'ObsidianVaults-DailyPublish'
```

打开 Windows“任务计划程序”，在“任务计划程序库”中搜索该名称，可修改时间、运行、禁用或删除。任务通过 Windows 自带的脚本宿主隐藏启动，不弹出终端窗口。日志和配置均在 `deployment\local`：`latest.log` 保留最近一次执行详情，`latest-status.json` 记录时间、退出码、提交编号和同步结果，`settings.json` 记录本机工具路径，`hidden-launch.vbs` 是隐藏启动命令，`daily-publication.task.xml` 保存本机任务定义。这些本机文件已从 Git 提交中排除。

查看最近一次结果：

```powershell
Get-ScheduledTaskInfo -TaskName 'ObsidianVaults-DailyPublish'
Get-Content -LiteralPath 'E:\ObsidianVaults\deployment\local\latest-status.json'
```

退出码0表示完成，`unchanged` 表示本地内容没有变化，`pushed` 表示已上传并触发部署；可在[部署记录](https://github.com/van-zxc/quartz/actions)核对后续构建和上线。非零退出码时查看日志；暂存区已有内容、分支冲突或笔记在构建期间被编辑时，同步会停止并保留现场。处理后手动运行即可。停用任务可执行 `Disable-ScheduledTask -TaskName 'ObsidianVaults-DailyPublish'`；恢复使用 `Enable-ScheduledTask`，删除使用 `Unregister-ScheduledTask -TaskName 'ObsidianVaults-DailyPublish' -Confirm:$false`。
