export type Lang = "en" | "ja";

/**
 * always starts and ends with a /
 */
export function root(lang: Lang) {
  return lang === "en" ? "/" : `/${lang}/`;
}
