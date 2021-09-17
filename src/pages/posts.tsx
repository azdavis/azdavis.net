import type { ReactElement } from "react";
import { Lang, root } from "../lang";
import { Page } from "../page";
import { translations } from "../post-data";

export interface PostListItem {
  title: string;
  path: string;
}

export function posts(lang: Lang, posts: PostListItem[]): ReactElement {
  const title = translations[lang];
  return (
    <Page lang={lang} title={title} styles={["base"]}>
      <a href={root(lang)}>azdavis.net</a>
      <h1>{title}</h1>
      <ul>
        {posts.map(({ title, path }) => (
          <li key={title}>
            <a href={path}>{title}</a>
          </li>
        ))}
      </ul>
    </Page>
  );
}
