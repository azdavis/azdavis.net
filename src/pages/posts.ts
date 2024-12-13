import { dateShow } from "../components/date-show";
import { inline } from "../components/markdown";
import { page } from "../components/page";
import { h } from "../util/h";
import { Lang, root } from "../util/lang";
import { feedUrl, PostMetadata, translations } from "../util/post-data";
import { name as siteName } from "../util/site";

export interface PostListItem extends PostMetadata {
  path: string;
}

export function postCmp(a: PostListItem, b: PostListItem): -1 | 1 {
  return a.date === b.date
    ? a.title < b.title
      ? -1
      : 1
    : a.date < b.date
    ? 1
    : -1;
}

export function postsPage(lang: Lang, posts: PostListItem[]): string {
  const title = translations[lang];
  // need post css as well to get styling for markdown elements like <code>
  return page(lang, title, ["base", "posts", "post"], {}, [
    h("header", {}, [
      h("nav", {}, [
        h("a", { href: root(lang) }, [siteName]),
        " • ",
        h("a", { href: feedUrl(lang) }, ["RSS"]),
      ]),
      h("h1", {}, [title]),
    ]),
    h(
      "main",
      { class: "posts" },
      posts
        .map(({ title, desc, path, date }) => [
          dateShow(lang, date),
          h("div", {}, [
            h("strong", {}, [h("a", { href: path }, [title])]),
            h("div", {}, [inline(desc)]),
          ]),
        ])
        .flat(),
    ),
  ]);
}
