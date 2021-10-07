import type { ReactElement } from "react";
import { DateShow } from "../date-show";
import { Lang, root } from "../lang";
import { Page } from "../page";
import { translations } from "../post-data";

export interface PostListItem {
  title: string;
  path: string;
  date: Date;
}

export function posts(lang: Lang, posts: PostListItem[]): ReactElement {
  const title = translations[lang];
  return (
    <Page lang={lang} title={title} styles={["base", "posts"]}>
      <a href={root(lang)}>azdavis.net</a>
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
