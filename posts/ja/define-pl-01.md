---
title: "プログラミング言語を定義する：初めに、整数、ブーリアン"
date: 2021-03-31
---

この投稿のシリーズでは、私達は小さなプログラミング言語を形式手法で定義します。その定義について[Lean][lean]を使い定理を証明します。

## 初めに

様々なプログラミング言語が存在します。古いのはありながら、新たなのもあります。汎用なのもドメイン固有なのも。

しかしプログラミング言語とは何でしょう。言い換えれば、プログラミング言語を定義するのは何ですか。

### 実装で定義を

答えの一つは、プログラミング言語の定義は、その実装にあります。

$L$というプログラミング言語があるとすれば、$L$言語の実装は、$p$という$L$言語のプログラムをインプットとして、$p$による何らかのアウトプットを作り出し、もしくは$p$を無効として拒絶するプログラムです。

それで、実装が$p$を拒絶しなければ、$p$は$L$言語のプログラムだ、という定義を立てます。

しかし、言語には複数の実装があって、その実装らは同じプログラムに違う行動を取ったら、どちらの実装は本当に言語の定義だと言い切れますか。

### 仕様で定義を

この問題を解決する方法の一つは、言語の仕様を書くことです。この仕様は人間の言語で書かれています。仕様を参考にし、開発者らは実装を作り上げるのです。

C、C++、[Go][go-spec]、[JavaScript][js-spec]（最も正しい名前は ECMAScript）などの言語はこのように仕様されています。

### 数学で仕様を

しかし、言葉だけではなく数学でもプログラミング言語を仕様できます。このように仕様された言語の例は[Standard ML][sml-spec]、[Pony][pony-spec]、[WebAssembly][wasm-spec]。

数学で言語を仕様することはたやすくできることでもないのかもしれませんが、そこにある利益が本当です。

まず、数学的な仕様は一義的で、曖昧では断じてありません。それに比べれば、人間言語だけで書かれた仕様は時に[曖昧][c-undefined]で分かりにくいです。

更に、形式手法を使えば、その仕様に関して定理が証明できます。これは、仕様にバグや誤りなどがないことを言い切れる証拠になります。

プログラミング言語を定義することで、この仕様の仕方を調べましょう。

## 「発言」という小さな言語

まずは言語に名をつけるのです。

プログラミング言語を実装することについて傑作である[ブログ][eldiro]があります。作者がそのブログでしたように、英語の「utterance」という言葉を他の言語に翻訳することで、私達の言語を名付けるとしましょう。私自身の[興味のある][jp-resources]言語である日本語を目的の言語にします。従って私達の言語を「発言」と名付けておきましょう。

今のところ、発言には整数とブーリアンだけです。

整数を$\mathtt{123}$か$\mathtt{-456}$か$\mathtt{0}$のような定数の式で表します。整数は無限なので、定数も無限です。整数の最大限などの実用的な配慮を今のところ無視します。

ブーリアンの真を$\mathtt{true}$で、偽を$\mathtt{false}$で表記します。

最後に、条件式を追加します：

$$\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3$$

これはまず$e_1$を評価します。次に

- それは$\mathtt{true}$であれば$e_2$を評価し；
- それは$\mathtt{false}$であれば$e_3$を評価します。

発言は小さな言語であることは意図的です。言語その物がそれ程複雑ではないから、その言語を仕様する形式手法は少しでも慣れやすくなる、というのは目的です。

## 構文規則

[BNF][bnf]のような形式文法で式と型の抽象的な構文規則を定義します。任意な型を$\tau$、式を$e$という変数で表します。

整数は無限で書くのは面倒になるから、$\overline{n}$は任意な整数だとします。

$$
\begin{aligned}
\tau
::=  \ & \mathtt{Int}
\\ | \ & \mathtt{Bool}
\\
\\
e
::=  \ & \overline{n}
\\ | \ & \mathtt{true}
\\ | \ & \mathtt{false}
\\ | \ & \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
\end{aligned}
$$

これは、$e$という式が整数定数か、ブーリアン定数か、条件式だということです。

条件式には他の式$e_1$、$e_2$、$e_3$が含まれていることを注意してください。

## 静的意味論：$e: \tau$

形式文法によれば、次の式は有効：

$$
\mathtt{if} \ \mathtt{true} \
  \mathtt{then} \ \mathtt{456} \
  \mathtt{else} \ \mathtt{789}
$$

これは$\mathtt{456}$に評価しますね。

だが次の式はどうなのでしょう。

$$
\mathtt{if} \ \mathtt{123} \
  \mathtt{then} \ \mathtt{456} \
  \mathtt{else} \ \mathtt{789}
$$

条件式の非形式な意味論では、$\mathtt{true}$か$\mathtt{false}$の場合しか意味論を定義しました。ならばこの場合どうしますか。

一つの選択肢は、整数を$\mathtt{if}$と$\mathtt{then}$の間に現れることを許可します。C 言語のように、$0$を$\mathtt{false}$と扱い、$0$でない整数を$\mathtt{true}$と扱うことができます。

唯一残っている選択肢は、このような式を無効だと見なし、それらを評価しません。何が有効な式なのかを答えるためには発言の静的意味論を定義します。

発言の静的意味論には判断という物が一つあります：$e: \tau$。それを「$e$の型は$\tau$ だ」と読みます。この判断は式と型の関係を定義します。これで或る式$e$が有効だということは、或る型$\tau$が存在し$e: \tau$が証明できるということです。

