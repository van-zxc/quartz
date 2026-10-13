// Match Quartz 4's slugifyFilePath for both notes and raster assets.
export function publicationSlug(file) {
  const ext = /\.[^.\/]+$/.exec(file)?.[0] ?? ""
  const base = ext ? file.slice(0, -ext.length) : file
  return base.split("/").map((part) => part.replace(/\s/g, "-").replace(/&/g, "-and-")
    .replace(/%/g, "-percent").replace(/\?/g, "").replace(/#/g, "")).join("/")
    .replace(/_index$/, "index") + (ext.toLowerCase() === ".md" ? "" : ext)
}
