import { ReactElement } from "react";

function dateToIsoString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return `${y}-${m}-${d}`;
}

const fmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function dateToHumanString(date: Date): string {
  return fmt.format(date);
}

interface Props {
  date: Date;
}

export function DateShow({ date }: Props): ReactElement {
  return (
    <time dateTime={dateToIsoString(date)}>{dateToHumanString(date)}</time>
  );
}
