import glob from "fast-glob";
import { copyFile, readFile, rm, writeFile } from "fs/promises";
import mkdirp from "mkdirp";
import { basename, join } from "path";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { post } from "./pages/post";
import { postCmp, PostListItem, postsPage } from "./pages/posts";
import { copyDir } from "./util/copy-dir";
import { all, Lang } from "./util/lang";
import {
  feedUrl,
  getPostData,
  PostData,
  postDir,
  postsDir,
} from "./util/post-data";

const siteBase = "https://azdavis.net";
const buildDir = "build";

async function writeHtml(
  dir: string,
  contents: ReactElement,
  file: string = "index.html",
) {
  await mkdirp(join(buildDir, dir));
  const text = "<!DOCTYPE html>" + renderToStaticMarkup(contents);
  await writeFile(join(buildDir, dir, file), text);
}

type Posts = Map<string, PostData>;

interface LangPosts {
  en: Posts;
  ja: Posts;
}

async function mkPosts(posts: LangPosts, lang: Lang): Promise<void> {
  const items: PostListItem[] = Array(posts[lang].size);
  const titles = new Set<string>();
  let idx = 0;
  for (const [slug, data] of posts[lang]) {
    const path = postDir(lang, slug);
    const langs = all.filter((l) => posts[l].has(slug));
    await writeHtml(path, post({ data, lang, slug, langs }));
    const { title, desc, date, img } = data;
    if (titles.has(title)) {
      throw new Error(`duplicate: ${lang} ${title}`);
    }
    titles.add(title);
    items[idx] = { title, desc, date, path, img };
    idx++;
  }
  items.sort(postCmp);
  const dir = postsDir(lang);
  await writeHtml(dir, postsPage(lang, items));
  const fullFeedUrl = siteBase + feedUrl(lang);
  const fullPostsUrl = siteBase + dir + "/";
  const entries = items.map(
    (item) =>
      `<entry>
<title>${item.title}</title>
<link href="${siteBase + item.path}" />
<id>${siteBase + item.path}</id>
<updated>${item.date.toISOString()}</updated>
</entry>`,
  );
  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}">
<title>azdavis.net</title>
<link href="${fullPostsUrl}" />
<link rel="self" type="application/atom+xml" href="${fullFeedUrl}" />
<id>${fullFeedUrl}</id>
<author><name>Ariel Davis</name></author>
<updated>${items[0].date.toISOString()}</updated>
${entries.join("\n")}
</feed>`;
  await writeFile(join(buildDir, feedUrl(lang)), feed);
}

async function getAllPostData(entries: string[]): Promise<Posts> {
  const awaited = await Promise.all(
    entries.map(async (name) => {
      const slug = basename(name, ".md");
      const file = await readFile(name);
      return { slug, contents: getPostData(slug, file.toString()) };
    }),
  );
  const ret = new Map<string, PostData>();
  for (const { slug, contents } of awaited) {
    ret.set(slug, contents);
  }
  return ret;
}

async function copyStatic(p: string) {
  await copyFile(p, join(buildDir, basename(p)));
}

async function main() {
  await rm(buildDir, { recursive: true, force: true });
  await mkdirp(buildDir);
  const [staticItems, postsJa, postsEn] = await Promise.all([
    glob("static/*"),
    glob("posts/ja/*.md").then(getAllPostData),
    glob("posts/en/*.md").then(getAllPostData),
  ]);
  const posts = { en: postsEn, ja: postsJa };
  await Promise.all([
    copyDir("static/img", join(buildDir, "img")),
    copyDir("node_modules/katex/dist", join(buildDir, "katex")),
    ...staticItems.map(copyStatic),
    writeHtml(".", error404, "404.html"),
    writeHtml(".", index("en")),
    writeHtml("ja", index("ja")),
    mkPosts(posts, "en"),
    mkPosts(posts, "ja"),
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
