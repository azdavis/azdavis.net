import { page } from "../components/page";
import { h } from "../util/h";
import { Lang, root } from "../util/lang";
import { postsDir } from "../util/post-data";
import { author as siteAuthor } from "../util/site";

const translations = {
  en: {
    nameTitle: "NAME",
    nameContent: "azdavis - a fella",
    descTitle: "DESCRIPTION",
    descContent: [
      "azdavis is a software engineer. ",
      "He acquired a major in computer science, with a minor in Japanese ",
      "studies, from ",
      h("a", { href: "https://www.cmu.edu" }, ["Carnegie Mellon University"]),
      ".",
    ],
    pagesTitle: "PAGES",
    otherLang: "ja" as const,
    otherLangTitle: "日本語",
    otherLangDesc: "このページを日本語で読む。",
    postsTitle: "Posts",
    postsDesc: "An assortment of writings.",
    githubDesc: "A collection of repositories.",
    linkedInDesc: "A network of professionals.",
    contactTitle: "CONTACT",
    contactDesc: "[first name].z.[last name]@icloud.com",
    copyrightTitle: "COPYRIGHT",
    copyrightDesc: `Copyright 1998 ${siteAuthor}.`,
  },
  ja: {
    nameTitle: "名前",
    nameContent: "azdavis - 或る奴",
    descTitle: "説明",
    descContent: [
      "azdavisは開発者である。",
      h("a", { href: "https://www.cmu.edu" }, ["カーネギーメロン大学"]),
      "でコンピューター科学の専攻と日本学の副専攻を取った。",
    ],
    pagesTitle: "ページ",
    otherLang: "en" as const,
    otherLangTitle: "English",
    otherLangDesc: "Read this page in English.",
    postsTitle: "投稿",
    postsDesc: "文章の揃い。",
    githubDesc: "リポジトリーの集まり。",
    linkedInDesc: "専門家の通信網。",
    contactTitle: "連絡",
    contactDesc: "[名].z.[姓]@icloud.com",
    copyrightTitle: "著作権",
    copyrightDesc: `著作権１９９８アリエル・デイヴィス（${siteAuthor}）。`,
  },
};

export function index(lang: Lang): string {
  const t = translations[lang];
  return page(lang, "man azdavis", ["base", "index"], {}, [
    h("h1", {}, [t.nameTitle]),
    h("div", { class: "section" }, [t.nameContent]),
    h("h1", {}, [t.descTitle]),
    h("div", { class: "section" }, t.descContent),
    h("h1", {}, [t.pagesTitle]),
    h("dl", { class: "section" }, [
      h("dt", { lang: t.otherLang }, [
        h("a", { href: root(t.otherLang) }, [t.otherLangTitle]),
      ]),
      h("dd", { lang: t.otherLang }, [t.otherLangDesc]),
      h("dt", {}, [h("a", { href: postsDir(lang) + "/" }, [t.postsTitle])]),
      h("dd", {}, [t.postsDesc]),
      h("dt", {}, [h("a", { href: "https://github.com/azdavis" }, ["GitHub"])]),
      h("dd", {}, [t.githubDesc]),
      h("dt", {}, [
        h("a", { href: "https://www.linkedin.com/in/ariel-davis-b61b2714a/" }, [
          "LinkedIn",
        ]),
      ]),
      h("dd", {}, [t.linkedInDesc]),
    ]),
    h("h1", {}, [t.contactTitle]),
    h("div", { class: "section" }, [t.contactDesc]),
    h("h1", {}, [t.copyrightTitle]),
    h("div", { class: "section" }, [t.copyrightDesc]),
  ]);
}
