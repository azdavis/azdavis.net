import { Page } from "../page";
import type { Lang } from "../lang";
import type { ReactElement } from "react";

const translations = {
  en: { title: "Posts", home: "/" },
  ja: { title: "投稿", home: "/ja/" },
};

export interface PostListItem {
  title: string;
  path: string;
}

export function posts(lang: Lang, posts: PostListItem[]): ReactElement {
  const t = translations[lang];
  return (
    <Page lang={lang} title={t.title} styles={["base"]}>
      <a href={"/" + (lang === "en" ? "" : lang)}>azdavis.xyz</a>
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
