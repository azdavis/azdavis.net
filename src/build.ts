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
import { getPostData, PostData } from "./post-data";

const rootDir = "build";

function postsDir(lang: Lang): string {
  return root(lang) + "posts";
}

function postDir(lang: Lang, slug: string): string {
  return postsDir(lang) + "/" + slug + "/";
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

async function mkPost(
  lang: Lang,
  slug: string,
  data: PostData,
): Promise<PostListItem> {
  const path = postDir(lang, slug);
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

type Posts = Map<string, PostData>;

interface LangPosts {
  en: Posts;
  ja: Posts;
}

async function mkPostsPage(posts: LangPosts, lang: Lang): Promise<void> {
  const toAwait: Promise<PostListItem>[] = Array(posts[lang].size);
  let idx = 0;
  for (const [slug, data] of posts[lang]) {
    toAwait[idx] = mkPost(lang, slug, data);
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

async function getAllPostData(entries: string[]): Promise<Posts> {
  const awaited = await Promise.all(
    entries.map(async (e) => {
      const slug = basename(e, ".md");
      const file = await readFile(e);
      return { slug, contents: getPostData(file.toString()) };
    }),
  );
  const ret = new Map<string, PostData>();
  for (const { slug, contents } of awaited) {
    ret.set(slug, contents);
  }
  return ret;
}

async function main() {
  await rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  const [staticItems, postsJa, postsEn] = await Promise.all([
    glob("static/*"),
    glob("posts/ja/*.md").then(getAllPostData),
    glob("posts/en/*.md").then(getAllPostData),
  ]);
  const posts = { en: postsEn, ja: postsJa };
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