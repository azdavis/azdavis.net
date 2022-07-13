import { Fragment, ReactElement } from "react";
import { DateShow } from "../components/DateShow";
import { Markdown } from "../components/Markdown";
import { Page, Style } from "../components/Page";
import { Lang, name, root } from "../util/lang";
import {
  PostData,
  postDir,
  postsDir,
  translations as posts,
} from "../util/post-data";

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
      <Markdown value={content} />
    </Page>
  );
}

export function post(props: Props): ReactElement {
  return <Post {...props} />;
}
