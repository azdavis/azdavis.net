import matter from "gray-matter";
import { Lang, root } from "./lang";

export interface PostMetadata {
  title: string;
  date: Date;
}

export interface PostData extends PostMetadata {
  content: string;
}

export function getPostData(slug: string, contents: string): PostData {
  const { data, content } = matter(contents);
  const { title, date } = data;
  if (typeof title !== "string" || !(date instanceof Date)) {
    throw new Error(
      `${slug}: front matter must be {title: string, date: Date}`,
    );
  }
  return { title, date, content };
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
