import matter from "gray-matter";
import { Lang, root } from "./lang";

export interface PostMetadata {
  title: string;
  date: Date;
}

export interface PostData extends PostMetadata {
  content: string;
}

export function getPostData(contents: string): PostData {
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

export const translations = { en: "Posts", ja: "投稿" };

export function postsDir(lang: Lang): string {
  return root(lang) + "posts";
}

export function postDir(lang: Lang, slug: string): string {
  return postsDir(lang) + "/" + slug + "/";
}
