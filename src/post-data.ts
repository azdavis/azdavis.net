import matter from "gray-matter";

export interface PostData {
  title: string;
  date: Date;
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
