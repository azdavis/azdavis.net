import type { ReactElement, ReactNode } from "react";
import type { Lang } from "./lang";

export type Style = "base" | "code" | "index" | "katex/katex.min" | "posts";

const translations = {
  en: "the personal website of azdavis",
  ja: "azdavisの個人的なウェブサイト",
};

interface Props {
  lang: Lang;
  title: string;
  styles: Style[];
  children: ReactNode;
}

export function Page({ lang, title, styles, children }: Props): ReactElement {
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={translations[lang]} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000" />
        <link rel="alternate icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {styles.map((s) => (
          <link key={s} rel="stylesheet" href={`/${s}.css`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
