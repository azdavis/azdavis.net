import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { ja } from "./pages/ja";
import { join, basename } from "path";
import { Lang } from "./lang";
import { Post } from "./post";
import { posts, PostListItem } from "./pages/posts";
import { promises as fs } from "fs";
import { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";

const rootDir = "build";
const postsDir = "posts";

// https://stackoverflow.com/a/64255382
async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

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
  const path = `/${dir}/${slug}`;
  const post = <Post title={title} content={content} lang={lang} date={date} />;
  await writeHtml(path, post);
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
  const dir = lang === "en" ? postsDir : `${lang}/${postsDir}`;
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
  await writeHtml(".", index);
  await writeHtml("ja", ja);
  await mkPosts("en");
  await mkPosts("ja");
}

main().catch(console.error);
