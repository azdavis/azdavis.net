import { h } from "../util/h";
import type { Lang } from "../util/lang";
import { feedUrl } from "../util/post-data";
import { baseUrl } from "../util/site";

export type Style = "base" | "post" | "index" | "katex/katex.min" | "posts";

const translations = {
  en: "the personal website of azdavis",
  ja: "azdavisの個人的なウェブサイト",
};

export function page(
  lang: Lang,
  title: string,
  styles: Style[],
  children: (string | null)[],
  desc?: string,
  img?: string,
): string {
  return h("html", { lang }, [
    h("head", {}, [
      h("meta", { charset: "utf-8" }),
      h("title", {}, [title]),
      h("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1",
      }),
      h("meta", { name: "description", content: desc ?? translations[lang] }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:title", content: title }),
      h("meta", {
        property: "og:description",
        content: desc ?? translations[lang],
      }),
      img === undefined
        ? null
        : h("meta", {
            property: "og:image",
            content: baseUrl + img,
          }),
      h("link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }),
      h("link", { rel: "mask-icon", href: "/favicon.svg", color: "#000000" }),
      h("link", {
        rel: "alternate icon",
        type: "image/png",
        href: "/favicon.png",
      }),
      h("link", { rel: "apple-touch-icon", href: "/favicon.png" }),
      h("link", {
        rel: "alternate",
        type: "application/atom+xml",
        href: feedUrl(lang),
      }),
      ...styles.map((s) => h("link", { rel: "stylesheet", href: `/${s}.css` })),
    ]),
    h("body", {}, children),
  ]);
}
