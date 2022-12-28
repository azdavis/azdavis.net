import { page } from "../components/page";
import { e } from "../util/e";
import { Lang, root } from "../util/lang";
import { postsDir } from "../util/post-data";
import { author as siteAuthor } from "../util/site";

const translations = {
  en: {
    nameTitle: "NAME",
    nameContent: "azdavis - a fella",
    descTitle: "DESCRIPTION",
    descContent: [
      "azdavis is a software engineer working at ",
      e("a", { href: "https://stripe.com" }, ["Stripe"]),
      ". He acquired a major in computer science, with a minor in Japanese ",
      "studies, from ",
      e("a", { href: "https://www.cmu.edu" }, ["Carnegie Mellon University"]),
      ".",
    ],
    pagesTitle: "PAGES",
    otherLang: "ja" as const,
    otherLangTitle: "日本語",
    otherLangDesc: "このページを日本語で読む。",
    postsTitle: "Posts",
    postsDesc: "An assortment of writings.",
    githubDesc: "A collection of repositories.",
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
      "azdavisは",
      e("a", { href: "https://stripe.com/jp" }, ["Stripe"]),
      "で働いている開発者である。",
      e("a", { href: "https://www.cmu.edu" }, ["カーネギーメロン大学"]),
      "でコンピューター科学の専攻と日本学の副専攻を取った。",
    ],
    pagesTitle: "ページ",
    otherLang: "en" as const,
    otherLangTitle: "English",
    otherLangDesc: "Read this page in English.",
    postsTitle: "投稿",
    postsDesc: "文章の揃い。",
    githubDesc: "リポジトリーの集まり。",
    contactTitle: "連絡",
    contactDesc: "[名].z.[姓]@icloud.com",
    copyrightTitle: "著作権",
    copyrightDesc: `著作権１９９８アリエル・デイヴィス（${siteAuthor}）。`,
  },
};

export function index(lang: Lang): string {
  const t = translations[lang];
  return page(
    lang,
    "man azdavis",
    ["base", "index"],
    [
      e("h1", {}, [t.nameTitle]),
      e("div", { class: "section" }, [t.nameContent]),
      e("h1", {}, [t.descTitle]),
      e("div", { class: "section" }, t.descContent),
      e("h1", {}, [t.pagesTitle]),
      e("dl", { class: "section" }, [
        e("dt", { lang: t.otherLang }, [
          e("a", { href: root(t.otherLang) }, [t.otherLangTitle]),
        ]),
        e("dd", { lang: t.otherLang }, [t.otherLangDesc]),
        e("dt", {}, [e("a", { href: postsDir(lang) + "/" }, [t.postsTitle])]),
        e("dd", {}, [t.postsDesc]),
        e("dt", {}, [
          e("a", { href: "https://github.com/azdavis" }, ["GitHub"]),
        ]),
        e("dd", {}, [t.githubDesc]),
      ]),
      e("h1", {}, [t.contactTitle]),
      e("div", { class: "section" }, [t.contactDesc]),
      e("h1", {}, [t.copyrightTitle]),
      e("div", { class: "section" }, [t.copyrightDesc]),
    ],
  );
}
