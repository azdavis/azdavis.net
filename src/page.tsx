import { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

interface Props {
  lang: string;
  title: string;
  styles: string[];
  body: ReactElement;
}

function PageImpl({ lang, title, styles, body }: Props): ReactElement {
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
      <body>{body}</body>
    </html>
  );
}

export function page(props: Props): string {
  return renderToStaticMarkup(<PageImpl {...props} />);
}
