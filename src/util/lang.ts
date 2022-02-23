export type Lang = "en" | "ja";

export const all: Lang[] = ["en", "ja"];

/**
 * always starts and ends with a /
 */
export function root(lang: Lang) {
  return lang === "en" ? "/" : `/${lang}/`;
}

export const name = { en: "English", ja: "日本語" };
