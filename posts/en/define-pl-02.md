---
title: "Define a PL: functions"
date: 2021-05-22
desc: Adding pure functions to a small PL.
---

In the [previous post][prev], we introduced Hatsugen, a small programming language with integer and boolean types.

In this post, we'll add functions to Hatsugen. With this addition, Hatsugen becomes approximately as powerful as the [simply-typed lambda calculus][stlc].

## Syntax

We update the expression syntax to add variables, function literals, and function application. We also update the type syntax to add function types.

For variables, we just write things like $x$ or $y$ or $x_1$ or $x'$. There are infinitely many variable names to choose from.

$\lambda (x: \tau) \ e$ is a function literal, taking one argument $x$ of type $\tau$ and evaluating $e$ when applied to an argument. $x$ may appear in the expression $e$.

$e_1(e_2)$ is an application expression, representing the application of the function $e_1$ to the argument $e_2$.

$\tau_1 \rightarrow \tau_2$ is the type of functions taking $\tau_1$ as input and returning $\tau_2$ as output.

$$
\begin{aligned}
\tau
::=  \ & \dots
\\ | \ & \tau_1 \rightarrow \tau_2
\\
\\
e
::=  \ & \dots
\\ | \ & x
\\ | \ & \lambda (x: \tau) \ e
\\ | \ & e_1(e_2)
\end{aligned}
$$

## Statics: $\Gamma \vdash e: \tau$

Consider the expression $\lambda (x: \mathsf{Int}) \ x$. It should have type $\mathsf{Int} \rightarrow \mathsf{Int}$.

The very similar expression $\lambda (x: \mathsf{Bool}) \ x$ should have type $\mathsf{Bool} \rightarrow \mathsf{Bool}$.

Notice that both of these example expressions contain the sub-expression $x$, as the body of the function. But in each, the type of $x$ is different: $\mathsf{Int}$ in the first and $\mathsf{Bool}$ in the second.

As this example illustrates, the type of variables is determined by how the variable is declared. This is the first time that the same expression (in this case $x$) can have a different type depending on the context.

We'll need to fundamentally change the structure of the static semantics to account for variables.

First, we'll need to formalize the notion of a context. We'll use $\Gamma$ to represent a context, which will just be a list of variable-type pairs.

A context can either be empty, or it can be an existing context augmented with a new variable-type pair.

$$
\begin{aligned}
\Gamma
::=  \ & \cdot
\\ | \ & \Gamma, x: \tau
\end{aligned}
$$

The old typing judgement was $e: \tau$, read "$e$ has type $\tau$". The new judgement is written $\Gamma \vdash e: \tau$, read "$\Gamma$ entails $e$ has type $\tau$".

We'll need to update all the statics rules from the first post. All of these rules just use the context without changing it.

$$
\frac
  {}
  {\Gamma \vdash \overline{n}: \mathsf{Int}}
$$

$$
\frac
  {}
  {\Gamma \vdash \mathsf{true}: \mathsf{Bool}}
$$

$$
\frac
  {}
  {\Gamma \vdash \mathsf{false}: \mathsf{Bool}}
$$

$$
\frac
  {
    \Gamma \vdash e_1: \mathsf{Bool} \hspace{1em}
    \Gamma \vdash e_2: \tau \hspace{1em}
    \Gamma \vdash e_3: \tau
  }
  {
    \Gamma \vdash
    \mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3: \tau
  }
$$

We can now add the typing rules for the new constructs.

For variables, we need to be able to look up the variable in question in the context to get its type. For that, we'll define a small helper judgement for context lookup, written $\Gamma(x) = \tau$.

$$
\frac
  {}
  {(\Gamma, x: \tau)(x) = \tau}
$$

