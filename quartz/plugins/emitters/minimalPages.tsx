import { QuartzEmitterPlugin } from "../types"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { pageResources, renderPage } from "../../components/renderPage"
import { sharedPageComponents } from "../../../quartz.layout"
import { SiteBody } from "../../components/MinimalBlog"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"

export const MinimalPages: QuartzEmitterPlugin = () => {
  const layout: FullPageLayout = {
    ...sharedPageComponents,
    beforeBody: [],
    pageBody: SiteBody,
    left: [],
    right: [],
  }
  async function* emit(
    ctx: Parameters<NonNullable<ReturnType<QuartzEmitterPlugin>["emit"]>>[0],
    content: Parameters<NonNullable<ReturnType<QuartzEmitterPlugin>["emit"]>>[1],
    resources: Parameters<NonNullable<ReturnType<QuartzEmitterPlugin>["emit"]>>[2],
  ) {
    const allFiles = content.map(([, file]) => file.data)
    for (const [name, title] of [
      ["notes", "学习笔记"],
      ["annotations", "阅读批注"],
      ["questions", "未解决的问题"],
    ]) {
      const slug = name as FullSlug
      const [tree, file] = defaultProcessedContent({
        slug,
        text: title,
        description: title,
        frontmatter: { title, tags: [] },
      })
      const externalResources = pageResources(pathToRoot(slug), resources)
      const props = {
        ctx,
        fileData: file.data,
        cfg: ctx.cfg.configuration,
        children: [],
        tree,
        allFiles,
        externalResources,
      }
      yield write({
        ctx,
        slug,
        ext: ".html",
        content: renderPage(ctx.cfg.configuration, slug, props, layout, externalResources),
      })
    }
  }
  return {
    name: "MinimalPages",
    getQuartzComponents: () => [layout.head, ...layout.header, SiteBody, layout.footer],
    emit,
    partialEmit: emit,
  }
}
