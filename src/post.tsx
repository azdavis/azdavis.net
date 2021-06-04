import { DateShow } from "./date-show";
import { Lang } from "./lang";
import { Style, Page } from "./page";
import { ReactElement } from "react";
import { Remarkable } from "remarkable";
import hl from "highlight.js";
import katex from "remarkable-katex";
import lean from "highlightjs-lean";

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

export function Post({ title, content, date, lang }: Props): ReactElement {
  return (
    <Page lang={lang} title={title} styles={styles}>
      <div>
        <a href={"/" + (lang === "en" ? "" : lang)}>azdavis.xyz</a> •{" "}
        <DateShow lang={lang} date={date} />
      </div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={renderMd(content)} />
    </Page>
  );
}
