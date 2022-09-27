import { dateShow } from "../components/date-show";
import { markdown } from "../components/markdown";
import { page, Style } from "../components/page";
import { e } from "../util/e";
import { Lang, name, root } from "../util/lang";
import {
  PostData,
  postDir,
  postsDir,
  translations as posts,
} from "../util/post-data";

const styles: Style[] = ["base", "post", "katex/katex.min"];

const translations = {
  translations: { en: "Translations: ", ja: "翻訳\uff1a" },
  posts,
  lRound: { en: "(", ja: "\uff08" },
  rRound: { en: ")", ja: "\uff09" },
};

export function post(
  data: PostData,
  lang: Lang,
  // includes lang (thus, never empty)
  langs: Lang[],
  slug: string,
): string {
  return page(
    lang,
    data.title,
    styles,
    [
      e("a", { href: root(lang) }, ["azdavis.net"]),
      " • ",
      e("a", { href: postsDir(lang) + "/" }, [translations.posts[lang]]),
      " • ",
      dateShow(lang, data.date),
      e("h1", {}, [data.title]),
      ...(langs.length <= 1
        ? []
        : [
            e("p", {}, [
              translations.lRound[lang],
              translations.translations[lang],
              ...langs.map((l, idx) => {
                const s = name[l];
                const inner = l === lang ? e("strong", {}, [s]) : s;
                const last = idx + 1 === langs.length ? "" : " • ";
                return e("a", { href: postDir(l, slug) }, [inner]) + last;
              }),
              translations.rRound[lang],
            ]),
          ]),
      markdown(data.content),
    ],
    data.desc,
    data.img,
  );
}
