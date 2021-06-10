import { copyDir } from "./copy-dir";
import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { join, basename } from "path";
import { Lang, root } from "./lang";
import { post } from "./post";
import { posts, PostListItem } from "./pages/posts";
import { promises as fs } from "fs";
import { renderToStaticMarkup } from "react-dom/server";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";
import type { ReactElement } from "react";

const rootDir = "build";
const postsDir = "posts";

async function writeHtml(
  dir: string,
  contents: ReactElement,
  file: string = "index.html",
) {
  await mkdirp(join(rootDir, dir));
  const text = "<!DOCTYPE html>" + renderToStaticMarkup(contents);
  await fs.writeFile(join(rootDir, dir, file), text);
}

interface PostData {
  title: string;
  date: Date;
  content: string;
}

function getPostData(contents: string): PostData {
  const { data, content } = matter(contents);
  const { title, date } = data;
  if (typeof title !== "string") {
    throw new Error("title must be a string");
  }
  if (!(date instanceof Date)) {
    throw new Error("date must be a Date");
  }
  return { title, date, content };
}

interface DatedPostListItem extends PostListItem {
  date: Date;
}

async function mkPost(
  dir: string,
  lang: Lang,
  entry: string,
): Promise<DatedPostListItem> {
  const file = await fs.readFile(entry);
  const { title, date, content } = getPostData(file.toString());
  const slug = basename(entry, ".md");
  const path = `${dir}/${slug}/`;
  await writeHtml(path, post({ title, content, lang, date }));
  return { title, date, path };
}

function sameTitle(x: string): never {
  throw new Error(`two posts have the same title: ${x}`);
}

function postCmp(a: DatedPostListItem, b: DatedPostListItem): -1 | 1 {
  return a.date === b.date
    ? a.title === b.title
      ? sameTitle(a.title)
      : a.title < b.title
      ? -1
      : 1
    : a.date < b.date
    ? 1
    : -1;
}

async function mkPosts(lang: Lang): Promise<void> {
  const entries = await glob(`posts/${lang}/*.md`);
  const dir = root(lang) + postsDir;
  const items = await Promise.all(entries.map((e) => mkPost(dir, lang, e)));
  items.sort(postCmp);
  await writeHtml(dir, posts(lang, items));
}

async function copyStatic(p: string) {
  await fs.copyFile(p, join(rootDir, basename(p)));
}

async function main() {
  await fs.rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  await copyDir("node_modules/katex/dist", join(rootDir, "katex"));
  await Promise.all((await glob("static/*")).map(copyStatic));
  await writeHtml(".", error404, "404.html");
  await writeHtml(".", index("en"));
  await writeHtml("ja", index("ja"));
  await mkPosts("en");
  await mkPosts("ja");
}

main().catch(console.error);
