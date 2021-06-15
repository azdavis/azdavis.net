import type { ReactElement } from "react";
import { Lang, root } from "../lang";
import { Page } from "../page";

const translations = {
  en: {
    title: "Posts",
  },
  ja: {
    title: "投稿",
  },
};

export interface PostListItem {
  title: string;
  path: string;
}

export function posts(lang: Lang, posts: PostListItem[]): ReactElement {
  const t = translations[lang];
  return (
    <Page lang={lang} title={t.title} styles={["base"]}>
      <a href={root(lang)}>azdavis.xyz</a>
      <h1>{t.title}</h1>
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
