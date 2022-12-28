import { e } from "../util/e";
import type { Lang } from "../util/lang";
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
  return e("html", { lang }, [
    e("head", {}, [
      e("meta", { charset: "utf-8" }),
      e("title", {}, [title]),
      e("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1",
      }),
      e("meta", { name: "description", content: desc ?? translations[lang] }),
      e("meta", { property: "og:type", content: "website" }),
      e("meta", { property: "og:title", content: title }),
      e("meta", {
        property: "og:description",
        content: desc ?? translations[lang],
      }),
      img === undefined
        ? null
        : e("meta", {
            property: "og:image",
            content: baseUrl + img,
          }),
      e("link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }),
      e("link", { rel: "mask-icon", href: "/favicon.svg", color: "#000000" }),
      e("link", {
        rel: "alternate icon",
        type: "image/png",
        href: "/favicon.png",
      }),
      e("link", { rel: "apple-touch-icon", href: "/favicon.png" }),
      ...styles.map((s) => e("link", { rel: "stylesheet", href: `/${s}.css` })),
    ]),
    e("body", {}, children),
  ]);
}
