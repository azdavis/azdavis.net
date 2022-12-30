import { dateShow } from "../components/date-show";
import { markdown } from "../components/markdown";
import { page, Style } from "../components/page";
import { e } from "../util/e";
import { Lang, name, root } from "../util/lang";
import {
  feedUrl,
  PostData,
  postDir,
  postsDir,
  translations as posts,
} from "../util/post-data";
import { name as siteName } from "../util/site";

const styles: Style[] = ["base", "post", "katex/katex.min"];

const translations = {
  translations: { en: "Translations: ", ja: "翻訳\uff1a" },
  posts,
};

// `langs` includes `lang` (thus, it is never empty)
export function post(
  data: PostData,
  lang: Lang,
  langs: Lang[],
  slug: string,
): string {
  return page(
    lang,
    data.title,
    styles,
    [
      e("header", {}, [
        e("a", { href: root(lang) }, [siteName]),
        " • ",
        e("a", { href: postsDir(lang) + "/" }, [translations.posts[lang]]),
        " • ",
        e("a", { href: feedUrl(lang) }, ["RSS"]),
      ]),
      e("h1", {}, [data.title]),
      e("p", {}, [dateShow(lang, data.date)]),
      langs.length <= 1
        ? null
        : e("p", {}, [
            translations.translations[lang],
            ...langs.map((l, idx) => {
              const s = name[l];
              const inner = l === lang ? e("strong", {}, [s]) : s;
              const last = idx + 1 === langs.length ? "" : " • ";
              return e("a", { href: postDir(l, slug) }, [inner]) + last;
            }),
          ]),
      markdown(data.content, "block"),
    ],
    data.desc,
    data.img,
  );
}
