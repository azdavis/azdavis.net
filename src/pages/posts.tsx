import { Page } from "../page";
import type { Lang } from "../lang";
import type { ReactElement } from "react";

const m = {
  en: { title: "Posts", home: "/" },
  ja: { title: "投稿", home: "/ja" },
};

export interface PostListItem {
  title: string;
  path: string;
}

export function posts(lang: Lang, posts: PostListItem[]): ReactElement {
  const mLang = m[lang];
  return (
    <Page lang={lang} title={mLang.title} styles={["base"]}>
      <a href={"/" + (lang === "en" ? "" : lang)}>azdavis.xyz</a>
      <h1>{mLang.title}</h1>
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
