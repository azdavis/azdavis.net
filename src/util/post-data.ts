import matter from "gray-matter";
import { Lang, root } from "./lang";

export interface PostMetadata {
  title: string;
  desc: string;
  date: Date;
  img?: string;
}

export interface PostData extends PostMetadata {
  content: string;
}

export function getPostData(slug: string, contents: string): PostData {
  const { data, content } = matter(contents);
  const { title, desc, date, img } = data;
  if (
    (img !== undefined && typeof img !== "string") ||
    typeof title !== "string" ||
    typeof desc !== "string" ||
    !(date instanceof Date)
  ) {
    throw new Error(
      `${slug}: front matter must be {title: string, desc: string, date: Date, img?: string}`,
    );
  }
  return { title, desc, date, img, content };
}

export const translations = { en: "Posts", ja: "投稿" };

export function postsDir(lang: Lang): string {
  return root(lang) + "posts";
}

export function postDir(lang: Lang, slug: string): string {
  return postsDir(lang) + "/" + slug + "/";
}

export function feedUrl(lang: Lang): string {
  return postsDir(lang) + "/feed.xml";
}
