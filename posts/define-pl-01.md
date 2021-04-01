---
title: Defining a programming language, part 1
date: 2021-03-31
---

In this series of posts, we will:

- Define a small programming language using formal methods
- Prove theorems about that language using the [Lean theorem prover][lean]

## Introduction and motivation

There are many programming languages: C, C++, Java, JavaScript, Rust, Go,
Python, Ruby, [Standard ML][sml], etc.

But how is it that we can say that these programming languages exist? Or, put
another way, what defines a programming language?

### Definition by implementation

One answer is that the definition of programming language is its implementation.
Given some programming language $L$, an implementation of $L$ is a program,
which takes as input the text of a program $p$ in the language $L$. Then, it
either directly interprets $p$, or it compiles $p$ into some kind of output.
This output can then be executed or otherwise used later.

The former type of implementation is aptly called an "interpreter", the latter a
"compiler".

It is undeniable that for a programming language to be useful, it must have an
implementation. Otherwise, it would be impossible to run any programs in that
language.

But what if a programming language has not one, but multiple implementations?
Which one of these implementations is the one that defines the programming
language? Must all other implementations copy the behavior of this "blessed"
implementation, bugs and all?

### Definition by specification

A fix for this problem is to write a specification for the programming language.
This spec is a text document written in some human language, often English.
Developers then use the spec as a reference when writing implementations of the
language.

Languages like C, C++, [Go][go-spec], and [JavaScript][js-spec] (technically
ECMAScript) are specified in this way.

### Specification with mathematics

However, it is possible to specify programming language not just with words, but
with mathematics. Some examples of languages specified in this way are [Standard
ML][sml-spec], [Pony][pony-spec], and [WebAssembly][wasm-spec].

Formally specifying a language in this way is not a trivial task, but the
benefits are real.

For one, a mathematical specification is completely unambiguous. This contrasts
with specifications written in human languages, which can be
[ambiguous][oxford-comma] and [hard to understand][legalese]. For instance: in
that last sentence, what is the thing that I am saying "can be ambiguous and
hard to understand"? Is it "specifications" or "human languages"?

Furthermore, using formal methods allows us to state and prove theorems about
the specification. This gives us a high degree of confidence that our
specification is free of bugs and mistakes.

Let us explore this method of specification by defining our own programming
language.

## Hatsugen, a small language

There's an excellent [series of blog posts][eldiro] about implementing a
programming language in Rust. As in that series, we'll name our language by
translating the English word "utterance" into some other human language. I'll
choose the target language to be Japanese, [given][jp-resources] my
[interests][jp-resume]. [Thus][jisho-utterance], we will call the language
"Hatsugen".

For now, Hatsugen will have only expressions and types. No statements, no
input/output, no side effects.

The expressions and types are extremely limited: just integers and booleans.

We'll represent integers with integer literals like $\mathtt{123}$ or
$\mathtt{-456}$ or $\mathtt{0}$. There are infinitely many integers, and thus
infinitely many such possible literals. Practical considerations like a maximum
integer size will be ignored for now.

We'll represent booleans with $\mathtt{true}$ and $\mathtt{false}$ literals.

As one extra bit, we'll also support a conditional expression

$$\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3$$

which will evaluate the condition $e_1$ and then

- if it's $\mathtt{true}$, evaluate $e_2$;
- if it's $\mathtt{false}$, evaluate $e_3$.

