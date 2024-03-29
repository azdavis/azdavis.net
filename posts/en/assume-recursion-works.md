---
title: Assume recursion works
date: 2022-10-02
desc: A way to think about writing recursive functions.
---

When writing a recursive function, we may assume that if we make a recursive call on a "smaller" argument, then the call will return to us the correct answer.

The reason why it is okay to do this is because recursion corresponds to induction. That is, "assume the recursive call just works" is not informal hand-waving, it is the **inductive hypothesis**. Further, it is known that if you give something a fancy math name, it is Correct™.

The rest of this post is basically just expounding on the above at length.

## Background

To permit repeated execution of part of a program, most modern languages allow for [either][unrecur-post]:

- **Iteration**, via loops like `while` or `for`.
- **Recursion**, via recursive function definitions.

In e.g. Python, we can implement a function that sums up a list of numbers in either style:

```py
def sum_iter(nums):
    ret = 0
    # iterative loop
    for num in nums:
        ret += num
    return ret

def sum_rec(nums):
    # base case
    if len(nums) == 0:
        return 0
    # recursive call
    return nums[0] + sum_rec(nums[1:])
```

However, many programmers often prefer iteration over recursion, for various reasons:

- The usual implementation of iteration is more [efficient][stack-overflow] than recursion.
- Iteration does not require defining and naming a separate function.
- Safety-critical environments often [restrict or ban recursion outright][nasa].

Indeed, most Python programmers (after pointing out the fact that `sum` is in the standard library) would probably approach this problem iteratively.

## A larger dichotomy

Iteration vs recursion is but one aspect of a more general division between programming paradigms: imperative vs functional, respectively.

Though some programming languages have a mix of imperative and functional features, often, the mix tends to be mostly or entirely in favor of imperative features. This, too, is a likely reason why many prefer iteration: idiomatic programs in many languages are imperative, and iteration is imperative.

Languages with mostly or only imperative features are called imperative programming languages. By contrast, so-called functional programming languages emphasize a functional style over an imperative one, and thus favor recursion over iteration for repeated execution. In fact, some languages, like Haskell, do not have built-in looping constructs at all.

## A strange style

A [modern programmer][reddit] can make it quite far with only iteration, and minimal or no recursion:

> I've been programming for nearly 4 years, work in the field, and almost have my CS degree yet for the life of me I can't understand the point of recursion.

Because of this, when a programmer used to iteration first encounters recursion, [they][codecademy] may find it strange and alien:

> Is recursion really something I need to know? Should I keep banging my head against walls of examples until I get it, or is it so rarely used in the real world that I can forget about it? It sounds like for just about everything I’d ever need, I could just use a 'while' loop, which I find infinitely easier to understand.

Indeed, when I was a teaching assistant for an [introductory level functional programming class][150], taught in [Standard ML][millet] (SML), I saw many students commonly struggle to understand "the functional style", a big part of which is recursion.

In SML, we would sum up a list of numbers with recursion:

```sml
fun sum nums =
  case nums of
    nil => 0
  | x :: r => x + sum r
```

To try to grok how the recursion works, students will often try tracing out an example call of a recursive function. However, even when applying a relatively simple function, such as `sum`, to a relatively small argument, such as `[1, 3, 5]`, these traces can quickly get rather large:

```sml
  sum [1, 3, 5]
= case [1, 3, 5] of nil => 0 | x :: r => x + sum r
= 1 + sum [3, 5]
= 1 + (case [3, 5] of nil => 0 | x :: r => x + sum r)
= 1 + (3 + (sum [5]))
= 1 + (3 + (case [5] of nil => 0 | x :: r => x + sum r))
= 1 + (3 + (5 + (sum [])))
= 1 + (3 + (5 + (case [] of nil => 0 | x :: r => x + sum r)))
= 1 + (3 + (5 + (0)))
= 1 + (3 + (5))
= 1 + (8)
= 9
```

Now, writing out these traces can be useful for convincing oneself that a recursive function, as written, really does work. However, I claim that thinking in terms of **how** the recursion works is less helpful when actually **writing** the function.

My advice is to instead assume:

- **If** we recursively call the function on a smaller argument,
- **then** the call will return the correct result

when writing a recursive function.

## A bold assumption

This may seem unsatisfying, and perhaps even suspicious. Usually, if you ask someone how something works, and they respond with "just trust that it works, don't try to understand it further", that's a sign that they either:

- are trying to scam you, or
- don't understand it themselves.

However, in this case, there's a well-founded reason why we **can** just "trust the recursion works": there is a direct [correspondence][curry-howard] between recursion and mathematical induction. A [constructive] mathematician, like my past professor [Robert Harper][bob], might say that there is less of a "correspondence" and more of a "tautology", but I digress.

