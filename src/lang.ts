export type Lang = "en" | "ja";

export function root(lang: Lang) {
  return lang === "en" ? "/" : `/${lang}/`;
}
