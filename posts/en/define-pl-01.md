---
title: "Defining a programming language: Introduction, integers, and booleans"
date: 2021-03-31
---

In this series of posts, we will define a small programming language using
formal methods. We will also produce proofs about our definitions using the
[Lean theorem prover][lean].

## Introduction and motivation

There are many programming languages. Some have been around for years, some are
relatively new. Some are general-purpose, some are more domain-specific.

But what is a programming language? Or rather, what defines one?

### Definition by implementation

One answer is that the definition of programming language is its implementation.

Given some programming language $L$, an implementation of $L$ is a program,
which takes as input the text of a program $p$ in the language $L$, and either
produces as output some result based on $p$, or rejects $p$ as invalid.

We could then say a program $p$ is a program in the programming language $L$ if
the implementation of $L$ produces output for $p$, i.e. it does not reject $p$.

However, a programming language may have multiple implementations. And though
these implementations may strive for compatibility between one another, it
sometimes happens that different implementations behave differently given the
same program as input.

In such a case, which one of these implementations is _the_ one that defines the
programming language?

### Definition by specification

A fix for this problem is to write a specification for the programming language.
Developers then use the specification as a reference when writing
implementations of the language.

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
[ambiguous][c-undefined]. For instance: in that last sentence, what is the thing
that I am saying can be ambiguous? Is it specifications or human languages?

Furthermore, using formal methods allows us to state and prove theorems about
the specification. This gives us a high degree of confidence that our
specification is free of bugs and mistakes.

Let us explore this method of specification by defining our own programming
language.

## Hatsugen, a small language

First, we will give a name to our language.

There's an excellent [series of blog posts][eldiro] about implementing a
programming language. As in that series, we'll name our language by translating
the English word "utterance" into some other human language. I'll choose the
target language to be Japanese, given my [interests][jp-resources].
[Thus][jisho-utterance], we will call the language "Hatsugen".

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

We'll use a [BNF][bnf]-style grammar to describe the abstract syntax of types
$\tau$ and expressions $e$ in Hatsugen.

Since there are infinitely many integers, and writing them all out would take
quite a while, we'll represent an arbitrary integer literal with $\overline{n}$.

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
expressions. As in C and other languages, we could treat 0 like $\mathtt{false}$
and non-zero integers like $\mathtt{true}$.

Our only other option is to declare certain expressions to be invalid, and
refuse to evaluate these invalid expressions. To precisely define the notion of
a "valid" expression, we will define a static semantics for Hatsugen.

The static semantics for Hatsugen consists of one judgement, $e: \tau$, read as
"$e$ has type $\tau$" or "$e$'s type is $\tau$". This judgement is a relation
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

### Stepping: $e \mapsto e'$

Next, we define what expressions are not done evaluating, and furthermore, we
define how their evaluation progresses.

The second dynamics judgement, $e \mapsto e'$, read as "$e$ steps to $e'$",
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
  {e_1 \mapsto e_1'}
  {
    \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \mapsto
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
    \mathtt{if} \ \mathtt{true} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \ \mapsto
    e_2
  }
$$

And if it was $\mathtt{false}$, we step to the else-expression.

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{false} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \mapsto
    e_3
  }
$$

With that, we've defined the dynamic semantics for Hatsugen.

## Theorems

I said that using these formal systems lets us prove theorems. So let's state
some theorems, and then prove them!

The first crucial theorem is that of progress. Progress says that well-typed
expressions are either done evaluating or can keep evaluating.

More formally, progress states:

> For all $e$ and $\tau$, if $e: \tau$, then $e \ \mathsf{val}$ or there exists
> $e'$ such that $e \mapsto e'$.

Next, we have preservation. Preservation states that well-typed expressions that
can keep evaluating preserve their types when evaluating.

Again, more formally:

> For all $e$ and $e'$ and $\tau$, if $e: \tau$ and $e \mapsto e'$, then $e':
> \tau$.

Note that taken together, we get the following safety theorem:

> For all $e$ and $\tau$, if $e: \tau$, then $e \ \mathsf{val}$ or there exists
> $e'$ such that $e \mapsto e'$ and $e': \tau$.

Crucially, note that in the case where $e \mapsto e'$, we also have that
$e': \tau$. This means that we can apply the safety theorem again on $e'$.

The proofs are available on [GitHub][proof].

In the [next post][next], we'll add functions to Hatsugen.

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
[next]: /posts/define-pl-02
