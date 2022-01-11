import glob from "fast-glob";
import { copyFile, readdir, readFile, rm, writeFile } from "fs/promises";
import mkdirp from "mkdirp";
import { basename, join } from "path";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Lang, root } from "./lang";
import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { post } from "./pages/post";
import { PostListItem, postsPage } from "./pages/posts";
import { getPostData } from "./post-data";

const rootDir = "build";

function postsDir(lang: Lang): string {
  return root(lang) + "posts";
}

function postDir(lang: Lang, mdEntry: string): string {
  return postsDir(lang) + "/" + basename(mdEntry, ".md") + "/";
}

async function writeHtml(
  dir: string,
  contents: ReactElement,
  file: string = "index.html",
) {
  await mkdirp(join(rootDir, dir));
  const text = "<!DOCTYPE html>" + renderToStaticMarkup(contents);
  await writeFile(join(rootDir, dir, file), text);
}

async function mkPost(lang: Lang, entry: string): Promise<PostListItem> {
  const file = await readFile(entry);
  const data = getPostData(file.toString());
  const path = postDir(lang, entry);
  await writeHtml(path, post({ data, lang }));
  const { title, date } = data;
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

interface Posts {
  en: Set<string>;
  ja: Set<string>;
}

async function mkPostsPage(posts: Posts, lang: Lang): Promise<void> {
  const toAwait: Promise<PostListItem>[] = Array(posts[lang].size);
  let idx = 0;
  for (const entry of posts[lang]) {
    toAwait[idx] = mkPost(lang, entry);
    idx++;
  }
  const items = await Promise.all(toAwait);
  const titles = new Set<string>();
  for (const { title } of items) {
    if (titles.has(title)) {
      throw new Error(`duplicate: ${lang} ${title}`);
    }
    titles.add(title);
  }
  items.sort(postCmp);
  await writeHtml(postsDir(lang), postsPage(lang, items));
}

async function copyStatic(p: string) {
  await copyFile(p, join(rootDir, basename(p)));
}

// https://stackoverflow.com/a/64255382
export async function copyDir(src: string, dest: string): Promise<void> {
  await mkdirp(dest);
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  const [staticItems, postsJa, postsEn] = await Promise.all([
    glob("static/*"),
    glob("posts/ja/*.md"),
    glob("posts/en/*.md"),
  ]);
  const posts = { en: new Set(postsEn), ja: new Set(postsJa) };
  await Promise.all([
    copyDir("static/img", join(rootDir, "img")),
    copyDir("node_modules/katex/dist", join(rootDir, "katex")),
    ...staticItems.map(copyStatic),
    writeHtml(".", error404, "404.html"),
    writeHtml(".", index("en")),
    writeHtml("ja", index("ja")),
    mkPostsPage(posts, "en"),
    mkPostsPage(posts, "ja"),
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
