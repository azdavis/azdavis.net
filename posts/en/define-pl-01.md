---
title: "Define a PL: integers and booleans"
date: 2021-03-31
---

In this series of posts, we will define a small programming language using
formal methods. We will also produce proofs about our definitions using the
[Lean theorem prover][lean].

## Introduction and motivation

There are many programming languages, but most do not have a formal definition.
The majority of programming languages are defined by their implementation.

### Definition by implementation

Given some programming language $L$, an implementation of $L$ is a program,
which takes the text of a program $p$ in the language $L$, and either produces
some result based on $p$, or rejects $p$ as invalid.

We could then say $p$ is a program in the language $L$ if the implementation of
$L$ produces output for $p$, that is, it does not reject $p$.

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

However, it is possible write a specification not just with words, but with
mathematics. Some examples of languages specified in this way are [Standard
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

For now, Hatsugen will just have integers and booleans.

We'll represent integers with integer literal expressions like $\mathtt{123}$ or
$\mathtt{-456}$ or $\mathtt{0}$. There are infinitely many integers, and thus
infinitely many such possible literals. Practical considerations like a maximum
integer size will be ignored for now.

We'll represent booleans with the literal expressions $\mathtt{true}$ and
$\mathtt{false}$.

As one extra bit, we'll also support a conditional expression

$$\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3$$

which will evaluate the condition $e_1$ and then

- if it's $\mathtt{true}$, evaluate $e_2$;
- if it's $\mathtt{false}$, evaluate $e_3$.

It's intentional that Hatsugen is a very small language, at least for now. This
will allow us to get comfortable with all the formal stuff without getting
bogged down with the complexity of Hatsugen itself.

## Syntax

We'll use a [BNF][bnf]-style grammar to describe the syntax of expressions in
Hatsugen.

Since there are infinitely many integers, and writing them all out would take
quite a while, we'll represent an arbitrary integer literal with $\overline{n}$.

$$
\begin{aligned}
e
::=  \ & \overline{n}
\\ | \ & \mathtt{true}
\\ | \ & \mathtt{false}
\\ | \ & \mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
\end{aligned}
$$

This says that an expression $e$ can either be an integer literal, a boolean
literal, or an conditional expression.

Note that the conditional expression contains other expressions: $e_1$, $e_2$,
and $e_3$.

## Dynamics

We now define how to evaluate an expression. This is called the dynamic
semantics. There are various ways to do this, but the one we'll use for Hatsugen
is often called "[structural operational semantics][struct-op-sem]".

To do this, we will define two judgments. To define these judgments, we will
write inference rules.

### Values: $e \ \mathsf{val}$

The first judgement is written $e \ \mathsf{val}$ and is read as "$e$ is a
value". A value is an expression that is "done" evaluating.

We first define that any integer literal is a value. We can express this
definition with an inference rule:

$$
\frac
  {}
  {\overline{n} \ \mathsf{val}}
$$

An inference rule looks like a big fraction, with the premises on top and the
single conclusion on the bottom. There are no premises for this rule, so the top
is empty.

We can also define that the boolean literals $\mathtt{true}$ and
$\mathtt{false}$ are values with two more rules.

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

In Hatsugen, these are the only expressions that are values. But what about
conditional expressions?

### Stepping: $e \mapsto e'$

For expressions which are not values, we must now define how to evaluate them.
The second dynamics judgement, $e \mapsto e'$, read as "$e$ steps to $e'$",
holds when the expression $e$ takes a single step to another expression, $e'$.

"Evaluating an expression" is thus defined as repeatedly stepping an expression
until it is a value.

In Hatsugen, the only expressions that can take a step are conditional
expressions. First, we define that a conditional expression can take a step if
its condition $e_1$ can take a step to $e_1'$. When it steps, we leave $e_2$ and
$e_3$ unchanged.

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

Now, we define what happens when $e_1$ is a value. If it is $\mathtt{true}$, we
step to $e_2$, ignoring $e_3$.

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{true} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \ \mapsto
    e_2
  }
$$

And if it was $\mathtt{false}$, we do the opposite and step to $e_3$, ignoring
$e_2$.

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{false} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3 \mapsto
    e_3
  }
$$

With that, we've defined the dynamic semantics.

But we immediately run into a problem.

## The problem

We earlier informally defined what it means to evaluate an expression:

