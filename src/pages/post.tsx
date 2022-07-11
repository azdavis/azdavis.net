import hl from "highlight.js";
import katex from "katex";
import markdownIt from "markdown-it";
import texmath from "markdown-it-texmath";
import { Fragment, ReactElement } from "react";
import { DateShow } from "../components/DateShow";
import { Page, Style } from "../components/Page";
import { Lang, name, root } from "../util/lang";
import {
  PostData,
  postDir,
  postsDir,
  translations as posts,
} from "../util/post-data";

function highlight(code: string, language: string): string {
  if (!hl.getLanguage(language)) {
    throw new Error(`unknown language: ${language}`);
  }
  return hl.highlight(code, { language }).value;
}

const md = markdownIt({ highlight });
md.use(texmath, { engine: katex, delimiters: "dollars" });

interface UnsafeHtml {
  __html: string;
}

function renderMd(content: string): UnsafeHtml {
  return { __html: md.render(content) };
}

const styles: Style[] = ["base", "post", "katex/katex.min"];

interface Props {
  data: PostData;
  lang: Lang;
  // includes lang (thus, never empty)
  langs: Lang[];
  slug: string;
}

const translations = {
  translations: { en: "Translations: ", ja: "翻訳\uff1a" },
  posts,
  lRound: { en: "(", ja: "\uff08" },
  rRound: { en: ")", ja: "\uff09" },
};

function Post({ data, lang, langs, slug }: Props): ReactElement {
  const { title, desc, date, content } = data;
  return (
    <Page lang={lang} title={title} desc={desc} styles={styles}>
      <a href={root(lang)}>azdavis.net</a> •{" "}
      <a href={postsDir(lang) + "/"}>{translations.posts[lang]}</a> •{" "}
      <DateShow lang={lang} date={date} />
      <h1>{title}</h1>
      {langs.length > 1 && (
        <p>
          {translations.lRound[lang]}
          {translations.translations[lang]}
          {langs.map((l, idx) => {
            const s = name[l];
            const inner = l === lang ? <b>{s}</b> : s;
            const last = idx + 1 === langs.length ? null : " • ";
            return (
              <Fragment key={l}>
                <a href={postDir(l, slug)}>{inner}</a>
                {last}
              </Fragment>
            );
          })}
          {translations.rRound[lang]}
        </p>
      )}
      <div dangerouslySetInnerHTML={renderMd(content)} />
    </Page>
  );
}

export function post(props: Props): ReactElement {
  return <Post {...props} />;
}
