param(
    [ValidatePattern('^([01][0-9]|2[0-3]):[0-5][0-9]$')][string]$At = '09:15',
    [switch]$RunNow
)
$ErrorActionPreference = 'Stop'
$taskName = 'ObsidianVaults-DailyPublish'
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$local = Join-Path $PSScriptRoot 'local'
$runner = Join-Path $PSScriptRoot 'run-daily-publication.mjs'
$node = (Get-Command node.exe -ErrorAction Stop).Source
$git = (Get-Command git.exe -ErrorAction Stop).Source
$shell = Join-Path $env:SystemRoot 'System32\wscript.exe'
if (!(Test-Path -LiteralPath $runner) -or !(Test-Path -LiteralPath (Join-Path $repo 'scripts\sync-publication.mjs'))) {
    throw '找不到发布脚本，请保留 deployment 与 scripts 在同一个仓库中。'
}
$gitDir = & $git -C $repo rev-parse --absolute-git-dir
if ($LASTEXITCODE -ne 0) { throw '当前目录不是有效的 Git 仓库。' }
$origin = & $git -C $repo remote get-url origin
if ($LASTEXITCODE -ne 0 -or $origin -ne 'git@github.com:van-zxc/quartz.git') { throw '远程仓库与预期不一致。' }
$existing = Get-ScheduledTask -TaskName $taskName -TaskPath '\' -ErrorAction SilentlyContinue
if ($existing -and ($existing.Actions.WorkingDirectory -ne $repo)) { throw '同名任务属于其他目录，停止覆盖。' }
New-Item -ItemType Directory -Path $local -Force | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)
$exclude = Join-Path $gitDir 'info\exclude'
$excludeParent = Split-Path -Parent $exclude
New-Item -ItemType Directory -Path $excludeParent -Force | Out-Null
$oldExclude = if (Test-Path -LiteralPath $exclude) { [IO.File]::ReadAllText($exclude) } else { '' }
if (($oldExclude -split '\r?\n') -notcontains '/deployment/local/') {
    [IO.File]::AppendAllText($exclude, "`n/deployment/local/`n", $utf8)
}
[IO.File]::WriteAllText((Join-Path $local 'settings.json'), (@{ gitExecutable = $git; nodeExecutable = $node } | ConvertTo-Json), $utf8)
$launcher = Join-Path $local 'hidden-launch.vbs'
$command = '"' + $node + '" "' + $runner + '"'
$vbs = 'Set shell = CreateObject("WScript.Shell")' + "`r`n" + 'WScript.Quit shell.Run("' + $command.Replace('"', '""') + '", 0, True)' + "`r`n"
[IO.File]::WriteAllText($launcher, $vbs, [Text.Encoding]::Unicode)
$argument = '//B //NoLogo "' + $launcher + '"'
$action = New-ScheduledTaskAction -Execute $shell -Argument $argument -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -Daily -At $At
$identity = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 1) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 10)
$task = New-ScheduledTask -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description '每天同步本地四科笔记并推送，由 GitHub Actions 部署网站。'
Register-ScheduledTask -TaskName $taskName -TaskPath '\' -InputObject $task -Force | Out-Null
$xml = Export-ScheduledTask -TaskName $taskName -TaskPath '\'
[IO.File]::WriteAllText((Join-Path $local 'daily-publication.task.xml'), $xml, [Text.Encoding]::Unicode)
if ($RunNow) { Start-ScheduledTask -TaskName $taskName -TaskPath '\' }
Write-Output "已启用任务 $taskName，每天本机时间 $At 执行；日志保存在 $local。"
