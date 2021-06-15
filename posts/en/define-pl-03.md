---
title: "Defining a programming language: products"
date: 2021-06-05
---

In the [previous post][prev], we added functions to Hatsugen.

In this post, we'll add product types. These are often called "structs",
"records", or "tuples" in real programming languages.

We can use product types to combine multiple types into a single type. For
instance, if we want to return multiple values from a function, we can have the
function's return type be a product type.

## Syntax

First, we introduce a product type that contains no other types. We will call
this type "unit" and denote it with $\mathbf{1}$, because there is one value of
this type. This one value, also often called "unit", is written $\langle
\rangle$.

Next is a product type that combines two types, which we will call "pair" and
denote with $\tau_1 \times \tau_2$. Then, the expression $\langle e_1, e_2
\rangle$ is a pair literal expression.

To use a pair, we must be able to extract the values inside. For that, we add
the expressions $e.\mathsf{L}$ and $e.\mathsf{R}$. When $e$ is a pair, these
expressions extract the left and right value out of the pair respectively.

Note that by combining pair types with other pair types, we can effectively
construct an product type combining $n$ types for any $n > 2$.

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

We can then extract the left or right part out of the pair.

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

For the extractor expressions, we must first step the pair to a value. Then,
once it is a value, it will be a pair literal, and we may step to either the
left or right value in the pair.

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
  {[x \mapsto e] e_1.\mathsf{L} = e_1'.\mathsf{L}}
$$

$$
\frac
  {[x \mapsto e] e_1 = e_1'}
  {[x \mapsto e] e_1.\mathsf{R} = e_1'.\mathsf{R}}
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
  {\mathsf{fv}(e.\mathsf{L}) = s}
$$

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(e.\mathsf{R}) = s}
$$

## Etymology

Before we conclude, let us consider the etymology of "product type".

Product types are so named because the number of values in a product type is the
product of the number of values in the constituent types.

For instance, consider the type $\mathtt{Bool}$. It has 2 values,
$\mathtt{true}$ and $\mathtt{false}$.

Now consider the type $\mathtt{Bool} \times \mathtt{Bool}$. It has 4
values:

1. $\langle \mathtt{true}, \mathtt{true} \rangle$
1. $\langle \mathtt{true}, \mathtt{false} \rangle$
1. $\langle \mathtt{false}, \mathtt{true} \rangle$
1. $\langle \mathtt{false}, \mathtt{false} \rangle$

Consider also the type $\mathtt{Bool} \times \mathbf{1}$, the
product of $\mathtt{Bool}$ and unit. Like $\mathtt{Bool}$, it only has 2 values:

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

In the next post, we'll add sum types, also known as tagged unions.

[prev]: /posts/define-pl-02/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-03
