---
title: "プログラミング言語を定義する：関数"
date: 2021-05-22
desc: "関数を小さなPLに追加します。"
---

[前の投稿][prev]では、発言という整数とブーリアンの型があるプログラミング言語を紹介しました。

この投稿では、発言に関数を追加します。これで、発言の表現力は[単純型付ラムダ計算][stlc]とほぼ同じとなります。

## 構文規則

式の構文規則を改め、変数、関数定数、そして関数適用を追加し、更に型の構文規則に関数型を追加します。

変数は$x$か$y$か$x_1$か$x'$などで表記する。変数の名前は無限です。

$\lambda (x: \tau) \ e$は関数定数で、$x$という$\tau$の型のある引数を一つ取り、実引数に適用されたら$e$を評価します。$x$は$e$の中に現れるのは可能です。

$e_1(e_2)$は関数適用式で、関数の$e_1$を実引数の$e_2$への適用を表現します。

$\tau_1 \rightarrow \tau_2$は$\tau_1$を入力とし、$\tau_2$を出力とする関数の型です。

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \tau_1 \rightarrow \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & x
\\ | \ & \lambda (x: \tau) \ e
\\ | \ & e_1(e_2)
\end{aligned}
$$

## 静的意味論：$\Gamma \vdash e: \tau$

$\lambda (x: \mathsf{Int}) \ x$の式をご覧ください。式の型は$\mathsf{Int}\rightarrow \mathsf{Int}$のはずです。

それに似た式$\lambda (x: \mathsf{Bool}) \ x$の型は$\mathsf{Bool} \rightarrow \mathsf{Bool}$のはずです。

この式両方では、$x$の式は含まれています。しかし、$x$の型は違います。一番目では$\mathsf{Int}$で、二番目では$\mathsf{Bool}$です。

この例に描かれたように、変数の型は、その変数はどう宣言されたによります。文脈により同じ式（この場合は$x$）の型が異なるというのは、今までなかったことです。

変数を対処する為、静的意味論の構造を根本的に改変せねばなりますまい。

まず、文脈というのを形式化します。一つの文脈を$\Gamma$と表記し、それは変数と型のペアのリストです。

文脈は空か、既に存在する文脈に一つの変数と型のペアが追加された物です。

$$
\begin{aligned}
\Gamma
::=  \ & \cdot
\\ | \ & \Gamma, x: \tau
\end{aligned}
$$

前の型の判断は$e: \tau$で、「$e$の型は$\tau$だ」と読みましたが、新たなる判断は$\Gamma \vdash e: \tau$と表記し、「$\Gamma$は$e$の型が$\tau$だということを含意する」と読みます。

前の投稿の静的意味論の規則を改めなくてはいけません。これらは文脈を一切変えません。

$$
\frac
  {}
  {\Gamma \vdash \overline{n}: \mathsf{Int}}
$$

$$
\frac
  {}
  {\Gamma \vdash \mathsf{true}: \mathsf{Bool}}
$$

$$
\frac
  {}
  {\Gamma \vdash \mathsf{false}: \mathsf{Bool}}
$$

$$
\frac
  {
    \Gamma \vdash e_1: \mathsf{Bool} \hspace{1em}
    \Gamma \vdash e_2: \tau \hspace{1em}
    \Gamma \vdash e_3: \tau
  }
  {
    \Gamma \vdash
    \mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3: \tau
  }
$$

これで新たな式の為の規則を定義します。

文脈により変数の型を調べる為、$\Gamma(x) = \tau$の判断を定義します。

$$
\frac
  {}
  {(\Gamma, x: \tau)(x) = \tau}
$$

