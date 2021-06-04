import { Lang } from "./lang";
import { ReactNode, ReactElement } from "react";

interface Props {
  lang: Lang;
  title: string;
  styles: string[];
  children: ReactNode;
}

export function Page({ lang, title, styles, children }: Props): ReactElement {
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="the personal website of azdavis" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
        {styles.map((s) => (
          <link key={s} rel="stylesheet" href={`/${s}.css`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
