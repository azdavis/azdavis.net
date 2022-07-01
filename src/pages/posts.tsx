import { Fragment, type ReactElement } from "react";
import { DateShow } from "../components/DateShow";
import { Page } from "../components/Page";
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

export function postsPage(lang: Lang, posts: PostListItem[]): ReactElement {
  const title = translations[lang];
  return (
    <Page lang={lang} title={title} styles={["base", "posts"]}>
      <a href={root(lang)}>azdavis.net</a> • <a href={feedUrl(lang)}>RSS</a>
      <h1>{title}</h1>
      <div className="posts">
        {posts.map(({ title, desc, path, date }) => (
          <Fragment key={title}>
            <DateShow lang={lang} date={date} />
            <div>
              <strong>
                <a href={path}>{title}</a>
              </strong>
              <div>{desc}</div>
            </div>
          </Fragment>
        ))}
      </div>
    </Page>
  );
}
