import { Page } from "../page";

export const ja = (
  <Page lang="ja" title="man azdavis" styles={["base", "index"]}>
    <h2>名前</h2>
    <div className="sec">azdavis - 或る奴</div>
    <h2>説明</h2>
    <div className="sec">
      azdavisはStripeで働いている開発者である。カーネギーメロン大学でコンピューター科学の専攻と日本学の副専攻を取った。
    </div>
    <h2>ページ</h2>
    <dl className="sec">
      <dt>
        <a lang="en" href="/">
          English
        </a>
      </dt>
      <dd lang="en">Read this page in English.</dd>
      <dt>
        <a href="/ja/posts/">投稿</a>
      </dt>
      <dd>文章の揃い。</dd>
      <dt>
        <a href="https://github.com/azdavis">GitHub</a>
      </dt>
      <dd>リポジトリーの集まり。</dd>
    </dl>
    <h2>著作権</h2>
    <div className="sec">著作権１９９８アリエル・デイヴィス。</div>
  </Page>
);
