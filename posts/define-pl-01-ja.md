---
title: プログラミング言語を定義する、その一
date: 2021-03-31
lang: ja
---

この投稿のシリーズでは、私達は：

- 小さなプログラミング言語を公式な方法で定義します
- その言語について[Lean][lean]を使い定理を証明します

## 初めに

様々なプログラミング言語があります：C、C++、Java、JavaScript、Rust、Go、Python, Ruby、[Standard ML][sml]、その他。

だが何ゆえにそれらの言語は存在していると言い切れますか。言い換えれば、プログラミング言語を定義できるのは何ですか。

### 実装で定義を

答えの一つは、プログラミング言語の定義は、その実装にあります。

$P$というプログラミング言語があるとすれば、$P$言語の実装は、$p$という$P$言語のプログラムをインプットとするプログラムです。それは$p$を直接解釈し、或いは$p$を何らかのアウトプットに翻訳します。そのアウトプットは後で実行できます。

前者の実装方法は「インタプリタ」といい、後者は「コンパイラ」と言います。

プログラミング言語が役立つために、実装は必要不可欠だというのは、否定できません。それがなければその言語のプログラムを何一つ実行できませんから。

だがもし、或るプログラミング言語には一つだけではなく複数の実装が存在したらどうなるのでしょうか。その実装の中、どちらが本当に言語を定義するかが問題になりますね。その祝福された実装を、そこにあるバグを含めて全てを写さざるを得ないのでしょうか。

### 仕様で定義を

この問題を解決する方法の一つは、言語の仕様を書くことです。この仕様は人間の言語で書かれており、多くの場合、その言語は英語です。仕様を使い、開発者らは実装を作り上げるのです。

C、C++、[Go][go-spec]、[JavaScript][js-spec]（最も正しい名前は ECMAScript）などの言語はこのように仕様されています。

### 数学で仕様を

しかし、言葉だけではなく数学でもプログラミング言語を仕様できます。このように仕様された言語の例は[Standard ML][sml-spec]、[Pony][pony-spec]、[WebAssembly][wasm-spec]。

数学で言語を仕様することはたやすくできることでもないのかもしれませんが、そこにある利益が本当です。

まず、数学的な仕様は一義的で、曖昧では断じてありません。それに比べれば、人間言語だけで書かれた仕様は時に[曖昧][oxford-comma]で[分かりにくい][legalese]です。

更に、公式な方法を使えば、その仕様に関して定理が証明できます。これは、仕様にバグや誤りなどがないことを言い切れる証拠になります。

プログラミング言語を定義することで、この仕様の仕方を調べましょう。

## 「発言」という小さな言語

Rust でプログラミング言語を実装することについて傑作である[ブログ][eldiro]があります。作者がそのブログでしたように、英語の「utterance」という言葉を他の言語に翻訳することで、私達の言語を名付けるとしましょう。私自身の[興味][jp-resources]の[ある][jp-resume]言語である日本語を目的の言語にし。従って私達の言語を「発言」と名付けておきましょう。

今のところ、発言には式と型だけです。文、入力、副作用などがありません。

その式と型も非常に限られています。整数とブーリアンだけです。

整数を$\mathtt{123}$か$\mathtt{-456}$か$\mathtt{0}$のような定数で表します。整数は無限なので、定数も無限です。実用的な配慮を今のところ無視します。

ブーリアンの真を$\mathtt{true}$で、偽を$\mathtt{false}$で表記します。

最後に、条件式を追加します：

$$\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3$$

これはまず$e_1$を評価します。次に

- それは$\mathtt{true}$であれば$e_2$を評価し；
- それは$\mathtt{false}$であれば$e_3$を評価します。

（これらを全て公式化するぞ！）

発言は小さな言語であることは意図的です。言語その物がそれ程複雑ではないから、その言語を仕様する公式な方法は少しでも慣れやすくなる、というのは目的です。

## 構文規則

[BNF][bnf]のような形式文法で式と型の抽象的な構文規則を定義します。任意な式を$e$、型を$\tau$という変数で表します。

整数は無限で書くのは面倒になるから、$\overline{n}$は任意な整数だとします。

$$
\begin{aligned}
e
::=  \ & \overline{n}
\\ | \ & \mathtt{true}
\\ | \ & \mathtt{false}
\\ | \ & \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
\\
\\
\tau
::=  \ & \mathtt{Int}
\\ | \ & \mathtt{Bool}
\end{aligned}
$$

## 静的意味：$e: \tau$

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

条件式の非公式な意味では、$\mathtt{true}$か$\mathtt{false}$の場合しか意味を定義しました。ならばこの場合どうしますか。

