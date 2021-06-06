import { Lang, root } from "../lang";
import { Page } from "../page";
import type { ReactElement } from "react";

const translations = {
  en: {
    nameTitle: "NAME",
    nameContent: "azdavis - a fella",
    descTitle: "DESCRIPTION",
    descContent: [
      "azdavis is a software engineer working at Stripe. He acquired a major",
      "in computer science, with a minor in Japanese studies, from Carnegie",
      "Mellon University.",
    ].join(" "),
    pagesTitle: "PAGES",
    otherLang: "ja" as const,
    otherLangTitle: "日本語",
    otherLangDesc: "このページを日本語で読む。",
    postsTitle: "Posts",
    postsDesc: "An assortment of writings.",
    githubDesc: "A collection of repositories.",
    copyrightTitle: "COPYRIGHT",
    copyrightDesc: "Copyright 1998 Ariel Davis.",
  },
  ja: {
    nameTitle: "名前",
    nameContent: "azdavis - 或る奴",
    descTitle: "説明",
    descContent: [
      "azdavisはStripeで働いている開発者である。",
      "カーネギーメロン大学でコンピューター科学の専攻と日本学の副専攻を取った。",
    ].join(""),
    pagesTitle: "ページ",
    otherLang: "en" as const,
    otherLangTitle: "English",
    otherLangDesc: "Read this page in English.",
    postsTitle: "投稿",
    postsDesc: "文章の揃い。",
    githubDesc: "リポジトリーの集まり。",
    copyrightTitle: "著作権",
    copyrightDesc: "著作権１９９８アリエル・デイヴィス。",
  },
};

export function index(lang: Lang): ReactElement {
  const t = translations[lang];
  return (
    <Page lang={lang} title="man azdavis" styles={["base", "index"]}>
      <h2>{t.nameTitle}</h2>
      <div className="sec">{t.nameContent}</div>
      <h2>{t.descTitle}</h2>
      <div className="sec">{t.descContent}</div>
      <h2>{t.pagesTitle}</h2>
      <dl className="sec">
        <dt lang={t.otherLang}>
          <a href={root(t.otherLang)}>{t.otherLangTitle}</a>
        </dt>
        <dd lang={t.otherLang}>{t.otherLangDesc}</dd>
        <dt>
          <a href={root(lang) + "posts/"}>{t.postsTitle}</a>
        </dt>
        <dd>{t.postsDesc}</dd>
        <dt>
          <a href="https://github.com/azdavis">GitHub</a>
        </dt>
        <dd>{t.githubDesc}</dd>
      </dl>
      <h2>{t.copyrightTitle}</h2>
      <div className="sec">{t.copyrightDesc}</div>
    </Page>
  );
}
