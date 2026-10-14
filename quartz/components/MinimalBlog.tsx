import { QuartzComponent, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import Content from "./pages/Content"
import Search from "./Search"
import Darkmode from "./Darkmode"
// @ts-ignore
import script from "./scripts/minimal-blog.inline"

const subjects = ["数学", "物理", "化学", "生物科学"]
const picks = [
  "外微分",
  "奇异值分解(SVD)",
  "卡诺循环",
  "细胞通讯与信号转导",
  "晶体场理论",
  "全概率公式",
  "菲涅尔定律",
  "细胞膜",
]
const NativeContent = Content()
const SearchWidget = Search({ enablePreview: false })
const DarkmodeWidget = Darkmode()
const href = (base: string, slug: string) =>
  `${base}/${slug.split("/").map(encodeURIComponent).join("/")}`
const publishedNotes = (props: QuartzComponentProps) =>
  props.allFiles
    .filter((file) => subjects.includes(file.slug?.split("/")[0] ?? ""))
    .map((file) => ({
      slug: file.slug!,
      title: file.frontmatter?.title ?? "",
      topic: file.slug!.split("/")[0],
      path: file.slug!.split("/").slice(0, -1).join(" / "),
    }))
    .sort(
      (a, b) =>
        subjects.indexOf(a.topic) - subjects.indexOf(b.topic) ||
        a.title.localeCompare(b.title, "zh-CN"),
    )

export const SiteHeader: QuartzComponent = (props) => {
  const base = pathToRoot(props.fileData.slug!)
  const slug = props.fileData.slug!
  const current = subjects.includes(slug.split("/")[0]) ? "notes" : slug
  return (
    <div class="blog-header">
      <a class="blog-brand" href={`${base}/`}>
        行间
      </a>
      <nav class="blog-nav" aria-label="主导航" id="blog-nav">
        <a href={`${base}/`} aria-current={current === "index" ? "page" : undefined}>
          首页
        </a>
        <a href={`${base}/notes`} aria-current={current === "notes" ? "page" : undefined}>
          学习笔记
        </a>
        <a
          href={`${base}/annotations`}
          aria-current={current === "annotations" ? "page" : undefined}
        >
          阅读批注
        </a>
      </nav>
      <div class="blog-tools">
        <SearchWidget {...props} />
        <DarkmodeWidget {...props} />
        <button
          class="blog-menu"
          aria-label="展开导航"
          aria-controls="blog-nav"
          aria-expanded="false"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
SiteHeader.css = [SearchWidget.css!, DarkmodeWidget.css!].flat()
SiteHeader.beforeDOMLoaded = DarkmodeWidget.beforeDOMLoaded
SiteHeader.afterDOMLoaded = [SearchWidget.afterDOMLoaded!, script].flat()

function Filters() {
  return (
    <div class="blog-filters" aria-label="筛选学科">
      {["全部", ...subjects].map((topic, i) => (
        <button class="blog-filter" data-topic={topic} aria-pressed={i === 0}>
          {topic === "生物科学" ? "生物" : topic}
        </button>
      ))}
    </div>
  )
}
function Rows({
  notes,
  base,
  limit,
  compact = false,
}: {
  notes: ReturnType<typeof publishedNotes>
  base: string
  limit: number
  compact?: boolean
}) {
  return (
    <div class="blog-note-list">
      {notes.map((note, i) => (
        <a
          class="blog-note-row"
          href={href(base, note.slug)}
          data-topic={note.topic}
          hidden={i >= limit}
        >
          <div>
            <h3>{note.title}</h3>
            {!compact && <p>{note.path}</p>}
          </div>
          <span>{note.topic === "生物科学" ? "生物" : note.topic}</span>
        </a>
      ))}
    </div>
  )
}

export const SiteBody: QuartzComponent = (props) => {
  const slug = props.fileData.slug!
  const base = pathToRoot(slug)
  const notes = publishedNotes(props)
  if (slug === "index") {
    const selected = picks
      .map((title) => notes.find((note) => note.title === title))
      .filter((note): note is (typeof notes)[number] => Boolean(note))
    return (
      <div class="blog-home">
        <section class="blog-intro">
          <h1>学习笔记与阅读批注</h1>
          <p>数学、物理、化学、生物。</p>
        </section>
        <div class="blog-home-grid">
          <section class="blog-list" data-limit="4" aria-labelledby="blog-selected">
            <div class="blog-section-heading">
              <h2 id="blog-selected">笔记选读</h2>
              <a href={`${base}/notes`}>全部笔记 →</a>
            </div>
            <Filters />
            <Rows notes={selected} base={base} limit={4} compact />
          </section>
          <aside class="blog-home-reading">
            <div class="blog-section-heading">
              <h2>阅读批注</h2>
              <a href={`${base}/annotations`}>全部 →</a>
            </div>
            <p>暂未公开。</p>
            <a class="blog-question-link" href={`${base}/questions`}>
              未解决的问题 →
            </a>
          </aside>
        </div>
      </div>
    )
  }
  if (slug === "notes")
    return (
      <div class="blog-archive">
        <section class="blog-intro">
          <h1>学习笔记</h1>
          <p>按学科浏览，或搜索一个概念。</p>
        </section>
        <section class="blog-list" data-limit="18">
          <Filters />
          <p class="blog-note-count">
            四科学习笔记 · {notes.length} 篇，当前显示 {Math.min(18, notes.length)} 篇
          </p>
          <Rows notes={notes} base={base} limit={18} />
          <button class="blog-more" hidden={notes.length <= 18}>
            继续浏览
          </button>
        </section>
      </div>
    )
  if (slug === "annotations" || slug === "questions")
    return (
      <div class="blog-empty-page">
        <section class="blog-intro">
          <h1>{slug === "annotations" ? "阅读批注" : "未解决的问题"}</h1>
        </section>
        <p>{slug === "annotations" ? "批注暂未公开。" : "暂无公开问题记录。"}</p>
        <a class="blog-return" href={`${base}/notes`}>
          浏览学习笔记 →
        </a>
      </div>
    )
  return <NativeContent {...props} />
}

export const SiteBeforeBody: QuartzComponent = (props) => {
  const slug = props.fileData.slug!
  if (["index", "notes", "annotations", "questions"].includes(slug)) return null
  const base = pathToRoot(slug)
  const toc = props.fileData.toc ?? []
  return (
    <div class="blog-before">
      {toc.length > 0 && (
        <aside class="blog-toc">
          <h2>本页目录</h2>
          {toc.map((item) => (
            <a href={`#${item.slug}`} class={item.depth > 0 ? "blog-subheading" : ""}>
              {item.text}
            </a>
          ))}
        </aside>
      )}
      <a class="blog-return" href={`${base}/notes`}>
        ← 学习笔记
      </a>
      <p class="blog-note-path">{slug.split("/").slice(0, -1).join(" / ")}</p>
      <h1>{props.fileData.frontmatter?.title}</h1>
    </div>
  )
}

export const SiteFooter: QuartzComponent = (props) => {
  const base = pathToRoot(props.fileData.slug!)
  return (
    <footer class="blog-footer">
      <span>行间 · {new Date().getFullYear()}</span>
      <div>
        <a href={`${base}/index.xml`}>订阅</a>
        <a href="https://github.com/van-zxc/quartz" target="_blank" rel="noopener">
          笔记仓库 ↗
        </a>
      </div>
    </footer>
  )
}