一つの選択肢は、整数を$\mathtt{if}$と$\mathtt{then}$の間に現れることを許可します。C 言語のように、0 を「偽的」だとし、0 でない整数を「真的」だとします。

唯一残っている選択肢は、このような式を無効だと見なし、それらを評価しません。何が有効な式なのかを答えるためには発言の静的意味を定義します。

発言の静的意味には判断という物が一つあります：$e: \tau$。それを「$e$の型は$\tau$ だ」と読みます。この判断は式と型の関係を定義します。これで或る式$e$が有効だということは、或る型$\tau$が存在し$e: \tau$が証明できるということです。

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

最後に、最も興味深い推測規則は条件式の意味を定義します。もし

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

これで発言の静的意味の定義を完了とします。

## 動的意味

次は動的意味、つまりどうプログラムを評価するか、を定義する番です。動的意味を定義する方法はいくつかありますが、私達は[構造操作的意味][struct-op-sem]にします。

その為、判断を二つ作り上げます。

### 値：$e \ \mathsf{val}$

一つ目の判断は$e \ \mathsf{val}$。「$e$は値だ」と読みます。大体、値というのは評価し終わった式のことを言います。

発言では、値は整数定数とブーリアン定数です。

$$
\frac
  {}
  {\overline{n} \ \mathsf{val}}
$$

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

### 踏み出し：$e \rightarrow e'$

次、どの式が評価し終わっていないか、そしてどう評価するかを定義します。

第二の動的意味の判断である$e \rightarrow e'$は「$e$が一歩を踏みだし$e'$になる」と読みます。

発言では、唯一踏み出せる式は条件式です。

まず、その$\mathtt{if}$と$\mathtt{then}$の間にある$e_1$という式が踏み出すことができればその$e_1$を囲む条件式自体が他の$e_2$や$e_3$を変えずに踏み出せます。

$$
\frac
  {e_1 \rightarrow e_1'}
  {
    \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \rightarrow
    \mathtt{if} \ e_1' \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
  }
$$

そして、$e_1$が値だったらどうするか定義します。静的意味では$e_1$の型はブーリアンなので、値だったら絶対に$\mathtt{true}$か$\mathtt{false}$ですね。（これを後で証明するぜ！）

$\mathtt{true}$だったら$e_2$に踏み出します。

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{true} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \ \rightarrow
    e_2
  }
$$

$\mathtt{false}$だったら$e_3$に踏み出します。

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{false} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \rightarrow
    e_3
  }
$$

これで発言の動的意味定義も完了したのです。

## 定理

前に、公式な方法で言語を仕様すればその仕様についての定理を陳述し証明できると言いましたね。では定理を陳述しようではありませんか。次の投稿で証明しますので。

まずは「進歩」の定理。進歩は、型のある式は値か踏み出せると言います。

> For all $e$, if there exists $\tau$ such that $e: \tau$, then $e \
> \mathsf{val}$ or there exists $e'$ such that $e \rightarrow e'$.

次は「維持」です。維持は、型のある式が踏み出せれば、その踏み出された式も同じ型を持つと言います。

> For all $e$, if there exist $e'$ and $\tau$ such that $e: \tau$ and $e \rightarrow e'$, then $e': \tau$.

それらを合わせて次の「安全」定理の出来上がりです。

> For all $e$, if there exists $\tau$ such that $e: \tau$, then $e \ \mathsf{val}$ or there exists $e'$ such that $e \rightarrow e'$ and $e': \tau$.

とりわけ注目して欲しいのは、$e \rightarrow e'$の場合、$e': \tau$も事実。これでまた安全定理を$e'$に使えます。

次の投稿ではこれらの定理を証明するので、お楽しみください。

[bnf]: https://en.wikipedia.org/wiki/Backus–Naur_form
[eldiro]: https://arzg.github.io/lang/
[go-spec]: https://golang.org/ref/spec
[jisho-utterance]: https://jisho.org/word/発言
[jp-resources]: https://azdavis.xyz/posts/japanese-resources/
[jp-resume]: https://azdavis.xyz/ja/
[js-spec]: https://tc39.es/
[lean]: https://leanprover.github.io
[legalese]: https://en.wikipedia.org/wiki/Legal_English
[oxford-comma]: https://www.cnn.com/2018/02/09/us/dairy-drivers-oxford-comma-case-settlement-trnd
[peano]: https://en.wikipedia.org/wiki/Peano_axioms
[pony-spec]: https://www.ponylang.io/media/papers/fast-cheap-with-proof.pdf
[sml-spec]: https://smlfamily.github.io/sml97-defn.pdf
[sml]: https://www.smlnj.org/
[wasm-spec]: https://webassembly.github.io/spec/core/
[struct-op-sem]: https://www.youtube.com/watch?v=H40QE0_830Q
