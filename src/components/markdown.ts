import hl from "highlight.js";
import katex from "katex";
import markdownIt from "markdown-it";
import texmath from "markdown-it-texmath";

function highlight(code: string, language: string): string {
  if (!hl.getLanguage(language)) {
    throw new Error(`unknown language: ${language}`);
  }
  return hl.highlight(code, { language }).value;
}

const md = markdownIt({ highlight, typographer: true, html: true });
md.use(texmath, { engine: katex, delimiters: "dollars" });

export function markdown(value: string, inline: boolean = false): string {
  return inline ? md.renderInline(value) : md.render(value);
}
