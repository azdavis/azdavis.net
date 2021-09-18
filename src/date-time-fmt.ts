import { absurd } from "./absurd";
import type { Lang } from "./lang";

export function mkDateTimeFmt(
  options: Intl.DateTimeFormatOptions,
): (lang: Lang, date: Date) => string {
  const en = new Intl.DateTimeFormat("en", options);
  const ja = new Intl.DateTimeFormat("ja", options);
  function getFmt(lang: Lang): Intl.DateTimeFormat {
    switch (lang) {
      case "en":
        return en;
      case "ja":
        return ja;
      default:
        return absurd(lang);
    }
  }
  return (lang, date) => getFmt(lang).format(date);
}
