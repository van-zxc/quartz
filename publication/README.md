# 网站发布说明

本站使用 Quartz 4.5.1，由 GitHub Actions 构建并部署到 GitHub Pages，目标网址为 https://van-zxc.github.io/quartz/ 。

## 发布范围

只有 `publication/manifest.json` 中逐篇列出的文章会进入网页。原稿来自 `content/inbox`；导出脚本只改网页副本，不改原稿。当前清单有16篇文字笔记：数学8篇、物理4篇、化学2篇、生物科学2篇。首次未携带任何附件；图片、文件嵌入、本地文件链接和未经审查的 HTML 会使构建失败。指向未公开文章的双链转为普通文字，选中文章之间保留双链。新增或删除文章需要同时更新清单和 `publication/index.md` 的导航。

## 本地构建

在仓库根目录运行以下命令。失败时先修复报错，再执行下一步。

```powershell
npm ci
node --test scripts/publication.test.mjs
node scripts/publication.mjs
npx quartz build -d .publish-content
node scripts/verify-publication.mjs
```

预览可运行 `npx quartz build -d .publish-content --serve`。`.publish-content`、`.publication-report.json` 和 `public` 都是构建产物，无需提交。不要直接构建整个 `content`；发布流程以清单导出的目录为输入。

## GitHub 设置与上线

1. 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。Custom domain 留空，使用默认网址。
2. Settings → Environments → github-pages，核对 Deployment branches and tags，允许发布分支 `v4`。如有其他审批规则，保留并按规则审批；无需删除环境。
3. 只提交发布文件和已选文章的改动，推送 `v4`，或在 Actions 中手动运行“发布精选笔记到 GitHub Pages”。拉取请求只执行构建和核查，不部署生产网站。
4. 确认 build 和 deploy 均成功，再访问默认网址，检查首页、搜索、文章链接和公式。

## 后续维护

增加文章前检查：正文有实际内容，章节没有明显占位，公式能渲染，内容适合公开。当前已知需要整理的例子包括正态分布的密度系数、排列数的分母、维数公式的符号、直和定义以及 L-C 电路的方程，因此这些文章未纳入首批。首批文章按公开展示需要筛选，不等于所有学术陈述已逐项验证。

网页筛选不控制 GitHub 源码可见性：此仓库已经公开，历史提交和已提交的其他笔记仍可从仓库浏览。`.gitignore` 不会隐藏已经跟踪的文件。后续推送应显式列出文件，避免 `git add .` 或未经检查的 `quartz sync` 把本地其他资料一并提交。
