import { absurd } from "../util/absurd";
import { e } from "../util/e";
import type { Lang } from "../util/lang";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

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

function dateToHumanString(lang: Lang, date: Date): string {
  return getFmt(lang).format(date);
}

function dateToIsoString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function dateShow(lang: Lang, date: Date): string {
  return e("time", { datetime: dateToIsoString(date) }, [
    dateToHumanString(lang, date),
  ]);
}
