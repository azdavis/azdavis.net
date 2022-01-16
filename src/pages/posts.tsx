import type { ReactElement } from "react";
import { DateShow } from "../date-show";
import { Lang, root } from "../lang";
import { Page } from "../page";
import { feedUrl, PostMetadata, translations } from "../post-data";

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

const rssFeed = { en: "RSS feed", ja: "RSSフェード" };

export function postsPage(lang: Lang, posts: PostListItem[]): ReactElement {
  const title = translations[lang];
  return (
    <Page lang={lang} title={title} styles={["base", "posts"]}>
      <a href={root(lang)}>azdavis.net</a> •{" "}
      <a href={feedUrl(lang)}>{rssFeed[lang]}</a>
      <h1>{title}</h1>
      {posts.map(({ title, path, date }) => (
        <div key={title} className="post-list-item">
          <div>
            <a href={path}>{title}</a>
          </div>
          <DateShow lang={lang} date={date} />
        </div>
      ))}
    </Page>
  );
}
