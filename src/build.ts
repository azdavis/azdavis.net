import glob from "fast-glob";
import { copyFile, readFile, rm, writeFile } from "fs/promises";
import mkdirp from "mkdirp";
import { basename, join } from "path";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { copyDir } from "./copy-dir";
import { Lang, root } from "./lang";
import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { post } from "./pages/post";
import { PostListItem, postsPage } from "./pages/posts";
import { getPostData } from "./post-data";

const rootDir = "build";
const postsDir = "posts";

async function writeHtml(
  dir: string,
  contents: ReactElement,
  file: string = "index.html",
) {
  await mkdirp(join(rootDir, dir));
  const text = "<!DOCTYPE html>" + renderToStaticMarkup(contents);
  await writeFile(join(rootDir, dir, file), text);
}

async function mkPost(
  dir: string,
  lang: Lang,
  entry: string,
): Promise<PostListItem> {
  const file = await readFile(entry);
  const { title, date, content } = getPostData(file.toString());
  const slug = basename(entry, ".md");
  const path = `${dir}/${slug}/`;
  await writeHtml(path, post({ title, content, lang, date }));
  return { title, date, path };
}

function postCmp(a: PostListItem, b: PostListItem): -1 | 1 {
  return a.date === b.date
    ? a.title < b.title
      ? -1
      : 1
    : a.date < b.date
    ? 1
    : -1;
}

async function mkPostsPage(lang: Lang): Promise<void> {
  const entries = await glob(`posts/${lang}/*.md`);
  const dir = root(lang) + postsDir;
  const items = await Promise.all(entries.map((e) => mkPost(dir, lang, e)));
  const titles = new Set<string>();
  for (const { title } of items) {
    if (titles.has(title)) {
      throw new Error(
        `two posts have the same language (${lang}) and title (${title})`,
      );
    }
    titles.add(title);
  }
  items.sort(postCmp);
  await writeHtml(dir, postsPage(lang, items));
}

async function copyStatic(p: string) {
  await copyFile(p, join(rootDir, basename(p)));
}

async function main() {
  await rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  const staticItems = await glob("static/*");
  await Promise.all([
    copyDir("static/img", join(rootDir, "img")),
    copyDir("node_modules/katex/dist", join(rootDir, "katex")),
    ...staticItems.map(copyStatic),
    writeHtml(".", error404, "404.html"),
    writeHtml(".", index("en")),
    writeHtml("ja", index("ja")),
    mkPostsPage("en"),
    mkPostsPage("ja"),
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
