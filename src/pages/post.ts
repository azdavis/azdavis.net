import { dateShow } from "../components/date-show";
import { block } from "../components/markdown";
import { page, Style } from "../components/page";
import { g } from "../util/graph";
import { h } from "../util/h";
import { Lang, name, root } from "../util/lang";
import {
  feedUrl,
  PostData,
  postDir,
  translations as posts,
  postsDir,
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
  return page(lang, data.title, styles, data, [
    h("header", {}, [
      h("nav", {}, [
        h("a", { href: root(lang) }, [siteName]),
        " • ",
        h("a", { href: postsDir(lang) + "/" }, [translations.posts[lang]]),
        " • ",
        h("a", { href: feedUrl(lang) }, ["RSS"]),
      ]),
      h("h1", {}, [data.title]),
      h("p", { class: "muted" }, [dateShow(lang, data.date)]),
      langs.length <= 1
        ? null
        : h("p", { class: "muted" }, [
            translations.translations[lang],
            ...langs.map((l, idx) => {
              const s = name[l];
              const inner = l === lang ? h("strong", {}, [s]) : s;
              const last = idx + 1 === langs.length ? "" : " • ";
              return h("a", { href: postDir(l, slug) }, [inner]) + last;
            }),
          ]),
    ]),
    h("main", {}, [block(data.content).replace("@@GRAPH_PLACEHOLDER@@", g)]),
    h("footer", { class: "muted" }, ["Thanks for reading."]),
  ]);
}
