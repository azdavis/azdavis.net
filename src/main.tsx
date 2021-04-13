import { index } from "./pages/index";
import { page } from "./page";
import { Post } from "./post";
import { promises as fs } from "fs";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";
import path from "path";
import { error404 } from "./pages/404";
import { ja } from "./pages/ja";
import { profiles } from "./pages/profiles";
import { resume } from "./pages/resume";

const rootDir = "build";
const postsDir = "posts";

// https://stackoverflow.com/a/64255382
async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function writeHtml(
  dir: string,
  contents: string,
  file: string = "index.html",
) {
  await mkdirp(path.join(rootDir, dir));
  await fs.writeFile(
    path.join(rootDir, dir, file),
    "<!DOCTYPE html>" + contents,
  );
}

interface PostData {
  title: string;
  date: Date;
  slug: string;
}

async function mkPost(entry: string): Promise<PostData> {
  const { data, content } = matter((await fs.readFile(entry)).toString());
  const { title, date, lang } = data;
  if (typeof title !== "string") {
    throw new Error("title must be a string");
  }
  if (!(date instanceof Date)) {
    throw new Error("date must be a Date");
  }
  if (typeof lang !== "string") {
    throw new Error("lang must be a string");
  }
  const props = { title, content, lang, date };
  const slug = path.basename(entry, ".md");
  await writeHtml(
    path.join(postsDir, slug),
    page({
      lang,
      title,
      styles: ["base", "code", "katex/katex.min"],
      body: <Post {...props} />,
    }),
  );
  return { title, date, slug };
}

function sameTitle(x: string): never {
  throw new Error(`two posts have the same title: ${x}`);
}

function postCmp(a: PostData, b: PostData): number {
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

async function copyStatic(p: string) {
  await fs.copyFile(p, path.join(rootDir, path.basename(p)));
}

async function main() {
  await fs.rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  await copyDir("node_modules/katex/dist", path.join(rootDir, "katex"));
  await Promise.all((await glob("static/*")).map(copyStatic));
  const entries = await Promise.all((await glob("posts/*.md")).map(mkPost));
  entries.sort(postCmp);
  await writeHtml(".", page(error404), "404.html");
  await writeHtml(".", page(index));
  await writeHtml("ja", page(ja));
  await writeHtml("profiles", page(profiles));
  await writeHtml("resume", page(resume));
  await writeHtml(
    postsDir,
    page({
      lang: "en",
      title: "Posts",
      styles: ["base"],
      body: (
        <>
          <a href="/">azdavis.xyz</a>
          <h1>Posts</h1>
          <ul>
            {entries.map(({ title, slug }) => (
              <li key={slug}>
                <a href={`/posts/${slug}`}>{title}</a>
              </li>
            ))}
          </ul>
        </>
      ),
    }),
  );
}

main().catch(console.error);