(We'll formalize all of this!)

It's intentional that Hatsugen is a very small language, at least for now. This
will allow us to get comfortable with all the formal stuff without getting
bogged down with the complexity of Hatsugen itself.

## Syntax

We'll use a [BNF][bnf]-style grammar to describe the abstract syntax of
expressions $e$ and types $\tau$ in Hatsugen.

Since there are infinitely many integers, and writing them all out would take
quite a while, we'll represent an arbitrary integer literal with $\overline{n}$.

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

## Statics: $e: \tau$

According to the grammar, the following is a valid Hatsugen expression:

$$
\mathtt{if} \ \mathtt{true} \
  \mathtt{then} \ \mathtt{456} \
  \mathtt{else} \ \mathtt{789}
$$

This should evaluate to $\mathtt{456}$.

But what about this expression?

$$
\mathtt{if} \ \mathtt{123} \
  \mathtt{then} \ \mathtt{456} \
  \mathtt{else} \ \mathtt{789}
$$

In the informal semantics for conditional expressions, we only considered
$\mathtt{true}$ or $\mathtt{false}$ as possibilities for the value of the
conditional. What should we do here?

One option is to be more permissive in the semantics for conditional
expressions. As in C-like languages, we could treat 0 as "falsy" and non-zero
integers as "truthy".

Our only other option is to declare certain expressions to be invalid, and
refuse to evaluate these invalid expressions. To precisely define the notion of
a "valid" expression, we will define a static semantics for Hatsugen.

The static semantics for Hatsugen consists of one judgement, $e: \tau$, read as
"$e$ has type $\tau$" or "$e$'s type is $\tau$. This judgement is a relation
between expressions $e$ and types $\tau$. An expression $e$ is thus valid
precisely when there exists a type $\tau$ such that $e: \tau$.

To define a judgment, we write its rules of inference. Our first inference rule
says that integer literals have integer type.

$$
\frac
  {}
  {\overline{n}: \mathtt{Int}}
$$

In general, inference rules look kind of like a big fraction, with all the
premises on the top and the single conclusion on the bottom. Since there aren't
any premises for this rule, there's nothing above the line.

Our next inference rules say that $\mathtt{true}$ and $\mathtt{false}$ have
boolean type.

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

Finally, our most interesting inference rule yet defines the static semantics
for conditional expressions. It says that if

- we have three arbitrary expressions $e_1$, $e_2$, and $e_3$,
- and if $e_1$ has boolean type,
- and if $e_2$ has type $\tau$ where $\tau$ is some type,
- and if $e_3$ also has that same type $\tau$,

then the whole conditional expression has type $\tau$.

We can express this more concisely with an inference rule:

$$
\frac
  {
    e_1: \mathtt{Bool} \hspace{1em}
    e_2: \tau \hspace{1em}
    e_3: \tau
  }
  {\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3: \tau}
$$

We see that all the premises for the rule are above the line. Since we have
multiple premises, we just separate them with a bit of space. Then the
conclusion, as usual, is below the line.

This completes the definition of the static semantics for Hatsugen.

## Dynamics

Now it's time to define the dynamic semantics, i.e. how to evaluate programs.
There are actually a handful of different ways to do this, but we're going to
define a [structural operational semantics][struct-op-sem] for Hatsugen.

To do this, we will define 2 judgments.

### Values: $e \ \mathsf{val}$

The first judgement, $e \ \mathsf{val}$, read as "$e$ is a value", holds when
$e$ is a value. Informally, a value is an expression that is done evaluating.

In Hatsugen, the values are integer and boolean literals.

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

### Stepping: $e \rightarrow e'$

Next, we define what expressions are not done evaluating, and furthermore, we
define how their evaluation progresses.

The second dynamics judgement, $e \rightarrow e'$, read as "$e$ steps to $e'$",
holds when the expression $e$ takes a step to another expression, $e'$.

In Hatsugen, the only expressions that can take a step are conditional
expressions.

First, we define that a conditional expression can take a step if its condition
$e_1$ can take a step to $e_1'$. This could happen if $e_1$ itself was another
conditional expression, for instance.

We say the whole conditional expression then steps. When it steps, we leave the
then-branch and else-branch expressions unchanged.

$$
\frac
  {e_1 \rightarrow e_1'}
  {
    \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \rightarrow
    \mathtt{if} \ e_1' \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
  }
$$

Now, we define what happens when the condition is done evaluating. Since the
statics said that the condition will be a boolean, we know it'll be either
$\mathtt{true}$ or $\mathtt{false}$. (We'll actually have to prove this later!)

So, if the condition was $\mathtt{true}$, we step to the then-expression.

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{true} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \ \rightarrow
    e_2
  }
$$

And if it was $\mathtt{false}$, we step to the else-expression.

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{false} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \rightarrow
    e_3
  }
$$

With that, we've defined the dynamic semantics for Hatsugen.

## Theorems

I said that using these formal systems lets us prove theorems. So let's state
some theorems, and then prove them! (Actually, we'll prove them in the next
post.)

The first crucial theorem is that of _progress_. Progress says that well-typed
expressions are either done evaluating or can keep evaluating.

More formally, progress states:

> For all $e$, if there exists $\tau$ such that $e: \tau$, then
> $e \ \mathsf{val}$ or there exists $e'$ such that $e \rightarrow e'$.

Next, we have _preservation_. Preservation states that well-typed expressions
that can keep evaluating preserve their types when evaluating.

Again, more formally:

> For all $e$, if there exist $e'$ and $\tau$ such that $e: \tau$ and
> $e \rightarrow e'$, then $e': \tau$.

Note that taken together, we get the following _safety_ theorem:

> For all $e$, if there exists $\tau$ such that $e: \tau$, then
> $e \ \mathsf{val}$ or there exists $e'$ such that $e \rightarrow e'$ and
> $e': \tau$.

Crucially, note that in the case where $e \rightarrow e'$, we also have that
$e': \tau$. This means that we can apply the safety theorem _again_ on $e'$.

Stay tuned for the next post in the series, in which we prove these theorems
with the Lean theorem prover.

[bnf]: https://en.wikipedia.org/wiki/Backus–Naur_form
[eldiro]: https://arzg.github.io/lang/
[go-spec]: https://golang.org/ref/spec
[jisho-utterance]: https://jisho.org/word/発言
[jp-resources]: https://azdavis.xyz/posts/japanese-resources/
[jp-resume]: https://azdavis.xyz/ja/
[js-spec]: https://tc39.es/
[lean]: https://leanprover.github.io
[legalese]: https://en.wikipedia.org/wiki/Legal_English
[oxford-comma]:
  https://www.cnn.com/2018/02/09/us/dairy-drivers-oxford-comma-case-settlement-trnd
[peano]: https://en.wikipedia.org/wiki/Peano_axioms
[pony-spec]: https://www.ponylang.io/media/papers/fast-cheap-with-proof.pdf
[sml-spec]: https://smlfamily.github.io/sml97-defn.pdf
[sml]: https://www.smlnj.org/
[wasm-spec]: https://webassembly.github.io/spec/core/
[struct-op-sem]: https://www.youtube.com/watch?v=H40QE0_830Q