## A recursive definition

In mathematics, induction is usually introduced as a way to prove things about the natural numbers.

The natural numbers are:

$$0, 1, 2, 3, 4, \dots$$

But note that the usage of "$\dots$" is ambiguous. There are in fact [many sequences][oeis] that start with $0, 1, 2, 3, 4$ other than the likely obvious one.

To make this more precise, we can define the natural numbers recursively:

- $0$ is a natural number.
- If $k$ is a natural number, then $k + 1$ is a natural number.

This is slightly hand-wavey, since it requires that already have the "$+$" operation, but this is the general idea.

Note, now, in the definition of natural numbers, in the second point, we say "If $k$ is a natural number, then ...". This is why the definition is recursive: we are defining the statement "$n$ is a natural number" by referring to itself in its own definition. We state that **if** we already have some natural number $k$, **then** something else, i.e. $k + 1$, is a natural number as well.

This two-line definition is [pretty much][peano] all you need to define the natural numbers.

## An inductive principle

Suppose we have some statement $P(n)$ about an arbitrary natural number $n$. For instance, $P(n)$ could be the statement:

- $n + 0 = n$, which is true for every natural number.
- $n \times 2 > n$, which is true for every natural number except $0$.
- $n = 4$, which is false for every natural number except $4$.

We can think of $P$ as a function that maps every natural number $n$ to a statement about that natural number $n$. We now want to prove that, no matter what natural number $n$ we plug into $P$, we will get a true statement out.

The idea of induction is that if we want to prove $P(n)$ is true for every natural number, then it is sufficient to prove that $P$ "respects" the recursive definition of the natural numbers.

More formally, the principle of induction on the natural numbers is: Given some statement $P$ about natural numbers, **if** we prove the following two things:

- $P(0)$ holds.
- If $k$ is a natural number, and $P(k)$ holds, then $P(k + 1)$ holds.

**Then** we have proven that for all natural numbers $n$, $P(n)$ holds.

## A striking similarity

Note how the definition of "natural number" itself **strongly** mirrors the definition of induction on those natural numbers.

Indeed, in general, when we have **any** recursively defined structure, there is a corresponding "principle of induction" for that structure that mirrors the definition of the structure itself.

This is important! It's also why I said that induction is "introduced" as something for the natural numbers only. Really, induction is applicable to any recursive structure.

This idea, that we can generalize induction past just the natural numbers and apply it to arbitrary recursive structures, is called "structural induction".

## A succinct `datatype`

Just as with natural numbers, we can define lists recursively:

- $\textsf{nil}$ is a list.
- If $x$ is a value, and $r$ is a list, then $x :: r$ is a list.

This is actually quite similar to the recursive definition of the natural numbers. The biggest difference is that in the recursive case, instead of adding 1 to the natural number to get a new natural number, we are "adding" the value $x$ to the front of the list to get a new list.

We could, in fact, "recover" the natural numbers from lists by ignoring the values in the list, and just caring about the length of the list. (That is, `type nat = unit list`.)

In SML, the built-in list type is defined pretty much exactly as the above:

```sml
datatype 'a list =
  nil
| :: of 'a * 'a list

infixr 5 ::
```

Note that the business with `'a` is enforcing two things:

1. A list's element type can be any arbitrary type.
2. Given some arbitrary element type, every element of a list must have that type.

Note also that the `infixr` declaration following the `datatype` means that `::` (pronounced "cons") is a right-associative infix operator with precedence 5.

Finally, note that the built-in list literal syntax with `[]` and `,` is "syntax sugar" for the underlying list constructors.

This means that the following are all equivalent:

| Thing                               | Transformation      |
| ----------------------------------- | ------------------- |
| `[1, 3, 5]`                         | Original            |
| `1 :: 3 :: 5 :: nil`                | Desugar             |
| `1 :: (3 :: (5 :: nil))`            | Right associativity |
| `op:: (1, op:: (3, op:: (5, nil)))` | Un-infix with `op`  |

## Constructing the inducting

We have a recursive definition for lists, reproduced here:

> - $\textsf{nil}$ is a list.
> - If $x$ is a value, and $r$ is a list, then $x :: r$ is a list.

That means we have a corresponding principle of structural induction on lists, that directly "falls out" of the definition of lists. And here it is.

Given we have a statement $P$ about lists, **if** we prove:

- $P(\textsf{nil})$ holds.
- If $x$ is a value, and $r$ is a list, and $P(r)$ holds, then $P(x :: r)$ holds.

