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

const md = markdownIt({ highlight, typographer: true, html: true });
md.use(texmath, { engine: katex, delimiters: "dollars" });

interface UnsafeHtml {
  __html: string;
}

function renderMd(value: string, inline: boolean): UnsafeHtml {
  return { __html: inline ? md.renderInline(value) : md.render(value) };
}

interface Props {
  value: string;
  inline?: boolean;
}

export function Markdown({ value, inline = false }: Props): ReactElement {
  return <div dangerouslySetInnerHTML={renderMd(value, inline)} />;
}
