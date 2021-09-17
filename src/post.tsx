import hl from "highlight.js";
import lean from "highlightjs-lean";
import type { ReactElement } from "react";
import { Remarkable } from "remarkable";
import katex from "remarkable-katex";
import { DateShow } from "./date-show";
import { Lang, root } from "./lang";
import { Page, Style } from "./page";
import type { PostData } from "./post-data";

hl.registerLanguage("lean", lean);

function highlight(code: string, language: string): string {
  if (!hl.getLanguage(language)) {
    throw new Error(`unknown language: ${language}`);
  }
  return hl.highlight(code, { language }).value;
}

const md = new Remarkable({ highlight });
md.use(katex);

interface UnsafeHtml {
  __html: string;
}

function renderMd(content: string): UnsafeHtml {
  return { __html: md.render(content) };
}

const styles: Style[] = ["base", "code", "katex/katex.min"];

interface Props extends PostData {
  lang: Lang;
}

function Post({ title, content, date, lang }: Props): ReactElement {
  return (
    <Page lang={lang} title={title} styles={styles}>
      <div>
        <a href={root(lang)}>azdavis.net</a> •{" "}
        <DateShow lang={lang} date={date} />
      </div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={renderMd(content)} />
    </Page>
  );
}

export function post(props: Props): ReactElement {
  return <Post {...props} />;
}
