import type { ReactElement } from "react";
import { mkDateTimeFmt } from "./date-time-fmt";
import type { Lang } from "./lang";

function dateToIsoString(date: Date): string {
  return date.toISOString().split("T")[0];
}

const dateToHumanString = mkDateTimeFmt({
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

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
