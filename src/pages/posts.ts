import { dateShow } from "../components/date-show";
import { markdown } from "../components/markdown";
import { page } from "../components/page";
import { e } from "../util/e";
import { Lang, root } from "../util/lang";
import { feedUrl, PostMetadata, translations } from "../util/post-data";

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
  return page(
    lang,
    title,
    ["base", "posts"],
    [
      e("a", { href: root(lang) }, ["azdavis.net"]),
      " • ",
      e("a", { href: feedUrl(lang) }, ["RSS"]),
      e("h1", {}, [title]),
      e(
        "div",
        { class: "posts" },
        posts
          .map(({ title, desc, path, date }) => [
            dateShow(lang, date),
            e("div", {}, [
              e("strong", {}, [e("a", { href: path }, [title])]),
              e("div", {}, [markdown(desc, "inline")]),
            ]),
          ])
          .flat(),
      ),
    ],
  );
}