$$
\frac
  {
    x \ne y \hspace{1em}
    \Gamma(x) = \tau
  }
  {(\Gamma, y: \tau')(x) = \tau}
$$

この規則は「shadowing」という現象を生み出します。これは、同じ変数のある複数のペアが文脈に存在することができるけれど、そのペアの中、一番右のペアはその変数の型を決定する、ということを指します。例えば、規則によると

$$
(\cdot, x: \mathsf{Int}, x: \mathsf{Bool}, y: \mathsf{Int})(x) =
  \mathsf{Bool}
$$

この判断を使い、変数の型の規則を制作します。

$$
\frac
  {\Gamma(x) = \tau}
  {\Gamma \vdash x: \tau}
$$

関数定数は、仮引数の型は入力の方で、関数の本体の型は出力の型です。

しかし、関数定数に束縛された変数は、本体に現れるのは可能だから、本体の型を決める時だけに、変数とその型を文脈に追加します。

$$
\frac
  {\Gamma, x: \tau_1 \vdash e: \tau_2}
  {\Gamma \vdash \lambda (x: \tau_1) \ e: \tau_1 \rightarrow \tau_2}
$$

適用は、仮引数と実引数の型が一致しなければなりません。

$$
\frac
  {
    \Gamma \vdash e_1: \tau_1 \rightarrow \tau_2 \hspace{1em}
    \Gamma \vdash e_2: \tau_1
  }
  {\Gamma \vdash e_1(e_2): \tau_2}
$$

## 動的意味論：$e \ \mathsf{val}$と$e \mapsto e'$

関数の本体は値かどうかにも関わらず、関数定数は値です。

$$
\frac
  {}
  {\lambda (x: \tau) \ e \ \mathsf{val}}
$$

適用式はまず関数、次実引数を値にします。

$$
\frac
  {e_1 \mapsto e_1'}
  {e_1(e_2) \mapsto e_1'(e_2)}
$$

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \mapsto e_2'
  }
  {e_1(e_2) \mapsto e_1(e_2')}
$$

両方が値の時、関数は関数定数であることは証明できます。

関数本体に踏み出し、その式の中の関数により束縛された変数を実引数に置き換えます。「$e'$に、自由変数$x$を$e$に置き換えれば$e''$となる」を$[x \mapsto e] e' = e''$と表記します。

$$
\frac
  {
    e_2 \ \mathsf{val} \hspace{1em}
    [x \mapsto e_2] e = e'
  }
  {
    (\lambda (x: \tau) \ e) \ e_2 \mapsto e'
  }
$$

## 置き換え：$[x \mapsto e_x] e = e'$

関数適用の動的意味論を定義する為、式の置き換えをも定義します。

置き換えは整数とブーリアンの定数を変えません。

$$
\frac
  {}
  {[x \mapsto e_x] \overline{n} = \overline{n}}
$$

$$
\frac
  {}
  {[x \mapsto e_x] \mathsf{true} = \mathsf{true}}
$$

$$
\frac
  {}
  {[x \mapsto e_x] \mathsf{false} = \mathsf{false}}
$$

条件と適用の式は、ただその中の式に帰納します。

$$
\frac
  {
    \begin{aligned}
      &[x \mapsto e_x] e_1 = e_1' \hspace{1em}
    \\&[x \mapsto e_x] e_2 = e_2' \hspace{1em}
    \\&[x \mapsto e_x] e_3 = e_3'
    \end{aligned}
  }
  {
    \begin{aligned}
      [x \mapsto e_x] &\mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3 =
    \\&\mathsf{if} \ e_1' \ \mathsf{then} \ e_2' \ \mathsf{else} \ e_3'
    \end{aligned}
  }
$$

$$
\frac
  {
    [x \mapsto e_x] e_1 = e_1' \hspace{1em}
    [x \mapsto e_x] e_2 = e_2'
  }
  {
    [x \mapsto e_x] e_1(e_2) =
    e_1'(e_2')
  }
$$

変数は、どうするかはその変数が置き換えられている変数かによります。そうであれば置き換えるけれど、そうでなければ無視します。

$$
\frac
  {}
  {[x \mapsto e_x] x = e_x}
$$

$$
\frac
  {x \ne y}
  {[x \mapsto e_x] y = y}
$$

関数定数は、また変数が同じかどうかを見ます。同じだったら関数を変えません。これは、静的意味論では同じ変数のある複数のペアが文脈にある場合の扱い方に首尾一貫します。

$$
\frac
  {}
  {[x \mapsto e_x] \lambda (x: \tau) \ e = \lambda (x: \tau) \ e}
$$

変数が違ったら、変数捕獲を回避する必要があります。例えばもし

$$
\frac
  {
    x \ne y \hspace{1em}
    [x \mapsto e_x] e = e'
  }
  {[x \mapsto e_x] \lambda (y: \tau) \ e = \lambda (y: \tau) \ e'}
$$

を規則として定義したらば、規則を使い

$$[x \mapsto y] \lambda (y: \mathsf{Bool}) \ x = \lambda (y: \mathsf{Bool}) \ y$$

は証明できてしまうのです。この場合、変数の$y$は関数の束縛された$y$により捕獲されたのです。

これを回避する為、変数は$e$の自由変数ではないことを不可欠な前提とします。従って規則を改善し、$e_x$の中の自由変数を$\mathsf{fv}(e_x)$と表記します。

$$
\frac
  {
    x \ne y \hspace{1em}
    y \notin \mathsf{fv}(e_x) \hspace{1em}
    [x \mapsto e_x] e = e'
  }
  {[x \mapsto e_x] \lambda (y: \tau) \ e = \lambda (y: \tau) \ e'}
$$

## 自由変数：$\mathsf{fv}(e)$

式の自由変数も定義します。

整数とブーリアンには変数がありません。

$$
\frac
  {}
  {\mathsf{fv}(\overline{n}) = \emptyset}
$$

$$
\frac
  {}
  {\mathsf{fv}(\mathsf{true}) = \emptyset}
$$

$$
\frac
  {}
  {\mathsf{fv}(\mathsf{false}) = \emptyset}
$$

条件と適用はまた帰納します。

$$
\frac
  {
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2 \hspace{1em}
    \mathsf{fv}(e_3) = s_3
  }
  {
    \mathsf{fv}(\mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3) =
    s_1 \cup s_2 \cup s_3
  }
$$

$$
\frac
  {
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2
  }
  {
    \mathsf{fv}(e_1(e_2)) =
    s_1 \cup s_2
  }
$$

一つの変数は自由。

$$
\frac
  {}
  {\mathsf{fv}(x) = \{ x \}}
$$

関数は一つの変数を束縛し、その自由を奪います。

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\lambda (x: \tau) \ e) = \{ x \} \setminus s}
$$

## 定理

判断事態は少し変わったから、定理も少し言い直します。

### 進歩

> For all $\Gamma$ and $e$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$, then $e \ \mathsf{val}$ or there exists $e'$ such that $e \mapsto e'$.

$e$には自由変数が全くないことを前提とします。これで、評価しながら必要となると置き換えられます。

この前提はなぜ必要かを答える為に、$e$を次の式にして見ましょう。

$$
(\lambda (x: \mathsf{Bool} \rightarrow \mathsf{Bool}) \ x) \
  (\lambda (y: \mathsf{Bool}) \ x)
$$

この式には自由変数の$x$があります。規則によれば、この式は値ではなく、踏み出すこともできないのです。原因は、$x$は実引数には自由なのに関数に束縛されているのです。

もっと小さな例は式の$x$です。また規則によれば、変数は値ではなく、踏み出せません。変数は、置き換えにより意味が与えられるのです。

### 維持

> For all $\Gamma$ and $e$ and $e'$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$ and $e \mapsto e'$, then $\Gamma \vdash e': \tau$ and $\mathsf{fv}(e') = \emptyset$.

維持定理は型だけではなく、自由変数の有無も維持します。$e'$を進歩させる為には自由変数がないのは進歩定理の前提として必要だから、その有無が維持できるのは大事です。

### 安全

また、この定理を合わせれば安全定理の出来上がりです。

> For all $\Gamma$ and $e$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$, then $e \ \mathsf{val}$ or there exists $e'$ such that $e \mapsto e'$ and $\Gamma \vdash e': \tau$ and $\mathsf{fv}(e') =
> \emptyset$.

証明はまた[GitHub][proofs]にあります。

[次の投稿][next]では、積型を紹介します。これらを struct や tuple とも言います。

[prev]: /ja/posts/define-pl-01/
[next]: /ja/posts/define-pl-03/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-02
[stlc]: https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus
