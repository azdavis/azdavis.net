---
title: "Defining a programming language: sums"
date: 2021-07-15
---

In the [previous post][prev], we added product type to Hatsugen.

In this post, we'll add sum types.

A sum type is a choice between different types. For instance, if we have a
function from which we would sometimes like to return one type, and sometimes
another, we can have the function return a sum type of those two types.

Or, suppose we wish to represent sometimes having a value of some type, and
sometimes having "nothing". We can use a sum type of the actual type and the
unit type, and use unit to mean "nothing".

Surprisingly, although many programming languages have product types, not as
many have sum types as we will present them here. But, many programming
languages that support a "functional" style, like Haskell, OCaml, Standard ML,
and Rust, do have sum types.

## Syntax

First we have the binary sum type, denoted with $\tau_1 + \tau_2$ and called
"either". As the name suggests, values of this type can either be from the left
type $\tau_1$ or the right type $\tau_2$.

However, the values must be "tagged" with whether they are the left or right
type. We add two new expressions, $\mathtt{L} \ e$ and $\mathtt{R} \ e$, to do
this tagging. These are sometimes called "injections".

The sum type that is a choice between no types is written $\mathbf{0}$ and
called "never", because we can never have a value of this type.

Although it may seem odd to have a type with no values, the never type can be
useful. For instance, imagine we added the ability to "exit" a Hatsugen program
with a special function. This is a common feature in programming languages:

- C/C++ has [`exit`][c-exit]
- Python has [`sys.exit`][py-exit]
- Java has [`System.exit`][java-exit]
- Rust has [`std::process::exit`][rs-exit]

Note that this function has the property that it never returns to the caller,
since calling it exits the program.

To communicate this, we can have the return type of this function be the never
type. When we see that a function returns the never type, we know that the
function will indeed never return. Since, if it returned, we would have produced
a value of type never, which is impossible.

Indeed, in [Sorbet][], the static type-checker for Ruby developed at [Stripe][],
the equivalent of the never type is called [`T.noreturn`][noreturn].

Finally, we add the ability to actually use a sum type with case expressions.
These case expressions must handle all of the possibilities that the value of
sum type could be.

For the either type, there are two cases: left or right. For the never type,
there are no cases to handle.

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \mathbf{0}
\\ | \ & \tau_1 + \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & \mathtt{L} \ e
\\ | \ & \mathtt{R} \ e
\\ | \ & \mathtt{case} \ e \ \{ \}
\\ | \ & \mathtt{case} \ e \ \{
    \mathtt{L} \ x_1 . e_1,
    \mathtt{R} \ x_2 . e_2
    \}
\end{aligned}
$$

## Statics

The left injection requires its argument be the left type in the either, but the
right type can be any type.

$$
\frac
  {\Gamma \vdash e: \tau_1}
  {\Gamma \vdash \mathtt{L} \ e: \tau_1 + \tau_2}
$$

Similar with the right injection.

$$
\frac
  {\Gamma \vdash e: \tau_2}
  {\Gamma \vdash \mathtt{R} \ e: \tau_1 + \tau_2}
$$

The empty case requires that its "head" be never type, but permits the result of
the case to be any type. This is because we know it is impossible to have a
value of never type, so if we achieved the impossible by producing a never, we
can do anything we want.

$$
\frac
  {\Gamma \vdash e: \mathbf{0}}
  {\Gamma \vdash \mathtt{case} \ e \ \{ \}: \tau}
$$

The either case requires its head be an either type. Then, each respective case
binds a variable with the contents of the head. These variables are allowed to
be used when evaluating the respective subexpressions for each case. Each of
these subexpressions must be the same type. Then, the whole case expression
evaluates to that type.

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
    \Gamma \vdash \mathtt{case} \ e \ \{
      \mathtt{L} \ x_1 . e_1,
      \mathtt{R} \ x_2 . e_2
    \}: \tau
  }
$$

## Dynamics

The left injection is a value if its argument is a value.

$$
\frac
  {e \ \mathsf{val}}
  {\mathtt{L} \ e \ \mathsf{val}}
$$

Same with the right.

$$
\frac
  {e \ \mathsf{val}}
  {\mathtt{R} \ e \ \mathsf{val}}
$$

If the left injection's argument steps, then the whole injection steps.

