import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SiteHeader, SiteBeforeBody, SiteFooter } from "./quartz/components/MinimalBlog"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [SiteHeader],
  afterBody: [],
  footer: SiteFooter,
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [SiteBeforeBody],
  left: [],
  right: [],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [SiteBeforeBody],
  left: [],
  right: [],
}
