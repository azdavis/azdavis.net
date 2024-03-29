import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import { basename, join } from "path";
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
import { author as siteAuthor, baseUrl, name as siteName } from "./util/site";

const buildDir = "build";

async function writeHtml(
  dir: string,
  contents: string,
  file: string = "index.html",
) {
  await mkdir(join(buildDir, dir), { recursive: true });
  const text = "<!DOCTYPE html>" + contents;
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
    await writeHtml(path, post(data, lang, langs, slug));
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
  const fullFeedUrl = baseUrl + feedUrl(lang);
  const fullPostsUrl = baseUrl + dir + "/";
  const siteUpdatedDate = items.length === 0 ? new Date(0) : items[0].date;
  const siteUpdated = siteUpdatedDate.toISOString();
  const entries = items.map(
    (item) =>
      `<entry>
<title>${item.title}</title>
<link href="${baseUrl + item.path}" />
<id>${baseUrl + item.path}</id>
<updated>${item.date.toISOString()}</updated>
<summary>${item.desc}</summary>
</entry>`,
  );
  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${lang}">
<title>${siteName}</title>
<link href="${fullPostsUrl}" />
<link rel="self" type="application/atom+xml" href="${fullFeedUrl}" />
<id>${fullFeedUrl}</id>
<author><name>${siteAuthor}</name></author>
<updated>${siteUpdated}</updated>
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

async function readDirWithDirName(dir: string): Promise<string[]> {
  const xs = await readdir(dir).catch((_) => []);
  return xs.map((x) => join(dir, x));
}

async function main() {
  await rm(buildDir, { recursive: true, force: true });
  await copyDir("static", buildDir);
  const [postsJa, postsEn] = await Promise.all([
    readDirWithDirName(join("posts", "ja")).then(getAllPostData),
    readDirWithDirName(join("posts", "en")).then(getAllPostData),
  ]);
  const posts = { en: postsEn, ja: postsJa };
  await Promise.all([
    copyDir("static/img", join(buildDir, "img")),
    copyDir("node_modules/katex/dist", join(buildDir, "katex")),
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
