# 我的大学知识库

大学期间的数学、物理、化学与生物学习笔记，使用 Quartz 4.5.1 构建，通过 GitHub Actions 发布到 [网站](https://van-zxc.github.io/quartz/)。

当前发布335篇笔记和348张配图，按学科分类，支持搜索、公式、目录与双向链接。公开文章由 [发布清单](publication/manifest.json) 逐篇指定；`content/inbox` 的其他内容不会自动进入网页，原稿也不会因网页导出而改写。

当前开发和发布统一使用 `main`。每次推送会检查公开范围、生成精选文章、构建网站、检查链接及公式，然后部署。拉取请求只验证构建。

构建、增加文章和维护流程见 [网站发布说明](publication/README.md)。本项目沿用 [Quartz](https://github.com/jackyzha0/quartz) 的代码及其 [许可证](LICENSE.txt)。
