import { absurd } from "./absurd";
import { Lang } from "./lang";
import { ReactElement } from "react";

function dateToIsoString(date: Date): string {
  return date.toISOString().split("T")[0];
}

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
} as const;

const enFmt = new Intl.DateTimeFormat("en-US", options);
const jaFmt = new Intl.DateTimeFormat("ja-JP", options);

function getFmt(lang: Lang): Intl.DateTimeFormat {
  switch (lang) {
    case "en":
      return enFmt;
    case "ja":
      return jaFmt;
    default:
      return absurd(lang);
  }
}

function dateToHumanString(lang: Lang, date: Date): string {
  return getFmt(lang).format(date);
}

interface Props {
  lang: Lang;
  date: Date;
}

export function DateShow({ lang, date }: Props): ReactElement {
  return (
    <time dateTime={dateToIsoString(date)}>
      {dateToHumanString(lang, date)}
    </time>
  );
}