$$
\frac
  {e \mapsto e'}
  {\mathtt{L} \ e \mapsto \mathtt{L} \ e'}
$$

And same as the right.

$$
\frac
  {e \mapsto e'}
  {\mathtt{R} \ e \mapsto \mathtt{R} \ e'}
$$

If the empty case's head can step, so can the whole case.

$$
\frac
  {e \mapsto e'}
  {\mathtt{case} \ e \ \{ \} \mapsto \mathtt{case} \ e' \ \{ \}}
$$

And same with the binary case.

$$
\frac
  {e \mapsto e'}
  {
    \begin{aligned}
      & \mathtt{case} \ e \ \{
        \mathtt{L} \ x_1 . e_1,
        \mathtt{R} \ x_2 . e_2
      \}
      \mapsto \\
      & \mathtt{case} \ e' \ \{
        \mathtt{L} \ x_1 . e_1,
        \mathtt{R} \ x_2 . e_2
      \}
    \end{aligned}
  }
$$

When the binary case's head is a value, and it is the left injection, we extract
the argument, bind it to the left variable, and step into the left expression.

$$
\frac
  {
    \mathtt{L} \ e \ \mathsf{val} \hspace{1em}
    [x_1 \mapsto e] e_1 = e'
  }
  {
    \mathtt{case} \ \mathtt{L} \ e \ \{
      \mathtt{L} \ x_1 . e_1,
      \mathtt{R} \ x_2 . e_2
    \} \mapsto e'
  }
$$

And similarly with the right.

$$
\frac
  {
    \mathtt{R} \ e \ \mathsf{val} \hspace{1em}
    [x_2 \mapsto e] e_2 = e'
  }
  {
    \mathtt{case} \ \mathtt{R} \ e \ \{
      \mathtt{L} \ x_1 . e_1,
      \mathtt{R} \ x_2 . e_2
    \} \mapsto e'
  }
$$

## Helpers

Just as last time, updating the helper judgments is a mostly mechanical process.

### Substitution

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathtt{L} \ e = \mathtt{L} \ e'}
$$

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathtt{R} \ e = \mathtt{R} \ e'}
$$

$$
\frac
  {[x \mapsto e_x] e = e'}
  {[x \mapsto e_x] \mathtt{case} \ e \ \{\} = \mathtt{case} \ e' \ \{\}}
$$

For the binary case, we cheat a bit and re-use the definition of substitution
for function literals.

This is convenient since each of the two cases behave similarly to a function,
since they bind one variable and evaluate to one expression each. It also lets
us re-use the logic for function literals that handles checking whether the
bound variable shadows (aka is the same as) the variable to be substituted.

We write $\tau_1$ and $\tau_2$ for the type of the arguments on the functions we
construct, but it doesn't matter for the purposes of substitution.

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
    \\& \mathtt{case} \ e \ \{
        \mathtt{L} \ x_1 . e_1,
        \mathtt{R} \ x_2 . e_2
      \}
      = \\
      & \mathtt{case} \ e' \ \{
        \mathtt{L} \ x_1 . e_1',
        \mathtt{R} \ x_2 . e_2'
      \}
    \end{aligned}
  }
$$

### Free variables

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathtt{L} \ e) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathtt{R} \ e) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\mathtt{case} \ e \ \{\}) = s}
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
    \mathsf{fv}(&\mathtt{case} \ e \ \{
      \mathtt{L} \ x_1 . e_1,
      \mathtt{R} \ x_2 . e_2
    \})
    = \\
    & s \cup (s_1 \setminus \{ x_1 \}) \cup (s_2 \setminus \{ x_2 \})
    \end{aligned}
  }
$$

## Etymology

Sum types, similarly to product types, are so named because of how the number of
values in the sum or product type relates to the number of values in the other
types.

For instance, $|\mathtt{Bool} + \mathbf{1}| = 2 + 1 = 3$:

1. $\mathtt{L} \ \mathtt{true}$
1. $\mathtt{L} \ \mathtt{false}$
1. $\mathtt{R} \ \langle \rangle$

Indeed, $|\mathbf{0}| = 0$ and $|\tau_1 + \tau_2| = |\tau_1| + |\tau_2|$.

## Duality of sums and products

Sums and products are [duals][].

To construct a pair, one must provide a value of both types. Then, when using a
pair, one may get out either type.

To construct an either, one may provide a value of either type. Then, when using
an either, one must handle both types.

## Conclusion

The proofs are once again on [GitHub][proofs].

I'm not sure what the next post will be! We've added a fair few bit of features
to Hatsugen, so I'll think about what would be interesting to add next.

[prev]: /posts/define-pl-03
[proofs]: https://github.com/azdavis/hatsugen/tree/part-04
[sorbet]: https://sorbet.org
[stripe]: https://stripe.com
[noreturn]: https://sorbet.org/docs/noreturn
[duals]: https://en.wikipedia.org/wiki/Duality_(mathematics)
[c-exit]: https://pubs.opengroup.org/onlinepubs/9699919799/
[py-exit]: https://docs.python.org/3/library/sys.html#sys.exit
[java-exit]: https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#exit(int)
[rs-exit]: https://doc.rust-lang.org/stable/std/process/fn.exit.html
