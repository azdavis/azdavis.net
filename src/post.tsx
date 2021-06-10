import { DateShow } from "./date-show";
import { Lang, root } from "./lang";
import { Remarkable } from "remarkable";
import { Style, Page } from "./page";
import hl from "highlight.js";
import katex from "remarkable-katex";
import lean from "highlightjs-lean";
import type { ReactElement } from "react";

hl.registerLanguage("lean", lean);

function highlight(code: string, language: string): string {
  return hl.getLanguage(language) ? hl.highlight(code, { language }).value : "";
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

interface Props {
  title: string;
  content: string;
  date: Date;
  lang: Lang;
}

function Post({ title, content, date, lang }: Props): ReactElement {
  return (
    <Page lang={lang} title={title} styles={styles}>
      <div>
        <a href={root(lang)}>azdavis.xyz</a> •{" "}
        <DateShow lang={lang} date={date} />
      </div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={renderMd(content)} />
    </Page>
  );
}

export function post(props: Props) {
  return <Post {...props} />;
}
