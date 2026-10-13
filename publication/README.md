# 网站发布说明

本站使用 Quartz 4.5.1，由 GitHub Actions 构建并部署到 GitHub Pages，目标网址为 https://van-zxc.github.io/quartz/ 。

## 发布范围

当前采用四个文件夹全量发布模式，`publication/manifest.json` 中的 `mode` 为 `folders`，固定扫描 `content/inbox/数学`、`content/inbox/物理`、`content/inbox/化学`、`content/inbox/生物科学`。不再按篇幅、章节完成度或草稿标题筛选；空白条目也会生成页面。当前共617篇笔记：数学184篇、物理152篇、化学107篇、生物科学174篇，正文实际引用的图片共479张。

每次构建自动更新清单，再从清单导出网页副本；以后在这四个文件夹中新增或修改笔记并推送，就会一并发布。其他文件夹不在自动发布范围。当前617篇没有显式 `publish: false` 或 `draft: true` 标记；未来若加入这些标记，构建会停止，避免误公开。

图片仅从正文引用建立清单，核查类型、大小、摘要和路径，拒绝目录越界、符号链接、隐藏文件以及文献或电子书目录。不会复制整个附件目录。

所有原稿保持原样。网页副本整理显示公式分隔符、适配旧闭合曲面积分写法；仍无法渲染的公式以原文显示，不改写公式含义。公开笔记之间保留链接和正文嵌入，未公开目标显示引用名称。失效章节链接回退到文章入口，缺页仍使检查失败。`#补充` 等原稿标记保留为文字，学科分类使用页面元数据，避免旧版本的标签路径问题。

## 本地构建

在仓库根目录运行以下命令。失败时先修复报错，再执行下一步。

```powershell
npm ci
node --test scripts/publication.test.mjs
node scripts/publication.mjs
npx quartz build -d .publish-content
node scripts/repair-publication-links.mjs
node scripts/verify-publication.mjs
```

预览可运行 `npx quartz build -d .publish-content --serve`。`.publish-content`、`.publication-report.json` 和 `public` 都是构建产物，无需提交。不要直接构建整个 `content`；发布流程以清单导出的目录为输入。

## GitHub 设置与上线

1. 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。Custom domain 留空，使用默认网址。
2. Settings → Environments → github-pages，核对 Deployment branches and tags，允许发布分支 `main`。如有其他审批规则，保留并按规则审批；无需删除环境。
3. 只提交发布文件和已选文章的改动，推送 `main`，或在 Actions 中手动运行“发布四科学习笔记到 GitHub Pages”。拉取请求只执行构建和核查，不部署生产网站。
4. 确认 build 和 deploy 均成功，再访问默认网址，检查首页、搜索、文章链接和公式。

## 每日自动更新

每天北京时间09:15，当前聊天的自动任务运行 `node scripts/sync-publication.mjs`，读取本机四科笔记及引用配图，先构建和核查，再窄范围提交并推送。有内容变化才生成提交，推送后 GitHub Actions 自动部署。没有变化时不会生成空提交。GitHub 另在每天北京时间09:45定时构建已经上传的内容，作为独立的云端更新流程。

本地同步需要电脑开机、网络可用，且 Codex 桌面应用保持运行。GitHub 无法直接读取本机 `E:\ObsidianVaults`；电脑或应用关闭时，云端定时构建只能使用已经推送的笔记。公开仓库长期无活动时，GitHub 可能停用定时构建，届时在 Actions 中重新启用。

脚本只同步四科目录中的 Markdown 笔记（包含已发生的删除）、正文引用的图片，以及生成的发布清单。其他资料不会自动加入提交。暂存区非空、分支分叉、已有待推送提交越界、构建失败或文件在构建期间被编辑时，脚本停止并保留现场。

手动执行一次：`node scripts/sync-publication.mjs`。仅检查不提交：`node scripts/sync-publication.mjs --check`。自动任务及运行结果可在应用的“定时任务”中查看、调整或暂停；同步成功后可在 GitHub Actions 查看部署结果。

## 后续维护

增补笔记时，只提交四个学科文件夹内的预期改动和它们实际引用的图片，再推送 `main`。不用逐篇编辑清单，也不用手动维护首页文章列表。清单在构建时重新生成。

全量发布保留了空白、草稿和学习时的表述，不等于笔记内容已逐项审校。需要整理时修改原稿，推送后网页会更新。

网页发布范围不控制 GitHub 源码可见性：此仓库已经公开，历史提交和已提交的其他笔记仍可从仓库浏览。`.gitignore` 不会隐藏已经跟踪的文件。后续推送应显式列出文件，避免 `git add .` 或未经检查的 `quartz sync` 把本地其他资料一并提交。
