export const index = {
  lang: "en",
  title: "man azdavis",
  styles: ["base", "index"],
  body: (
    <>
      <h2>NAME</h2>
      <div className="sec">azdavis - a fella</div>
      <h2>DESCRIPTION</h2>
      <div className="sec">
        azdavis is a software engineer working at Stripe. He acquired a major in
        computer science, with a minor in Japanese studies, from Carnegie Mellon
        University.
      </div>
      <h2>PAGES</h2>
      <dl className="sec">
        <dt>
          <a lang="ja" href="/ja/">
            日本語
          </a>
        </dt>
        <dd lang="ja">このページを日本語で読む。</dd>
        <dt>
          <a href="/posts/">Posts</a>
        </dt>
        <dd>An assortment of writings.</dd>
        <dt>
          <a href="https://github.com/azdavis">GitHub</a>
        </dt>
        <dd>A collection of repositories.</dd>
      </dl>
      <h2>COPYRIGHT</h2>
      <div className="sec">Copyright 1998 Ariel Davis.</div>
    </>
  ),
};
