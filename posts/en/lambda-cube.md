---
title: "Terms, types, and functions"
date: 2021-10-04
---

Many programming languages have both terms and types. Terms are also sometimes
called expressions.

Terms, like `3` or `false`, denote the data being manipulated, while types, like
`Number` or `Boolean`, describe what operations are permitted on terms.

For instance, if you have a term of type `Number`, you might be able to do
things like add or subtract with other `Number`s. And if you have a term of type
`Boolean` (aka `true` or `false`), you could do things like negate it or use it
to branch with an `if` construct.

Many programming languages also have functions. For example, we could define
the function `is_zero`, which takes a term of type `Number` (like 3) and returns
a term of type `Boolean` (like `false`).

`is_zero` is a function from terms to terms. However, given the existence of
both types and terms, there are $2^2 = 4$ distinct varieties of function to
consider:

1. From terms to terms
2. From types to terms
3. From types to types
4. From terms to types

Let us examine some examples of each kind of function.

## Terms to terms

As mentioned, the most common kind of function is the one that takes a term
and returns a term, like `is_zero`.

For example, in Rust:

```rs
fn is_zero(n: u32) -> bool {
  n == 0
}
```

## Types to terms

Consider the identity function, which is the function that returns its argument
unchanged.

The implementation of the identity function is identical for any choice of
parameter/return type: just return the term passed in. So, it would be
convenient if, instead of having to define a "different" identity function for
every type, we could have a single identity function that would work for any
type. This is sometimes called a generic function.

What we can do is allow the identity function to take a type argument. Let us
call it `T`. We then take a term argument whose type is `T` and return it.

In a sense, then, the identity "function" is actually defined with two
functions. First is a function that takes a type `T` and then returns a term.
That term is also a function. It takes a term `x` of type `T`, and then returns
that term `x`.

In Rust, the identity function is:

```rs
fn identity<T>(x: T) -> T {
  x
}
```

## Types to types

Many programming languages provide a list type, which is a ordered sequence of
elements that can be dynamically added to and removed from. Different
programming languages call this type different things: list, array, vector,
sequence, and so on, but the general idea is the same.

We would like a list type to permit the elements stored to be any
fixed type. That is, instead of separately defining `NumberList` and
`BooleanList`, we would like to just define `List`, and have it work for any
element type. This is called a generic type.

But note that `List` itself is not a type. Rather, it is a function that takes a
type (the type of the elements) and returns a type (the type of lists of that
element type).

In Rust, the list type is called `Vec`. So, if `T` is a Rust type, then `Vec<T>`
is the type of a vector of `T`s.

## Terms to types

Some languages have a fixed-length array type. This is a type which is a bit
like a list, but its length is fixed, and thus part of the type itself.
Languages like C and Rust permit types like this.

For instance, in Rust, the definition

```rs
const A: [u32; 3] = [2, 4, 6];
```

defines `A` to be an array, with a fixed length of 3, of 32-bit unsigned
integers. Note that the term `3` appears in the type `[u32; 3]`.

As we've seen, Rust allows type-to-term and type-to-type functions via
generic type arguments. Rust also allows for term-to-type functions with a
feature called const generics:

```rs
type SquareMatrix<const N: usize> = [[u32; N]; N];
```

Here, `SquareMatrix` is a function from a term `N` of type `usize`, to the type
of square matrices with dimension `N` of unsigned 32-bit integers.

Types like `[u32; N]` that contain, or "depend on", terms, are called dependent
types. Not many programming languages fully support dependent types, likely due
to their [incredible expressive power][curry-howard].

Notably, Rust only permits using term-to-type functions when the terms are known
before the program actually runs (aka, `const`).

## The lambda cube

To reiterate, the four varieties of functions are:

1. From terms to terms
2. From types to terms
3. From types to types
4. From terms to types

Most languages have term-term functions, but choose to allow or disallow the
other three varieties of functions. There are three yes-or-no choices to make,
and thus $2^3 = 8$ possible configurations.

We may visualize the three choices as dimensions, and thus organize the
possibilities into a cube. The vertices of the cube represent languages that
arise from choosing combinations of allowing or disallowing the three varieties
of function. All vertices on the cube allow for term-to-term functions.

![The lambda cube](/img/lambda-cube.png)

Some commonly-known vertices on the cube are shown below. Columns 1-4 correspond
to the 4 varieties of function discussed.

|                        | Name                         | 1   | 2   | 3   | 4   |
| ---------------------- | ---------------------------- | --- | --- | --- | --- |
| $\lambda\!\rightarrow$ | Simply typed lambda calculus | ✓   | ×   | ×   | ×   |
| $\lambda 2$            | System $F$                   | ✓   | ✓   | ×   | ×   |
| $\lambda \omega$       | System $F\omega$             | ✓   | ✓   | ✓   | ×   |
| $\lambda C$            | Calculus of constructions    | ✓   | ✓   | ✓   | ✓   |

Once we reach the calculus of constructions (CoC), the distinction between types
and terms somewhat disappears, since each may freely appear in both themselves
and the other. Indeed, as powerful as the CoC is, it has a very sparse syntax of
terms, fully described by the following [context-free grammar][cfg]:

$$
\begin{aligned}
t
::=  \ & \mathsf{Prop} && \text{base type}
\\ | \ & \mathsf{Type} && \text{type of $\mathsf{Prop}$}
\\ | \ & x && \text{variable}
\\ | \ & t(t') && \text{application}
\\ | \ & \lambda (x: t) \ t' && \text{abstraction}
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
[curry-howard]: https://en.wikipedia.org/wiki/Curry–Howard_correspondence
[cfg]: https://en.wikipedia.org/wiki/Context-free_grammar
