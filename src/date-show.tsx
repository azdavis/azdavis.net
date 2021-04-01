import { ReactElement } from "react";

function dateToIsoString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return `${y}-${m}-${d}`;
}

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
} as const;

const defaultFmt = new Intl.DateTimeFormat("en-US", options);
const jaFmt = new Intl.DateTimeFormat("ja-JP", options);

function getFmt(lang: string): Intl.DateTimeFormat {
  switch (lang) {
    case "ja":
      return jaFmt;
    default:
      return defaultFmt;
  }
}

function dateToHumanString(lang: string, date: Date): string {
  return getFmt(lang).format(date);
}

interface Props {
  lang: string;
  date: Date;
}

export function DateShow({ lang, date }: Props): ReactElement {
  return (
    <time dateTime={dateToIsoString(date)}>
      {dateToHumanString(lang, date)}
    </time>
  );
}
