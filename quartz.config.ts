import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { SiteBody } from "./quartz/components/MinimalBlog"
import { MinimalPages } from "./quartz/plugins/emitters/minimalPages"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "行间",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "van-zxc.github.io/quartz",
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      "模板/**",
      "文献摘录/**",
      "阅读笔记/文献/**",
      "灵感/**",
      "attachment/文献/**",
      "attachment/Flomo/**",
      "attachment/电子书/**",
      "书籍摘录/**",
      "书籍/**",
      "项目/资料入库待确认.md",
      "资料工作流导航.md",
      "工作流使用说明.md",
      "项目/工作流试用.md",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Noto Serif SC",
        body: "Microsoft YaHei",
        code: "Consolas",
      },
      colors: {
        lightMode: {
          light: "#faf9f6",
          lightgray: "#e5e3dc",
          gray: "#6d6c66",
          darkgray: "#33312f",
          dark: "#33312f",
          secondary: "#67464f",
          tertiary: "#56634f",
          highlight: "rgba(103, 70, 79, 0.06)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#232422",
          lightgray: "#3c3e38",
          gray: "#afaea6",
          darkgray: "#e4e3dc",
          dark: "#e4e3dc",
          secondary: "#d3aeb8",
          tertiary: "#56634f",
          highlight: "rgba(103, 70, 79, 0.06)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, parseTags: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "absolute" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts(), Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage({ pageBody: SiteBody }),
      MinimalPages(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(), // Only copies explicitly selected images from .publish-content.
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // 精选笔记使用默认分享图，避免构建依赖外部字体服务。
    ],
  },
}

export default config