判断を定義する為、推測規則を書きます。まず、整数定数の式の型は整数です。

$$
\frac
  {}
  {\overline{n}: \mathtt{Int}}
$$

一般的に、推測規則は分数に見え、前提が上で一つの結論が下です。この規則には前提がないから線の上には何もあります。

次、$\mathtt{true}$と$\mathtt{false}$の型はブーリアンです。

$$
\frac
  {}
  {\mathtt{true}: \mathtt{Bool}}
$$

$$
\frac
  {}
  {\mathtt{false}: \mathtt{Bool}}
$$

最後に、最も興味深い推測規則は条件式の意味論を定義します。もし

- 任意の式$e_1$、$e_2$、$e_3$が三つあって
- $e_1$の型はブーリアン
- $e_2$の型は$\tau$
- $e_3$の型も同じ$\tau$

であれば、条件式の型は$\tau$です。

これを推測規則で簡潔に言えます:

$$
\frac
  {
    e_1: \mathtt{Bool} \hspace{1em}
    e_2: \tau \hspace{1em}
    e_3: \tau
  }
  {\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3: \tau}
$$

前に述べた通り、前提が線の上にあります。前提が複数なので、それらの間に空間を入れます。そして結論は線の下です。

これで発言の静的意味論の定義を完了とします。

## 動的意味論

式をどう評価するかを定義します。これは動的意味論と言います。動的意味論の定義の仕方はいくつかありますが、私達は[構造操作的意味論][struct-op-sem]にします。

その為、判断を二つ作り上げます。判断は推測規則で定義されます。

### 値：$e \ \mathsf{val}$

一つ目の判断は$e \ \mathsf{val}$。「$e$は値だ」と読みます。値というのは評価し終わった式のことを言います。

まず、整数定数は値です。この事実を推測規則で表記します。

$$
\frac
  {}
  {\overline{n} \ \mathsf{val}}
$$

ブーリアン定数も値だと、二個の規則で表します。

$$
\frac
  {}
  {\mathtt{true} \ \mathsf{val}}
$$

$$
\frac
  {}
  {\mathtt{false} \ \mathsf{val}}
$$

発言ではこれらだけが値です。しかし条件式はどうでしょう。

### 踏み出し：$e \mapsto e'$

値でない式をどう評価するかを定義します。

第二の動的意味論の判断である$e \mapsto e'$は「$e$が一歩を踏み出し$e'$になる」と読みます。

これで「式を評価する」というのは式が値になるまで新たな式へと踏み出すということになります。

発言では、唯一踏み出せる式は条件式です。まず、その$\mathtt{if}$と$\mathtt{then}$の間にある$e_1$という式が踏み出すことができればその$e_1$を囲む条件式自体が他の$e_2$や$e_3$を変えずに踏み出せます。

$$
\frac
  {e_1 \mapsto e_1'}
  {
    \begin{aligned}
      &\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \mapsto
    \\&\mathtt{if} \ e_1' \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
    \end{aligned}
  }
$$

そして、$e_1$が値だったらどうするか定義します。$\mathtt{true}$だったら$e_3$を無視しながら$e_2$に踏み出します。

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{true} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \ \mapsto
    e_2
  }
$$

$\mathtt{false}$だったら逆に$e_2$を無視しならが$e_3$に踏み出します。

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{false} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \mapsto
    e_3
  }
$$

これで動的意味論の定義を完了したのです。

## 定理

今になって、発言についての定理を宣言し証明できます。

まずは「進歩」の定理。進歩は、型のある式は値か踏み出せると言います。

> For all $e$ and $\tau$, if $e: \tau$, then $e \ \mathsf{val}$ or there exists
> $e'$ such that $e \mapsto e'$.

次は「維持」です。維持は、型のある式が踏み出せれば、その踏み出された式も同じ型を持つと言います。

> For all $e$ and $e'$ and $\tau$, if $e: \tau$ and $e \mapsto e'$, then $e':
> \tau$.

それらを合わせて次の「安全」定理の出来上がりです。

> For all $e$ and $\tau$, if $e: \tau$, then $e \ \mathsf{val}$ or there exists
> $e'$ such that $e \mapsto e'$ and $e': \tau$.

とりわけ注目して欲しいのは、$e \mapsto e'$の場合、$e': \tau$も事実。これでまた安全定理を$e'$に使えます。

証明は[GitHub][proof]にあります。

[次の投稿][next]では、関数を発言に追加します。

[bnf]: https://en.wikipedia.org/wiki/Backus–Naur_form
[eldiro]: https://arzg.github.io/lang/
[go-spec]: https://golang.org/ref/spec
[jisho-utterance]: https://jisho.org/word/発言
[jp-resources]: https://azdavis.xyz/posts/japanese-resources/
[js-spec]: https://tc39.es/
[lean]: https://leanprover.github.io
[c-undefined]: https://www.yodaiken.com/2021/05/19/undefined-behavior-in-c-is-a-reading-error/
[pony-spec]: https://www.ponylang.io/media/papers/fast-cheap-with-proof.pdf
[sml-spec]: https://smlfamily.github.io/sml97-defn.pdf
[wasm-spec]: https://webassembly.github.io/spec/core/
[struct-op-sem]: https://www.youtube.com/watch?v=H40QE0_830Q
[proof]: https://github.com/azdavis/hatsugen/tree/part-01
[next]: /ja/posts/define-pl-02/
