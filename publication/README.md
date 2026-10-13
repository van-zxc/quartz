# 网站发布说明

本站使用 Quartz 4.5.1，由 GitHub Actions 构建并部署到 GitHub Pages，目标网址为 https://van-zxc.github.io/quartz/ 。

## 发布范围

只有 `publication/manifest.json` 中逐篇列出的文章及图片会进入网页。原稿来自 `content/inbox`，导出脚本只调整网页副本，不改原稿。当前清单共335篇：数学129篇、物理73篇、化学31篇、生物科学102篇，附带348张正文实际引用的图片。首页提供学科目录和精选入口，目录随清单自动生成。

此次检查了四个学科的617篇笔记；空白、占位、未完成章节、未填写列表项、本地资料引用、无法渲染的公式及明显需校订的内容暂缓发布。筛选依据是公开展示完整度，学术陈述未逐项审校。

图片必须来自清单指定的附件文件；脚本校验文件类型、大小、内容摘要与路径，拒绝隐藏文件、目录越界、符号链接、文献或电子书目录、未选择的图片及脚本。清单是白名单，不能用整个附件目录代替。

指向未公开文章的双链转为普通文字；公开文章之间保留链接和正文嵌入。两种旧闭合曲面积分写法在网页副本中换为等价的标准符号，代码示例不变。已存在文章中失效的章节链接回退到文章入口，缺页仍使核查失败。

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
3. 只提交发布文件和已选文章的改动，推送 `main`，或在 Actions 中手动运行“发布精选笔记到 GitHub Pages”。拉取请求只执行构建和核查，不部署生产网站。
4. 确认 build 和 deploy 均成功，再访问默认网址，检查首页、搜索、文章链接和公式。

## 后续维护

增加文章前检查正文、章节、公式及适合公开的范围，然后更新清单；带图文章同时加入实际引用的图片，图片摘要可用 `Get-FileHash -Algorithm SHA256` 获取并转成小写。图片改变后须复核并更新摘要。正态分布、排列与组合、维数公式、直和、L-C 电路，以及本轮公式分隔符异常的 t 分布、行列式等仍暂缓。

网页筛选不控制 GitHub 源码可见性：此仓库已经公开，历史提交和已提交的其他笔记仍可从仓库浏览。`.gitignore` 不会隐藏已经跟踪的文件。后续推送应显式列出文件，避免 `git add .` 或未经检查的 `quartz sync` 把本地其他资料一并提交。