**Then** we have proven that for all lists $L$, $P(L)$ holds.

## The whole point

We now return to the `sum` example.

Suppose we are writing the `sum` function. The speciation of `sum` that our implementation must satisfy is this: For a given list of numbers `L`, `sum L` returns the sum of the numbers in `L`.

Put another way, we can express the specification as a proposition $P(L)$. We define $P(L)$ to be the statement "`sum L` returns the sum of all the numbers in `L`." Our goal now is to define `sum` such that for all $L$, $P(L)$ holds.

Okay. We know `sum` takes a list of numbers. So let's start with that, and call the list `L`.

```sml
fun sum L = ...
```

Now, we know `L` will be a list. We recall the definition of lists: there are two cases, `nil` and `::`. So let's write a case for each one.

```sml
fun sum L =
  case L of
    nil => ...
  | x :: r => ...
```

Starting with the `nil` case, we can just say that the "empty sum" is 0. Actually, it's less that we're "just saying" that, and more that 0 is the [identity][monoid] for $+$.

```sml
fun sum L =
  case L of
    nil => 0
  | x :: r => ...
```

This proves $P(\textsf{nil})$ holds. That's the base case of the proof.

We now turn to the recursive case.

We have `x` and `r` in scope. `r` is a list of numbers, one smaller than the original input, `L`. Only because `r` is smaller are we allowed to make a recursive call on it. If we had a list not smaller than `L` (like, for instance, `L` itself), we would not be allowed to recur on it, because then the recursion would not terminate. But it is, so it will, so we do.

```sml
fun sum L =
  case L of
    nil => 0
  | x :: r =>
      let
        val sum_r = sum r
      in
        ...
      end
```

Note that we have suggestively named the result of `sum r`. This is a callback to the first sentence of this post:

> When writing a recursive function, we may assume that if we make a recursive call on a "smaller" argument, then the call will return to us the correct answer.

So, **without** thinking about "how" `sum` continues to recur on `r` until it hits a (or rather, the) base case, we think to ourselves only this: `sum r` really is the sum of all the numbers in `r`, because that's what we said `sum` does.

We can be a bit more formal about this. Think about $P$, and the second part of the principle of induction for lists. The second part is the "recursive" part, which corresponds to the fact that we're in the recursive case of the `sum` function. It states:

> If $x$ is a value, and $r$ is a list, and $P(r)$ holds, then P($x :: r$) holds.

Remember, we are trying to define `sum` such that it satisfies its spec. That is, we are trying to prove that for all $L$, $P(L)$ holds. In this case $L = x :: r$.

So we have `x`, a value, and `r`, a list. We get to assume $P(r)$ holds, as the inductive hypothesis. That means (recall the definition of $P$) we assume `sum r` really is the sum of all the numbers in `r`. Now we must show $P(x :: r)$ holds. Which means we must finish the definition of `sum` so that `sum (x :: r)` is the sum of all the numbers in `x :: r`.

Okay, given the sum of `r`, which we now "somehow" have (remember: we do not care how we have it), how can we get the sum of `x :: r`?

Well, we need to add `x` to the sum of `r`. Okay, let's do that and return.

```sml
fun sum L =
  case L of
    nil => 0
  | x :: r =>
      let
        val sum_r = sum r
      in
        x + sum_r
      end
```

That `let` expression has only one binding, so we can just inline it.

```sml
fun sum L =
  case L of
    nil => 0
  | x :: r => x + sum r
```

We can rename the bound variable to make it match up with the original example, and make the function a little more self-documenting:

```sml
fun sum nums =
  case nums of
    nil => 0
  | x :: r => x + sum r
```

And there it is. QED.

[stack-overflow]: https://stackoverflow.com/a/3093
[nasa]: https://spinroot.com/gerard/pdf/P10.pdf
[reddit]: https://old.reddit.com/r/learnprogramming/comments/2by3vz/is_recursion_unnecessary/
[150]: http://www.cs.cmu.edu/~15150/
[millet]: /posts/millet/
[curry-howard]: https://en.wikipedia.org/wiki/Curry–Howard_correspondence
[constructive]: https://en.wikipedia.org/wiki/Constructivism_(philosophy_of_mathematics)
[bob]: https://existentialtype.wordpress.com
[oeis]: https://oeis.org/search?q=0%2C1%2C2%2C3%2C4
[peano]: https://en.wikipedia.org/wiki/Peano_axioms
[codecademy]: https://www.codecademy.com/forum_questions/4fd5964ffc052d000300483f
[monoid]: https://en.wikipedia.org/wiki/Monoid
[unrecur-post]: /posts/unrecur/
