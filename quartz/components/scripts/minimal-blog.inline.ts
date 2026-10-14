document.addEventListener("nav", () => {
  const menu = document.querySelector<HTMLButtonElement>(".blog-menu")
  const nav = document.querySelector<HTMLElement>(".blog-nav")
  const toggle = () => {
    const open = nav?.classList.toggle("blog-nav-open") ?? false
    menu?.setAttribute("aria-expanded", String(open))
  }
  menu?.addEventListener("click", toggle)
  window.addCleanup(() => menu?.removeEventListener("click", toggle))
  for (const list of document.querySelectorAll<HTMLElement>(".blog-list")) {
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".blog-note-row"))
    const initial = Number(list.dataset.limit ?? 18)
    let limit = initial
    let topic = "全部"
    const more = list.querySelector<HTMLButtonElement>(".blog-more")
    const count = list.querySelector<HTMLElement>(".blog-note-count")
    const update = () => {
      let visible = 0
      const matching = rows.filter((row) => topic === "全部" || row.dataset.topic === topic)
      for (const row of rows)
        row.hidden = !(topic === "全部" || row.dataset.topic === topic) || visible++ >= limit
      if (count)
        count.textContent = `${topic === "全部" ? "四科学习笔记" : topic} · ${matching.length} 篇，当前显示 ${Math.min(limit, matching.length)} 篇`
      if (more) more.hidden = matching.length <= limit
    }
    const filter = (event: Event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".blog-filter")
      if (!button) return
      topic = button.dataset.topic ?? "全部"
      limit = initial
      for (const item of list.querySelectorAll<HTMLButtonElement>(".blog-filter"))
        item.setAttribute("aria-pressed", String(item === button))
      update()
    }
    const load = () => {
      limit += initial
      update()
    }
    list.addEventListener("click", filter)
    more?.addEventListener("click", load)
    window.addCleanup(() => {
      list.removeEventListener("click", filter)
      more?.removeEventListener("click", load)
    })
  }
})
