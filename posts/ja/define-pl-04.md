---
title: "プログラミング言語を定義する：和"
date: 2021-07-15
desc: "tagged unionを小さなPLに追加します。"
---

[前の投稿][prev]では、積型を発言に追加しました。

この投稿では、和型を追加します。

和型は違う型の選択です。例えば、関数から時に或る型を戻したいけれど、また別の時に別の型を戻したい場合、その二つの型の和型を戻せます。

また、或る時に或る型の値があって、或る時に何もないということを表したいとします。その型と単位型の和型を使い、単位を「何もない」とすることができます。

驚くべきことに、多くのプログラミング言語には積型はあるけれども、私達がこれから見ることになる様な和型のある言語はそれほどありません。しかし、Haskell、OCaml、Standard ML、Rust などの関数型プログラミングを対応する言語には和型があります。

## 構文規則

まずは二項の和型です。それを「いずれか」（either）と呼び、$\tau_1 + \tau_2$で表記します。名前通り、この型の値は左の$\tau_1$か右の$\tau_2$から来ます。

しかし、どちらの型から来たかを伝える必要があります。その為、$\mathsf{L} \ e$と$\mathsf{R} \ e$という新たな「注射」式を二つ追加します。

どの型でもないという選択のある型は$\mathsf{0}$と書かれ、「ネバー」（never）といいます。なぜならこの型の値は決してないのです。

値のない型が役立たないと思われるのかもしれませんけれど、使い道は確かにあります。例えば、特別な関数でプログラムから直ちに出るという機能を追加したとします。これはプログラミング言語の良くある機能です。

- C/C++ には[`exit`][c-exit]
- Python には[`sys.exit`][py-exit]
- Java には[`System.exit`][java-exit]
- Rust には[`std::process::exit`][rs-exit]

この関数を呼び出すことによりプログラムから出るから、戻すことはありません。

このことを伝える為、関数が戻す型をネバーとします。即ち、ネバーを戻す関数は、その関数は何も戻さないということが分かります。その原因は、もし戻すことができたとすれば、ネバーの値を手に入れたという永遠にできないことができたということになります。

いかにも、[Sorbet][]という[Stripe][]で開発されている Ruby の型を確認するプログラムでは、ネバー型は[`T.noreturn`][noreturn]といいます。

そして漸く、和型を使うケース式を追加します。その為、和型の全ての可能性を対応する必要があります。

Either には二つ、左と右です。ねばーには何もありません。

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \mathsf{0}
\\ | \ & \tau_1 + \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & \mathsf{L} \ e
\\ | \ & \mathsf{R} \ e
\\ | \ & \mathsf{case} \ e \ \{ \}
\\ | \ & \mathsf{case} \ e \ \{
    \mathsf{L} \ x_1 . e_1,
    \mathsf{R} \ x_2 . e_2
    \}
\end{aligned}
$$

## 静的意味論

左単射式は実引数の型が either の左側であることを前提としますが、右側の型は任意です。

$$
\frac
  {\Gamma \vdash e: \tau_1}
  {\Gamma \vdash \mathsf{L} \ e: \tau_1 + \tau_2}
$$

右単射式は似ています。

$$
\frac
  {\Gamma \vdash e: \tau_2}
  {\Gamma \vdash \mathsf{R} \ e: \tau_1 + \tau_2}
$$

空っぽのケースの「頭」の式はネバー型で、式全体の型は任意です。これは、ネバーの値を実現するのは不可能だがら、それができたらなんでもできるということです。

$$
\frac
  {\Gamma \vdash e: \mathsf{0}}
  {\Gamma \vdash \mathsf{case} \ e \ \{ \}: \tau}
$$

二項のケースの頭の式の方は either 型で、それぞれの「腕」は頭の式の中身を変数に束縛します。この変数はそれぞれの腕の式を評価する際、使用可能です。腕の式の型は同じでなければなりません。そして、その一致している型は式全体の型です。

$$
\frac
  {
    \begin{aligned}
      &\Gamma \vdash e: \tau_1 + \tau_2
    \\&\Gamma, x_1: \tau_1 \vdash e_1: \tau
    \\&\Gamma, x_2: \tau_2 \vdash e_2: \tau
    \end{aligned}
  }
  {
    \Gamma \vdash \mathsf{case} \ e \ \{
      \mathsf{L} \ x_1 . e_1,
      \mathsf{R} \ x_2 . e_2
    \}: \tau
  }
$$

## 動的意味論

左単射の実引数は値であれば、その単射も値です。

$$
\frac
  {e \ \mathsf{val}}
  {\mathsf{L} \ e \ \mathsf{val}}
$$

右も同じく。

$$
\frac
  {e \ \mathsf{val}}
  {\mathsf{R} \ e \ \mathsf{val}}
$$

同様、左単射の実引数は踏み出せれば、その単射も踏み出せます。

