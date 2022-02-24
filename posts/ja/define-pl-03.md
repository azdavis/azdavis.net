---
title: "プログラミング言語を定義する：積"
date: 2021-06-05
---

[前の投稿][prev]では、発言に関数を追加しました。

この投稿では、積型を追加します。本格的なプログラミング言語では、積は struct、record、tuple などでも呼ばれています。

型を複数取り、一個の型に重ねることができるのは積です。例えば、関数から複数の値を戻したければ、積は使えます。

## 構文規則

型を二つ重ねる積型は「ペア」といって、$\tau_1 \times \tau_2$で表記します。$\langle e_1, e_2 \rangle$はペア定数の式です。

ペアを使い他のペアを合わせることによって、二個の型以上の積を作り上げられます。

ペアを使用する為、中身の値を抽出せねば。その為$e \cdot \mathsf{L}$と$e \cdot \mathsf{R}$の射影式も追加します。$e$はペアであれば、この式は左と右の値をペアから射影します。

次、他の型を一切含まぬ積型を紹介します。この型を「単位」（unit）と呼び、$\mathsf{1}$で表記します。値が一つだけあるので、その値も「単位」と呼び、$\langle \rangle$で表記します。

値が一つしかないから、単位型はあまり役立たないと思われるかもしれません。しかし、関数から何も戻したくなかったら役立てます。

例えば、多くのプログラミング言語では、関数は副作用を実行できます。副作用というのは、値を戻す以外のこと、例えばファイルを変更したりインターネットに繋がったりすることを言います。

実は、或る関数は副作用の為だけに使われ、面白い値を戻す必要などありません。この場合、単位を戻すのが便利です。

違う言語は単位を他の名前で表します：

- C, C++, Java には`void`
- Python には`None`
- JavaScript には`undefined`
- Ruby には`nil`

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \mathsf{1}
\\ | \ & \tau_1 \times \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & \langle \rangle
\\ | \ & \langle e_1, e_2 \rangle
\\ | \ & e \cdot \mathsf{L}
\\ | \ & e \cdot \mathsf{R}
\end{aligned}
$$

## 静的意味論

単位の値の型は単位です。

$$
\frac
  {}
  {\Gamma \vdash \langle \rangle: \mathsf{1}}
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

左側か右側を射影できます。

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e \cdot \mathsf{L}: \tau_1}
$$

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e \cdot \mathsf{R}: \tau_2}
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

射影式は、まずペアを値にします。次、値である時にはペア定数になっていますから、それの左側か右側の式に踏み出します。

$$
\frac
  {e \mapsto e'}
  {e \cdot \mathsf{L} \mapsto e' \cdot \mathsf{L}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle \cdot \mathsf{L} \mapsto e_1}
$$

$$
\frac
  {e \mapsto e'}
  {e \cdot \mathsf{R} \mapsto e' \cdot \mathsf{R}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle \cdot \mathsf{R} \mapsto e_2}
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
  {[x \mapsto e] e_1 \cdot \mathsf{L} = e_1' \cdot \mathsf{L}}
$$

$$
\frac
  {[x \mapsto e] e_1 = e_1'}
  {[x \mapsto e] e_1 \cdot \mathsf{R} = e_1' \cdot \mathsf{R}}
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
  {\mathsf{fv}(e \cdot \mathsf{L}) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(e \cdot \mathsf{R}) = s}
$$

## 語源

結論する前、「積」の語源を考えましょう。

積型は何ゆえそう呼ばれているかと聞くと、型の値の数が原因です。積型にある型の値の数をかければ、積型の値の数になります。

例えば$\mathsf{Bool}$には値が二つあります。$\mathsf{true}$と$\mathsf{false}$。

では$\mathsf{Bool} \times \mathsf{Bool}$という型には値がいくつありますか。それは四つ。

1. $\langle \mathsf{true}, \mathsf{true} \rangle$
1. $\langle \mathsf{true}, \mathsf{false} \rangle$
1. $\langle \mathsf{false}, \mathsf{true} \rangle$
1. $\langle \mathsf{false}, \mathsf{false} \rangle$

$\mathsf{Bool} \times \mathsf{1}$も見ましょう。$\mathsf{Bool}$と同じく、値が二つあります。

1. $\langle \mathsf{true}, \langle \rangle \rangle$
1. $\langle \mathsf{false}, \langle \rangle \rangle$

ですから単位の型を$\mathsf{1}$で書くのは妥当です。単位の型である$\mathsf{1}$は、積型の$\times$の単位元です。

整数なら、任意の整数$a$を取れば、

$$a \times 1 = a$$

ここでは$\times$は掛け算。

同様に、$|\tau|$というのを「$\tau$の値の数」という意味を付け、任意な型$\tau$を取れば、

$$|\tau \times \mathsf{1}| = |\tau|$$

ここでは$\times$は積型。

もっと全般的に言えば、

$$|\tau_1 \times \tau_2| = |\tau_1| \times |\tau_2|$$

ここで左側の$\times$は積型で、右は掛け算を表します。

## 結論

定理の証明もまた[GitHub][proofs]にあります。

[次の投稿][next]では和型を追加します。

[prev]: /ja/posts/define-pl-02/
[next]: /ja/posts/define-pl-04/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-03
