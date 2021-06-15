---
title: "プログラミング言語を定義する：積"
date: 2021-06-05
---

[前の投稿][prev]では、発言に関数を追加しました。

この投稿では、積型を追加します。本格的なプログラミング言語では、積は struct、record、tuple などでも呼ばれています。

型を複数取り、一個の型に重ねることができるのは積です。例えば、関数から複数の値を戻したければ、積は使えます。

まず、他の型を一切含まぬ積型を紹介します。それはよく「単位」（unit）と言います。この型には値が一つあるので、$\mathbf{1}$で表記します。その値も「単位」と呼び、$\langle \rangle$で表記します。

次は型を二つ重ねる「ペア」という積型です。$\tau_1$と$\tau_2$は型だとしたら、$\tau_1 \times \tau_2$はそれらを合わせるペア型です。そして、$e_1$の型が$\tau_1$で$e_2$の型が$\tau_2$だとすれば、$\langle e_1, e_2 \rangle$は$\tau_1 \times \tau_2$の型のあるペア定数です。

ペアを使用する為、中身の値を抽出せねば。その為$e.\mathsf{L}$と$e.\mathsf{R}$の式も追加します。$e$はペアであれば、この式は左と右の値をペアから抽出します。

ペアを使い他のペアを合わせることによって、二個の型以上の積を作り上げられます。

## 語源

積型は何ゆえそう呼ばれているかと聞くと、型の値の数が原因です。積型にある型の値の数をかければ、積型の値の数になります。

例えば$\mathtt{Bool}$には値が二つあります。$\mathtt{true}$と$\mathtt{false}$。

では$\mathtt{Bool} \times \mathtt{Bool}$という型には値がいくつありますか。それは四つ。

1. $\langle \mathtt{true}, \mathtt{true} \rangle$
1. $\langle \mathtt{true}, \mathtt{false} \rangle$
1. $\langle \mathtt{false}, \mathtt{true} \rangle$
1. $\langle \mathtt{false}, \mathtt{false} \rangle$

$\mathtt{Bool} \times \mathbf{1}$も見ましょう。$\mathtt{Bool}$と同じく、値が二つあります。

1. $\langle \mathtt{true}, \langle \rangle \rangle$
1. $\langle \mathtt{false}, \langle \rangle \rangle$

ですから単位の型を$\mathbf{1}$で書くのは妥当です。単位の型である$\mathbf{1}$は、積型の$\times$の単位元です。

整数なら、任意の整数$a$を取れば、

$$a \times 1 = a$$

ここでは$\times$は掛け算。

同様に、$|\tau|$というのを「$\tau$の値の数」という意味を付け、任意な型$\tau$を取れば、

$$|\tau \times \mathbf{1}| = |\tau|$$

ここでは$\times$は積型。

もっと全般的に言えば、

$$|\tau_1 \times \tau_2| = |\tau_1| \times |\tau_2|$$

ここで左側の$\times$は積型で、右は掛け算を表します。

## 構文規則

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \mathbf{1}
\\ | \ & \tau_1 \times \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & \langle \rangle
\\ | \ & \langle e_1, e_2 \rangle
\\ | \ & e.\mathsf{L}
\\ | \ & e.\mathsf{R}
\end{aligned}
$$

## 静的意味論

単位の値の型は単位です。

$$
\frac
  {}
  {\Gamma \vdash \langle \rangle: \mathbf{1}}
$$

式が二つあって、それぞれには型があれば、ペアを作り出せます。

$$
\frac
  {
    \Gamma \vdash e_1: \tau_1 \hspace{1em}
    \Gamma \vdash e_2: \tau_2
  }
  {\Gamma \vdash \langle e_1, e_2 \rangle: \tau_1 \times \tau_2}
$$

左側か右側を抽出できます。

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e.\mathsf{L}: \tau_1}
$$

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e.\mathsf{R}: \tau_2}
$$

## 動的意味論

単位は値。

$$
\frac
  {}
  {\langle \rangle \ \mathsf{val}}
$$

中の式が両方値である場合、ペアも値。

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \ \mathsf{val}
  }
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
$$

左側の式が踏み出せれば、ペアもできます。

$$
\frac
  {e_1 \mapsto e_1'}
  {\langle e_1, e_2 \rangle \mapsto \langle e_1', e_2 \rangle}
$$

左側は値ですけれど、右側は踏み出せれば、ペアもできます。

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \mapsto e_2'
  }
  {\langle e_1, e_2 \rangle \mapsto \langle e_1, e_2' \rangle}
$$

抽出の式は、まずペアを値にします。次、値である時にはペア定数になっていますから、それの左側か右側の式に踏み出します。

$$
\frac
  {e \mapsto e'}
  {e.\mathsf{L} \mapsto e'.\mathsf{L}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle.\mathsf{L} \mapsto e_1}
$$

$$
\frac
  {e \mapsto e'}
  {e.\mathsf{R} \mapsto e'.\mathsf{R}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle.\mathsf{R} \mapsto e_2}
$$

## 助手

助手判断も機械的に更改します。

### 置き換え

$$
\frac
  {}
  {[x \mapsto e] \langle \rangle = \langle \rangle}
$$

$$
\frac
  {
    [x \mapsto e] e_1 = e_1' \hspace{1em}
    [x \mapsto e] e_2 = e_2'
  }
  {[x \mapsto e] \langle e_1, e_2 \rangle = \langle e_1', e_2' \rangle}
$$

$$
\frac
  {[x \mapsto e] e_1 = e_1'}
  {[x \mapsto e] e_1.\mathsf{L} = e_1'.\mathsf{L}}
$$

$$
\frac
  {[x \mapsto e] e_1 = e_1'}
  {[x \mapsto e] e_1.\mathsf{R} = e_1'.\mathsf{R}}
$$

### 自由変数

$$
\frac
  {}
  {\mathsf{fv}(\langle \rangle) = \emptyset}
$$

$$
\frac
  {
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2
  }
  {\mathsf{fv}(\langle e_1, e_2 \rangle) = s_1 \cup s_2}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(e.\mathsf{L}) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(e.\mathsf{R}) = s}
$$

## 結論

定理の証明もまた[GitHub][proofs]にあります。

次の投稿では和型を追加します。

[prev]: /ja/posts/define-pl-02/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-03
