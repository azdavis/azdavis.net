---
title: "Define a PL: products"
date: 2021-06-05
---

In the [previous post][prev], we added functions to Hatsugen.

In this post, we'll add product types. These are often called "structs",
"records", or "tuples" in real programming languages.

A product type is a combination of multiple types. For instance, if we want to
return multiple values from a function, we can have the function's return type
be a product type.

## Syntax

A product type that combines two types is called "pair" and denoted with $\tau_1
\times \tau_2$. The expression $\langle e_1, e_2 \rangle$ is a pair literal
expression.

Note that by combining pair types with other pair types, we can effectively
construct an product type combining $n$ types for any $n > 2$.

To use a pair, we must be able to extract the values inside. For that, we add
the projection expressions $e \cdot \mathtt{L}$ and $e \cdot \mathtt{R}$. When
$e$ is a pair, these projections extract the left and right value out of the
pair respectively.

We will also introduce a product type that combines no other types, called
"unit" and denoted with $\mathbf{1}$. There is just 1 value of this type, also
often called "unit", and it is written $\langle \rangle$.

Because the unit type has only one value, it may not seem very useful. However,
it can be useful when you want to return "nothing" from a function.

For instance, in most programming languages, functions can perform side effects.
Side effects are anything the function does other than return a value, like
modify files or access the Internet.

In fact, sometimes functions are only useful because of the side effects they
perform, and they don't actually need to return anything useful. In these cases,
it is convenient to have these functions return unit.

Different languages call unit different things:

- C, C++, Java has `void`
- Python has `None`
- JavaScript has `undefined`
- Ruby has `nil`

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
\\ | \ & e \cdot \mathtt{L}
\\ | \ & e \cdot \mathtt{R}
\end{aligned}
$$

## Statics

The unit value has unit type.

$$
\frac
  {}
  {\Gamma \vdash \langle \rangle: \mathbf{1}}
$$

Given two expressions each with their own type, we can make a pair of those
types by assembling the expressions together.

$$
\frac
  {
    \Gamma \vdash e_1: \tau_1 \hspace{1em}
    \Gamma \vdash e_2: \tau_2
  }
  {\Gamma \vdash \langle e_1, e_2 \rangle: \tau_1 \times \tau_2}
$$

We can then project the left or right part out of the pair.

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e \cdot \mathtt{L}: \tau_1}
$$

$$
\frac
  {\Gamma \vdash e: \tau_1 \times \tau_2}
  {\Gamma \vdash e \cdot \mathtt{R}: \tau_2}
$$

## Dynamics

The unit is a value.

$$
\frac
  {}
  {\langle \rangle \ \mathsf{val}}
$$

A pair is a value when both constituent expressions are values.

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \ \mathsf{val}
  }
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
$$

If the left expression in a pair can step, so can the entire pair.

$$
\frac
  {e_1 \mapsto e_1'}
  {\langle e_1, e_2 \rangle \mapsto \langle e_1', e_2 \rangle}
$$

After the left expression in a pair is a value, we may step the right expression
if possible.

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \mapsto e_2'
  }
  {\langle e_1, e_2 \rangle \mapsto \langle e_1, e_2' \rangle}
$$

For the projections, we must first step the pair to a value. Then, once it is a
value, it will be a pair literal, and we may step to either the left or right
value in the pair.

$$
\frac
  {e \mapsto e'}
  {e \cdot \mathtt{L} \mapsto e' \cdot \mathtt{L}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle \cdot \mathtt{L} \mapsto e_1}
$$

$$
\frac
  {e \mapsto e'}
  {e \cdot \mathtt{R} \mapsto e' \cdot \mathtt{R}}
$$

$$
\frac
  {\langle e_1, e_2 \rangle \ \mathsf{val}}
  {\langle e_1, e_2 \rangle \cdot \mathtt{R} \mapsto e_2}
$$

## Helpers

The helper judgments must also be updated. We can update them rather
mechanically.

### Substitution

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
  {[x \mapsto e] e_1 \cdot \mathtt{L} = e_1' \cdot \mathtt{L}}
$$

$$
\frac
  {[x \mapsto e] e_1 = e_1'}
  {[x \mapsto e] e_1 \cdot \mathtt{R} = e_1' \cdot \mathtt{R}}
$$

### Free variables

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
  {\mathsf{fv}(e \cdot \mathtt{L}) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(e \cdot \mathtt{R}) = s}
$$

## Etymology

Before we conclude, let us consider the etymology of "product type".

Product types are so named because the number of values in a product type is the
product of the number of values in the constituent types.

For instance, consider the type $\mathtt{Bool}$. It has 2 values,
$\mathtt{true}$ and $\mathtt{false}$.

Now consider the type $\mathtt{Bool} \times \mathtt{Bool}$. It has 4 values:

1. $\langle \mathtt{true}, \mathtt{true} \rangle$
1. $\langle \mathtt{true}, \mathtt{false} \rangle$
1. $\langle \mathtt{false}, \mathtt{true} \rangle$
1. $\langle \mathtt{false}, \mathtt{false} \rangle$

Consider also the type $\mathtt{Bool} \times \mathbf{1}$, the product of
$\mathtt{Bool}$ and unit. Like $\mathtt{Bool}$, it only has 2 values:

1. $\langle \mathtt{true}, \langle \rangle \rangle$
1. $\langle \mathtt{false}, \langle \rangle \rangle$

This is why it makes sense that the unit type is written $\mathbf{1}$. It is the
identity of the operation written $\times$.

For the integers, we have that for all integers $a$,

$$a \times 1 = a$$

where $\times$ denotes multiplication.

Then similarly, if we write $|\tau|$ to mean "the number of values in the type
$\tau$", we have that for all types $\tau$,

$$|\tau \times \mathbf{1}| = |\tau|$$

where $\times$ denotes a product type.

And more generally, for all types $\tau_1, \tau_2$, we have

$$|\tau_1 \times \tau_2| = |\tau_1| \times |\tau_2|$$

where on the left, $\times$ denotes a product type, and on the right, it denotes
multiplication.

## Conclusion

The proofs are once again on [GitHub][proofs].

In the [next post][next], we'll add sum types, also known as tagged unions.

[prev]: /posts/define-pl-02/
[next]: /posts/define-pl-04/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-03