$$
\frac
  {e \mapsto e'}
  {\mathsf{L} \ e \mapsto \mathsf{L} \ e'}
$$

そして右も同じく。

$$
\frac
  {e \mapsto e'}
  {\mathsf{R} \ e \mapsto \mathsf{R} \ e'}
$$

空のケースも。

$$
\frac
  {e \mapsto e'}
  {\mathsf{case} \ e \ \{ \} \mapsto \mathsf{case} \ e' \ \{ \}}
$$

二項のケースも。

$$
\frac
  {e \mapsto e'}
  {
    \begin{aligned}
      & \mathsf{case} \ e \ \{
        \mathsf{L} \ x_1 . e_1,
        \mathsf{R} \ x_2 . e_2
      \}
      \mapsto \\
      & \mathsf{case} \ e' \ \{
        \mathsf{L} \ x_1 . e_1,
        \mathsf{R} \ x_2 . e_2
      \}
    \end{aligned}
  }
$$

二項のケースの頭が値で左単射の時、その実引数を抽出し、左変数に束縛し、左式に踏み出します。

$$
\frac
  {
    \mathsf{L} \ e \ \mathsf{val} \hspace{1em}
    [x_1 \mapsto e] e_1 = e'
  }
  {
    \mathsf{case} \ \mathsf{L} \ e \ \{
      \mathsf{L} \ x_1 . e_1,
      \mathsf{R} \ x_2 . e_2
    \} \mapsto e'
  }
$$

右は似ています。

$$
\frac
  {
    \mathsf{R} \ e \ \mathsf{val} \hspace{1em}
    [x_2 \mapsto e] e_2 = e'
  }
  {
    \mathsf{case} \ \mathsf{R} \ e \ \{
      \mathsf{L} \ x_1 . e_1,
      \mathsf{R} \ x_2 . e_2
    \} \mapsto e'
  }
$$

## 助手

助手判断は前回と同様、大体機械的に更改します。

### 置き換え

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathsf{L} \ e = \mathsf{L} \ e'}
$$

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathsf{R} \ e = \mathsf{R} \ e'}
$$

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathsf{case} \ e \ \{\} = \mathsf{case} \ e' \ \{\}}
$$

二項のケースは、関数定数の置き換えの定義を再び使います。

ケースの腕両方は関数と似たように、変数を束縛し式に評価するから、定義を再び使うのは便利です。関数にすれば、両方の腕の変数は置き換えられている変数と同じかどうかをたやすく対応できます。

関数の変数に$\tau_1$と$\tau_2$の仮引数の型を書きますけれど、置き換えに関係ありません。

$$
\frac
  {
    \begin{aligned}
      & [x \mapsto e_x] e = e'
    \\& [x \mapsto e_x] \lambda (x_1: \tau_1) \ e_1 = \lambda (x_1: \tau_1) \ e_1'
    \\& [x \mapsto e_x] \lambda (x_2: \tau_2) \ e_2 = \lambda (x_2: \tau_2) \ e_2'
    \end{aligned}
  }
  {
    \begin{aligned}
      & [x \mapsto e_x]
    \\& \mathsf{case} \ e \ \{
        \mathsf{L} \ x_1 . e_1,
        \mathsf{R} \ x_2 . e_2
      \}
      = \\
      & \mathsf{case} \ e' \ \{
        \mathsf{L} \ x_1 . e_1',
        \mathsf{R} \ x_2 . e_2'
      \}
    \end{aligned}
  }
$$

### 自由変数

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathsf{L} \ e) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathsf{R} \ e) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathsf{case} \ e \ \{\}) = s}
$$

$$
\frac
  {
    \mathsf{fv}(e) = s \hspace{1em}
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2
  }
  {
    \begin{aligned}
    \mathsf{fv}(&\mathsf{case} \ e \ \{
      \mathsf{L} \ x_1 . e_1,
      \mathsf{R} \ x_2 . e_2
    \})
    = \\
    & s \cup (s_1 \setminus \{ x_1 \}) \cup (s_2 \setminus \{ x_2 \})
    \end{aligned}
  }
$$

## 語源

積型と似たように、和型は含まれている型の値の数とその和型の値の数の関係で名付けられています。

例えば、$|\mathsf{Bool} + \mathsf{1}| = 2 + 1 = 3$：

1. $\mathsf{L} \ \mathsf{true}$
1. $\mathsf{L} \ \mathsf{false}$
1. $\mathsf{R} \ \langle \rangle$

いかにも、$|\mathsf{0}| = 0$、そして$|\tau_1 + \tau_2| = |\tau_1| + |\tau_2|$。

## 和と積の双対性

和と積は[双対][duals]です。

ペアを作成する為、両方の型の値を設けます。そのペアを使用する際、値をいずれか一つ出せます。

Either を作成する際、二つの型をいずれか一つを選択肢、その型の値を儲ければいいだけの話です。そして、使用の際、両方を対応するのです。

## 結論

定理はまた[GitHub][proofs]にあります。

次の投稿はどうするか決めていません。発言に面白い機能をいくつか追加したから、次はどうするか考えます。

[prev]: /posts/define-pl-03/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-04
[sorbet]: https://sorbet.org
[stripe]: https://stripe.com
[noreturn]: https://sorbet.org/docs/noreturn
[duals]: https://en.wikipedia.org/wiki/Duality_(mathematics)
[c-exit]: https://pubs.opengroup.org/onlinepubs/9699919799/
[py-exit]: https://docs.python.org/3/library/sys.html#sys.exit
[java-exit]: https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#exit(int)
[rs-exit]: https://doc.rust-lang.org/stable/std/process/fn.exit.html
