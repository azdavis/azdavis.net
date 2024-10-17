---
title: rjsonnet
date: 2024-10-10
desc: A language server for Jsonnet.
---

We use [Jsonnet][] extensively at [Databricks][db]. There are various editor tools and plugins for Jsonnet, but I wanted to try making my own.

So I created [rjsonnet][], a Jsonnet language server in Rust. It is available as a [VS Code][vscode] extension.

## Features

It has the usual features you'd expect from a language server:

- Syntax highlighting
- Error tolerant parsing
- Inline errors and warnings
- Go-to-definition
- Standard library documentation
- Hover for info
- Auto-completions, via knowing what fields are on an object

Although Jsonnet does not have static types or type annotations, the language server does perform type inference. This powers some advanced features like auto-completions.

There is also a way to add simple "type annotations" to function parameters, without changing the syntax of Jsonnet. You add type assertions on the parameters to the beginning of your function, like this:

```text
local repeatedlyGreet(who, times) =
  assert std.isNumber(times);
  assert std.isString(who);
  "%s%s!" % [std.repeat("hello ", times), who];
```

This will be inferred to have type

```text
(who: string, times: number) => string
```

## Implementation

The implementation is generally broken up into a few distinct stages, which proceed one after the other.

It is important for any language server to be able to analyze code as the user is in the middle of writing it. Because of this, each stage is designed to work with syntactically malformed input and still always produce some partial output, instead of just erroring out and giving up.

### Lexing

The lexer, aka tokenizer, turns a file from a sequence of bytes into a sequence of tokens.

Tokenizing always produces a sequence of tokens which can be reassembled in order to reproduce the original file, byte-for-byte identical. To allow this, we have:

- An "error" token which represents invalid Jsonnet.
- Comment and whitespace tokens, collectively called "trivia", that are ignored during parsing.

### Parsing

The parser is also error tolerant. It parses files into an untyped concrete syntax tree. As in lexing, a file can be reproduced byte-for-byte identically from the concrete syntax tree.

### Desugaring

The concrete syntax tree is wrapped in a typed abstract syntax tree API so that it may then be lowered into a simpler representation, the "HIR", or high level intermediate representation.

During this transformation, certain constructs are rewritten in terms of other, more fundamental ones. Some examples:

| Complex             | Simple                       |
| ------------------- | ---------------------------- |
| `a && b`            | `if a then b else false`     |
| `a != b`            | `!(a == b)`                  |
| `local f(x) = e`    | `local f = function(x) e`    |
| `assert a : msg; b` | `if a then b else error msg` |

The HIR is represented approximately like this:

```rs
enum Expr {
  Bool(bool),
  Number(f64),
  If(ExprIdx, ExprIdx, ExprIdx),
  Fn(Vec<Param>, ExprIdx),
  ...
}

type ExprIdx = Option<u32>;
type ExprArena = Vec<Expr>;
```

We have a main enum representing all possible 'expressions' (`Expr`s). There is an enum case for each different kind of expression, like literals, `if`, `function`, `local`, `assert`, array comprehensions, etc.

We have an arena which is basically just a `Vec` of all the `Expr` enum we generate when desugaring the AST into HIR.

When expressions are recursive (i.e. contain sub-expressions), we use `ExprIdx`, which is either an index into the arena of expressions or `None`.

The index is optional because we must permit representing partially-formed documents. For instance, if we're in the middle of refactoring an `if` expression and we have:

```text
local func(x) =
  if   then else x + 1
//   ^ cursor here, just deleted the condition
```

We would represent that by having `None` for the conditional expression of the `if`.

Using an arena instead of allocating sub-expressions ad-hoc (e.g. with `Box` or `Rc`) improves cache locality and reduces memory fragmentation. As an added bonus, it also lets us use the expression indices as cheap IDs, e.g. when reporting what expression an error occurred on.

### Static analysis

We do static analysis on the files. This checks things like whether variables are in scope.

We also check the types of expressions, to some degree. We carry out a limited form of type inference; we do not infer constraints on function parameters as is done in a [Damas-Hindley-Milner type system][hm] like Haskell's or [Standard ML][millet]'s. Instead, function parameters are assumed to be of any type, but can be "annotated" with type assertions at the beginning of the function.

To check the types of expressions, we need to know the types of imported files. This means there is a dependency order between the files, and we must do static analysis of "leaf" files first before later files. This is unlike the previous stages, in which each file could be analyzed completely independently. which could all be done independently of other files.

## Performance

In addition to tolerating error states, a language server should be performant. It should quickly respond to user edits and still provide useful, up-to-date information, while using low CPU and memory.

The goal of high performance drove many key design decisions in the implementation.

### Interning

For important types whose values may be repeated multiple times during program analysis, we use a technique called "interning", where we store the unique values a constant number of times instead of re-allocating for each instance.

For instance, strings. Even if the same string occurs many times in the program text, we don't repeatedly allocate that same string each time. Instead we store that string in the string arena and hand out cheap indices into the arena (just an integer index).

We also intern static types. If multiple parts of the program are both inferred to have the same type, there will a shared allocation for the value representing that type.

### Parallelism

As noted before, some of the early stages of analysis on a file are totally independent. This includes lexing, parsing, and desugaring.

However, when we desugar, we carry out string interning. This requires us to mutate the string arena to add new strings as we see them. This is problematic, since now it's not true that the stages are completely independent.

We have two choices for what we can do to fix this.

The first choice is to desugar files in parallel, but have a single shared mutable string arena across the parallelized desugaring. This means we always have a single unified view of what the interned strings are, but it also means we have to put the string arena behind a mutex or read-write lock. Given that the string arena will experience high contention during desugaring, this would likely lead to poor performance.

The second choice is to desugar in parallel with no shared mutable string arena - instead have a separate arena for each desugaring. This means there is no contention, but it also leads to problem where the same string gets interned at different indices across different desugars.

For example, if we carry out desugaring (and thus string interning) on these two files in parallel, each with their own string arena:

```text
local a = "foo";
local b = "bar";
[a, b]
```

```text
local a = "bar";
local b = "foo";
[a, b]
```

Then, because we intern "foo" first in the first file and "bar" first in the second, we will assign different interning indices to each one.

We would like to have stuff be consistent. So we do merging.

We also do something similar for statics. However for that there is even more dependency between files because of imports.

We also have to make sure we do stuff in the right order when doing things in parallel. For that we use a topological sort and parallelize across the "levels" of this sort.

### Caching

We cache results of files between updates so that if the file doesn't change, we don't recompute its parse tree, static analysis information, etc.

### Delta updates

When a file updates, the language client (e.g. VSCode) is configured to send only the text of the file that updated, instead of the whole file.

[db]: https://www.databricks.com/
[jsonnet]: https://jsonnet.org/
[rjsonnet]: https://github.com/azdavis/rjsonnet
[vscode]: https://marketplace.visualstudio.com/items?itemName=azdavis.rjsonnet
[hm]: https://bernsteinbear.com/blog/type-inference/
[millet]: /posts/millet/
