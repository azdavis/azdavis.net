import { ReactElement } from "react";
import { Remarkable } from "remarkable";
import hl from "highlight.js";
import katex from "remarkable-katex";

interface Props {
  title: string;
  content: string;
}

function highlight(code: string, language: string): string {
  return hl.getLanguage(language) ? hl.highlight(code, { language }).value : "";
}

const markdown = new Remarkable({ highlight });
markdown.use(katex);

export function Post({ title, content }: Props): ReactElement {
  return (
    <>
      <a href="/">azdavis.xyz</a>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: markdown.render(content) }} />
    </>
  );
}