> "Evaluating an expression" is... defined as repeatedly stepping an
> expression until it is a value.

However, under this definition, there exist expressions that cannot be
evaluated. For instance:

$$
\mathtt{if} \ \mathtt{1} \
  \mathtt{then} \ \mathtt{2} \
  \mathtt{else} \ \mathtt{3}
$$

This expression cannot take a step, because none of the rules for $e \mapsto e'$
apply. This is because we only defined how to take a step when $e_1$ was either
$\mathtt{true}$, $\mathtt{false}$, or able to take a step itself. We didn't
define what to do if $e_1$ is an integer literal.

Yet, this expression is also not a value, because none of the rules for $e \
\mathsf{val}$ apply. Thus, the expression is "stuck".

There are generally two things we can do here. One is to go back and add more
rules to the dynamics to define how to evaluate these kinds of expressions. For
instance, we could emulate C-like languages with the following rules:

$$
\frac
  {}
  {
    \mathtt{if} \ \mathtt{0} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
    \mapsto e_3
  }
$$

$$
\frac
  {\overline{n} \ne \mathtt{0}}
  {
    \mathtt{if} \ \overline{n} \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3
    \mapsto e_2
  }
$$

This treats $\mathtt{0}$ like $\mathtt{false}$ and any other integer like
$\mathtt{true}$.

The other thing we could do define a notion of a "valid" expression, and only
permit evaluation of these valid expressions. This is the approach we will use.

To define which expressions are valid, we will introduce a static semantics.

## Statics: $e: \tau$

The static semantics tell us which expressions are valid, and thus permitted to
evaluate.

First, we introduce the notion of a type. For now, we have only two: integer and
boolean.

$$
\begin{aligned}
\tau
::=  \ & \mathtt{Int}
\\ | \ & \mathtt{Bool}
\end{aligned}
$$

Next, we introduce another judgement, $e: \tau$, read "$e$ has type $\tau$" or
"the type of $e$ is $\tau$". This judgement defines what it means for an
expression to be valid: an expression $e$ is valid if there exists a type $\tau$
for which $e: \tau$ holds.

Now, we define $e: \tau$ by writing its rules, starting with rules for the
literals. Integers literals have integer type, and boolean literals have boolean
type.

$$
\frac
  {}
  {\overline{n}: \mathtt{Int}}
$$

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

For conditional expressions, we require that $e_1$ has boolean type. We also
require $e_2$ and $e_3$ have the same type (but that type could be any type).
Then we say the whole conditional expression has that type.

$$
\frac
  {
    e_1: \mathtt{Bool} \hspace{1em}
    e_2: \tau \hspace{1em}
    e_3: \tau
  }
  {\mathtt{if} \ e_1 \ \mathtt{then} \ e_2 \ \mathtt{else} \ e_3: \tau}
$$

Note that because $e_1$ must have boolean type, expressions like the previously
considered

$$
\mathtt{if} \ \mathtt{1} \
  \mathtt{then} \ \mathtt{2} \
  \mathtt{else} \ \mathtt{3}
$$

are now disallowed by the static semantics.

This completes the definition of the static semantics.

## Theorems

We can now state and prove theorems about Hatsugen.

The first crucial theorem is that of progress. Progress says that well-typed
expressions are either done evaluating or can keep evaluating.

More formally, progress states:

> For all $e$ and $\tau$, if $e: \tau$, then $e \ \mathsf{val}$ or there exists
> $e'$ such that $e \mapsto e'$.

Note that, before we introduced the static semantics, we had the problem of
certain expressions neither being values nor being able to step. Now that we
have the statics at our disposal, we can use them to strengthen the precondition
of the theorem so that it is provable.

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
[jp-resources]: /posts/japanese-resources/
[js-spec]: https://tc39.es/
[lean]: https://leanprover.github.io
[c-undefined]: https://www.yodaiken.com/2021/05/19/undefined-behavior-in-c-is-a-reading-error/
[pony-spec]: https://www.ponylang.io/media/papers/fast-cheap-with-proof.pdf
[sml-spec]: https://smlfamily.github.io/sml97-defn.pdf
[wasm-spec]: https://webassembly.github.io/spec/core/
[struct-op-sem]: https://www.youtube.com/watch?v=H40QE0_830Q
[proof]: https://github.com/azdavis/hatsugen/tree/part-01
[next]: /posts/define-pl-02/
