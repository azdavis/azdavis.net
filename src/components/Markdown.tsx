import hl from "highlight.js";
import katex from "katex";
import markdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import { ReactElement } from "react";

function highlight(code: string, language: string): string {
  if (!hl.getLanguage(language)) {
    throw new Error(`unknown language: ${language}`);
  }
  return hl.highlight(code, { language }).value;
}

const md = markdownIt({ highlight, typographer: true });
md.use(texmath, { engine: katex, delimiters: "dollars" });

interface UnsafeHtml {
  __html: string;
}

function renderMd(value: string): UnsafeHtml {
  return { __html: md.render(value) };
}

interface Props {
  value: string;
}

export function Markdown({ value }: Props): ReactElement {
  return <div dangerouslySetInnerHTML={renderMd(value)} />;
}
