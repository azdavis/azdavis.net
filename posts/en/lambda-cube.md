---
title: "Terms, types, and functions"
date: 2021-10-04
---

Many programming languages have both terms and types. Terms are also sometimes
called expressions.

Roughly speaking, terms, like `is_zero(3)`, denote the data being manipulated,
while types, like `Int` or `Bool`, describe what operations are permitted on
terms.

For instance, if you have a term of type `Int`, you might be able to do things
like add or subtract with other `Int`s. And if you have a term of type `Bool`,
you could do things like negate it or use it to branch with an `if` construct.

Common in most programming languages are functions like `is_zero`, to which one
may pass a term and get back a term.

Given the existence of both types and terms, though, we can consider four
distinct varieties of function:

1. From terms to terms
1. From types to terms
1. From types to types
1. From terms to types

Let us examine each in detail, and how each is uniquely useful.

## Terms to terms

As mentioned, the most common variety of function is the one that allows takes a
term and returns a term, like `is_zero`.

## Types to terms

Consider the identity function, which is the function that returns its argument
unchanged.

The type of the identity function for integers is thus `Int -> Int`, and for
booleans it is `Bool -> Bool`.

The implementation of the identity function is identical for any choice of
parameter/return type: just return the term passed in. So, it would be
convenient if we could have a single identity function that would work for any
choice of type. This is sometimes called a generic function.

What we can do is allow the identity function to take a type argument. Let us
call it `T`. We then take a term argument whose type is `T` and return it.

The identity "function", then, is actually defined with two functions. First is
a function that takes a type `T` and then returns a term. That term is also a
function. It takes a term of type `T`, and then returns that term.

## Types to types

Commonly found alongside generic functions are generic types.

For instance, many programming languages provide a list data structure, which is
a ordered sequence of elements that can be dynamically added to and removed
from. Different programming languages call this data structure different things:
list, array, vector, sequence, and so on, but the general idea is the same.

We would like a list data structure to permit the elements stored to be any
fixed type. That is, instead of separately defining `IntList` and `BoolList` and
`PairOfIntAndStringList`, we would like to just define `List`, and have it work
for any element type.

Thus, `List` can be thought of as a function that takes a type (the type of
the elements) and returns a type (the type of lists of that element type).

## Terms to types

Some languages have a fixed-length array type. This is a type which is a bit
like a list, but its length is fixed, and thus part of the type itself.
Languages like C and Rust permit types like this.

For instance, in Rust, the definition

```rs
const A: [i32; 3] = [2, 4, 6];
```

defines `A` to be an array of 32-bit signed integers (`i32`) with a fixed length
of 3.

This is a limited form of allowing terms in types, since here, the term `3` is
used in the type `[i32; 3]`.

However, Rust rejects the following attempt at creating a function from a term
to a type:

```rs
fn zeroes(n: usize) -> [i32; n] {
  [0; n]
}
```

With the following errors:

```text
error[E0435]: attempt to use a non-constant value in a constant
 --> src/lib.rs:1:30
  |
1 | fn zeroes(n: usize) -> [i32; n] {
  |           -                  ^
  |           |
  |           this would need to be a `const`

error[E0435]: attempt to use a non-constant value in a constant
 --> src/lib.rs:2:7
  |
1 | fn zeroes(n: usize) -> [i32; n] {
  |           - this would need to be a `const`
2 |   [0; n]
  |       ^
```

We can take the Rust compiler's suggestion and make `n` a "const parameter" (and
also capitalize it, to conform to style guidelines):

```rs
fn zeroes<const N: usize>() -> [i32; N] {
  [0; N]
}
```

But now, because `N` is a const parameter, we can only pass values for it that
are known at compile time.

Types like `[i32; N]` that contain, or "depend on", terms, are called dependent
types. Not many programming languages fully support dependent types, likely due
to their incredible expressive power.

## The lambda cube

To reiterate, most programming languages have functions from terms to terms. The
three other varieties of functions are:

1. From types to terms
1. From types to types
1. From terms to types

A language may choose to allow or disallow these varieties of functions. There
are three yes-or-no choices to make, and thus $2^3 = 8$ possible configurations.

We may visualize the three choices as dimensions, and thus organize the
possibilities into a cube. The vertices of the cube represent languages that
arise from choosing combinations of allowing or disallowing the three varieties
of function. All points on the cube allow for term-to-term functions.

Some commonly-known points on the cube are:

- The simply typed lambda calculus, which only has term-term functions.
- System F, which has term-term and type-term functions.
- System F$\omega$, which has term-term, type-term, and type-type functions.
- The calculus of constructions, which has all four varieties of function.

Once we reach the calculus of constructions, the distinction between types and
terms somewhat disappears, since each may freely appear in both themselves and
the other. Indeed, as powerful as the CoC is, it has a very sparse syntax of
terms:

$$
\begin{aligned}
t
::=  \ & \mathsf{Prop} && \text{base type}
\\ | \ & \mathsf{Type} && \text{type of $\mathsf{Prop}$}
\\ | \ & x && \text{variables}
\\ | \ & t \ t' && \text{application}
\\ | \ & \lambda (x: t) \ t' && \text{lambda abstraction}
\\ | \ & \Pi (x: t) \ t' && \text{forall}
\end{aligned}
$$

There is no separate syntax for types in the CoC: all terms and types are
represented with just the above syntax.

I wrote up an [implementation][coc-rust] of the CoC in Rust for edification.

The calculus of constructions serves as the foundation for many
dependently-typed programming languages, like [Coq][coq]. Using the CoC as a
foundation, Coq is able to express and prove mathematical theorems like the
[four-color theorem][four-c].

It's rather remarkable to me that functions and variables, the most basic
realization of the concept of "abstraction", can be so powerful in allowing all
different types of language features. In the words of [jez][], on
[variables][var]:

> I think variables are just so cool!

And [functions][fun]:

> I think it's straight-up amazing that something so simple can at the same time
> be that powerful. Functions!

[coq]: https://coq.inria.fr
[coc-rust]: https://github.com/azdavis/coc
[four-c]: https://github.com/math-comp/fourcolor
[jez]: https://jez.io
[var]: https://blog.jez.io/variables-and-binding
[fun]: https://blog.jez.io/system-f-param