$$
\frac
  {
    x \ne y \hspace{1em}
    \Gamma(x) = \tau
  }
  {(\Gamma, y: \tau')(x) = \tau}
$$

Note that these rules engender shadowing, which is where multiple variable-type pairs with the same variable exist in the context at once, but the one furthest to the right in the context determines the type of the variable under the context. For instance, using the rules we can derive

$$
(\cdot, x: \mathsf{Int}, x: \mathsf{Bool}, y: \mathsf{Int})(x) =
  \mathsf{Bool}
$$

We can now use this helper lookup judgement in the typing rule for variables.

$$
\frac
  {\Gamma(x) = \tau}
  {\Gamma \vdash x: \tau}
$$

For function literals, the type of the parameter is the input type, and the type of the function body is the output type.

However, the bound variable may appear in the function body. So we add the variable and its type to the context when determining the function body's type.

$$
\frac
  {\Gamma, x: \tau_1 \vdash e: \tau_2}
  {\Gamma \vdash \lambda (x: \tau_1) \ e: \tau_1 \rightarrow \tau_2}
$$

For application, the parameter and argument types must match.

$$
\frac
  {
    \Gamma \vdash e_1: \tau_1 \rightarrow \tau_2 \hspace{1em}
    \Gamma \vdash e_2: \tau_1
  }
  {\Gamma \vdash e_1(e_2): \tau_2}
$$

## Dynamics: $e \ \mathsf{val}$ and $e \mapsto e'$

Functions are values, regardless of whether the function body is a value:

$$
\frac
  {}
  {\lambda (x: \tau) \ e \ \mathsf{val}}
$$

For application expressions, we first step the function expression. Then, once it's a value, we step the argument to a value as well:

$$
\frac
  {e_1 \mapsto e_1'}
  {e_1(e_2) \mapsto e_1'(e_2)}
$$

$$
\frac
  {
    e_1 \ \mathsf{val} \hspace{1em}
    e_2 \mapsto e_2'
  }
  {e_1(e_2) \mapsto e_1(e_2')}
$$

Once both expressions are values, we can prove the first will be a function literal, since it had function type.

We will step into the body of the function, substituting all free occurrences of the variable bound by the function with the value of the argument. We write $[x \mapsto e_x] e = e'$ to mean "substituting all free occurrences of $x$ with $e_x$ in $e$ yields $e'$".

$$
\frac
  {
    e_2 \ \mathsf{val} \hspace{1em}
    [x \mapsto e_2] e = e'
  }
  {
    (\lambda (x: \tau) \ e) \ e_2 \mapsto e'
  }
$$

## Substitution: $[x \mapsto e_x] e = e'$

To define the dynamics for function application, we must now define substitution for expressions.

Substitution does nothing to integer and boolean literals:

$$
\frac
  {}
  {[x \mapsto e_x] \overline{n} = \overline{n}}
$$

$$
\frac
  {}
  {[x \mapsto e_x] \mathsf{true} = \mathsf{true}}
$$

$$
\frac
  {}
  {[x \mapsto e_x] \mathsf{false} = \mathsf{false}}
$$

For conditional and application expressions, we simply recurse on the sub-expressions:

$$
\frac
  {
    \begin{aligned}
      &[x \mapsto e_x] e_1 = e_1' \hspace{1em}
    \\&[x \mapsto e_x] e_2 = e_2' \hspace{1em}
    \\&[x \mapsto e_x] e_3 = e_3'
    \end{aligned}
  }
  {
    \begin{aligned}
      [x \mapsto e_x] &\mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3 =
    \\&\mathsf{if} \ e_1' \ \mathsf{then} \ e_2' \ \mathsf{else} \ e_3'
    \end{aligned}
  }
$$

$$
\frac
  {
    [x \mapsto e_x] e_1 = e_1' \hspace{1em}
    [x \mapsto e_x] e_2 = e_2'
  }
  {
    [x \mapsto e_x] e_1(e_2) =
    e_1'(e_2')
  }
$$

For variables, we case on whether the variable in the expression is the variable being substituted. If it is, we replace the variable with $e_x$. If not, we leave it alone.

$$
\frac
  {}
  {[x \mapsto e_x] x = e_x}
$$

$$
\frac
  {x \ne y}
  {[x \mapsto e_x] y = y}
$$

For function literals, we again case on whether the variables are the same. If they are, we leave the function literal untouched. This is consistent with how we treat variables with the same name in the context $\Gamma$.

$$
\frac
  {}
  {[x \mapsto e_x] \lambda (x: \tau) \ e = \lambda (x: \tau) \ e}
$$

For the case when the variables are different, we must take care to avoid variable capture. For example, if we define

$$
\frac
  {
    x \ne y \hspace{1em}
    [x \mapsto e_x] e = e'
  }
  {[x \mapsto e_x] \lambda (y: \tau) \ e = \lambda (y: \tau) \ e'}
$$

we can use the rules to prove that

$$[x \mapsto y] \lambda (y: \mathsf{Bool}) \ x = \lambda (y: \mathsf{Bool}) \ y$$

In this case, the variable $y$ has been captured by the binding for $y$ in the function literal.

To avoid this, we require that the variable bound by the function literal not appear free in $e_x$. We thus revise the rule, writing $\mathsf{fv}(e_x)$ to denote the free variables in $e_x$.

$$
\frac
  {
    x \ne y \hspace{1em}
    y \notin \mathsf{fv}(e_x) \hspace{1em}
    [x \mapsto e_x] e = e'
  }
  {[x \mapsto e_x] \lambda (y: \tau) \ e = \lambda (y: \tau) \ e'}
$$

## Free variables: $\mathsf{fv}(e)$

We must now define the free variables of an expression.

Integer and boolean literals have no free variables:

$$
\frac
  {}
  {\mathsf{fv}(\overline{n}) = \emptyset}
$$

$$
\frac
  {}
  {\mathsf{fv}(\mathsf{true}) = \emptyset}
$$

$$
\frac
  {}
  {\mathsf{fv}(\mathsf{false}) = \emptyset}
$$

For conditional and application expressions, we simply recurse and union:

$$
\frac
  {
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2 \hspace{1em}
    \mathsf{fv}(e_3) = s_3
  }
  {
    \mathsf{fv}(\mathsf{if} \ e_1 \ \mathsf{then} \ e_2 \ \mathsf{else} \ e_3) =
    s_1 \cup s_2 \cup s_3
  }
$$

$$
\frac
  {
    \mathsf{fv}(e_1) = s_1 \hspace{1em}
    \mathsf{fv}(e_2) = s_2
  }
  {
    \mathsf{fv}(e_1(e_2)) =
    s_1 \cup s_2
  }
$$

Variables alone are free:

$$
\frac
  {}
  {\mathsf{fv}(x) = \{ x \}}
$$

Function literals bind a single variable:

$$
\frac
  {\mathsf{fv}(e) = s}
  {\mathsf{fv}(\lambda (x: \tau) \ e) = s \setminus \{ x \}}
$$

## Theorems

Since the judgments have changed a bit, we'll need to restate the theorems slightly.

### Progress

> For all $\Gamma$ and $e$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$, then $e \ \mathsf{val}$ or there exists $e'$ such that $e \mapsto e'$.

We require that $e$ have no free variables at all. This will allow us to perform substitution as we evaluate.

To see why this is necessary, consider choosing $e$ to be

$$
(\lambda (x: \mathsf{Bool} \rightarrow \mathsf{Bool}) \ x) \
  (\lambda (y: \mathsf{Bool}) \ x)
$$

This expression has one free variable, $x$. According to the rules, this expression is neither a value nor can it step. This is because $x$ appears free in the argument but is bound by the function being applied.

The expression $x$ is an even smaller counterexample, since bare variables are neither values nor can they step. Variables are given meaning by substitution.

### Preservation

> For all $\Gamma$ and $e$ and $e'$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$ and $e \mapsto e'$, then $\Gamma \vdash e': \tau$ and $\mathsf{fv}(e') = \emptyset$.

Preservation not only preserves typing, but also the presence of free variables. This is important, since we need there to be no free variables in $e'$ in order to be able to feed $e'$ back into the progress theorem.

### Safety

Once again, taken together we have the following safety theorem:

> For all $\Gamma$ and $e$ and $\tau$, if $\Gamma \vdash e: \tau$ and $\mathsf{fv}(e) = \emptyset$, then $e \ \mathsf{val}$ or there exists $e'$ such that $e \mapsto e'$ and $\Gamma \vdash e': \tau$ and $\mathsf{fv}(e') = \emptyset$.

The proofs are once again on [GitHub][proofs].

In the [next post][next], we'll add product types, also known as structs or tuples.

[prev]: /posts/define-pl-01/
[next]: /posts/define-pl-03/
[proofs]: https://github.com/azdavis/hatsugen/tree/part-02
[stlc]: https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus
