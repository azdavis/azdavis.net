import type { ReactElement, ReactNode } from "react";
import type { Lang } from "./lang";

export type Style = "base" | "code" | "index" | "katex/katex.min" | "posts";

const translations = {
  en: {
    desc: "the personal website of azdavis",
  },
  ja: {
    desc: "azdavisの個人的なウェブサイト",
  },
};

interface Props {
  lang: Lang;
  title: string;
  styles: Style[];
  children: ReactNode;
}

export function Page({ lang, title, styles, children }: Props): ReactElement {
  const t = translations[lang];
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={t.desc} />
        <link rel="icon" href="/favicon.png" />
        {styles.map((s) => (
          <link key={s} rel="stylesheet" href={`/${s}.css`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
