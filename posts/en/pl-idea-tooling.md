---
title: "PL idea: built for tooling"
date: 2022-03-26
---

The tools and languages that developers use to craft software continue to
evolve. By thinking about these tools and how we use them, we can gain insight
into how to design new programming languages and extend existing ones.

## Language servers

When writing and debugging code, the usual flow goes something like this:

1. Write some code.
2. Compile and/or run the code.
3. If there were errors, return to step 1.

Notably, each step is separate from the rest. This can be frustrating, because
it means we have a feedback loop between writing code and learning whether the
code we wrote was correct.

More recently, [language servers][lang-srv] have improved the situation. They
analyze code as you write it, pointing out warnings and errors directly in your
text editor.

Language servers also allow developers to navigate and understand their codebase
more easily. They offer features like

- Jump to definition
- Code completion
- Inline documentation
- Type information

### Partial parses

To be effective, a language server [should be able to parse][parse-recovery] and
analyze code that is the middle of being written.

For instance, suppose we're writing some Rust, and we've typed this so far:

```rs
let mut xs = vec![2, 4, 7];
xs.
```

This is syntactically invalid Rust code. A conventional multi-phase compiler
would probably attempt to parse this code into an AST, fail, and exit.

However, a language server like [rust-analyzer][] strives to not only produce a
partial parse tree for this code, but also

- semantically analyze the (partial!) parse tree;
- note that `xs.` looks like the user is about to make a [method call][ufcs] on
  `xs`; and
- use the type of `xs` to offer method suggestions.

### Incremental updating

A conventional compiler runs like this:

1. Read in all the code.
2. Do stuff with the code. (lex, parse, analyze, etc.)
3. Exit.

Thus, a compiler is a relatively short-lived, stateless process. They're
sometimes described as really complicated, but ultimately pure, functions from
strings (the input code) to strings (the output compiled artifacts).

By contrast, a language server is a long-running, stateful process. It starts up
when you start up your text editor and keeps running as long as it's open. It
builds and maintains a semantic model of the codebase, updating the model in
response to your changes of the code.

To be [performant][lang-srv-perf], a language server should incrementally update
its semantic model, as opposed to recalculating it wholesale every time. For
instance, it would be unsustainable if, every time you changed a single
function's body, the language server had to re-typecheck the entire codebase.
This might work for an initial proof-of-concept on a small codebase, but for
large ones, the responsiveness of the language server would drop precipitously.

Certain choices in the design of the language can make it easier or harder to
implement an incrementally-updating language server for that language.

#### Rust: `impl` items in function bodies

Rust allows `impl` items to appear in function bodies. This means changing the
body of one function can affect whether the call site for another, different
function is well-typed.

```rs
struct Foo {}

fn bar() {
  impl Foo {
    fn quz() {}
  }
}

Foo::quz();
```

In this example, we must typecheck the body of `bar` to know that the call to
`quz` is well-typed.

#### Flow: Inferring types across module boundaries

[Flow][flow] used to infer types across module boundaries. So for instance, code
like this used to be allowed:

```ts
export const foo = Math.random();
```

The exported constant `foo` would be inferred to have type `number` when
imported by other modules.

However, this meant that changing the definition of any exported constants could
affect the type of those constants. Thus, Flow had to re-typecheck all the
modules that imported a constant every time that constant's definition changed.
This was a significant performance bottleneck.

So, Flow was [dramatically re-architected][types-first]. The new architecture is
called "types-first".

With the types-first architecture, we must explicitly annotate the types of all
exports:

```ts
export const foo: number = Math.random();
```

Now, Flow can use these annotations to first construct the type signature of a
module, then individually typecheck each module.

#### Ruby: Autoloading

Ruby code often uses an autoloader, which de-necessitates explicitly
`require`ing all the dependencies of a given file. The autoloader figures out
which files define what, and automatically requires them for you when needed.

This means a static typechecker for Ruby, like [Sorbet][sorbet], must track a
single massive interconnected graph of dependencies between files. Sorbet must
thus potentially re-typecheck dozens or hundreds of files in response to editing
a single file.

To encourage more explicit boundaries between logical areas of the codebase,
engineers at [Stripe][stripe] working on Sorbet have developed a package system
for use with Sorbet. This package system, now in use in production at Stripe,
will eventually allow Sorbet to typecheck individual packages, instead of the
whole codebase.

Sorbet could, for instance, note that a new module added in a package is not
exported to other packages. It can thus safely re-typecheck only files in the
package, not any of the other hundreds or thousands of unchanged packages.

### Takeaways

When designing a language, we can make explicit design choices in service of
offering a better language server for that language.

For instance, you could require type annotations on publicly exported items in
modules. Then your language server, too, can be architected like Flow's
types-first system.

For that matter, having a module system with explicit imports and exports in the
first place is important. Then you can isolate and analyze individual modules,
as Sorbet will eventually, instead of the entire codebase at once.

It may also be a good idea to structure your language's concrete syntax in such
a way that it is easy to recover from syntax errors. For instance, you might
choose to have each kind of declaration in your language begin with an explicit
keyword marking what kind of thing it is, like `func`, `type`, `struct`, `enum`,
`const`, `let`, etc. Then whenever the parser sees that keyword, it can begin to
try to parse that kind of thing.

For instance, given this incomplete Rust code, rust-analyzer is able to easily
recover and parse the second complete statement, because of the explicit `let`
keyword.

```rs
let x =
let y = foo();
```

It is additionally desirable to have these keywords always act like keywords.
That way, your language can avoid a situation where your language server has to
[break compatibility][parse-kw] with the true syntax of the language to improve
the editing experience.

## Auto-formatters

In addition to language servers, autoformatters like [Prettier][prettier] and
[rustfmt][] are good because they make code easier to both read and write.

All code that goes through the autoformatter shares a common style of spacing,
indentation and alignment. Thus, an author need not spend brain cycles worrying
about those such trivialities, and can focus on the logic of the code.

Nor, too, do code reviewers need to make nits about formatting when reviewing
code. Auto-formatting can just be part of the build: if the code requires no
formatting, it passes, else it fails and the code may not be merged in.

### Takeaways

Design a language's syntax so that the autoformatter can really go to town.

For instance, suppose your language uses whitespace for semantic meaning. The
autoformatter is then less able to change whitespace however it pleases, since
doing so could change the meaning of the code. This means when moving around
blocks of code during a refactor, or when pasting snippets of code from your
coworker or StackOverflow, you must correctly indent the code yourself.

By contrast, in a language where the block structure is explicitly noted with
delimiters like `{` and `}`, the formatter can take the fullest of liberties to
rewrite your code to be correctly indented.

Not to mention that many editors, even without language server support,
automatically insert the pairing closing `}` when you type `{` (and similarly
with `[]`, `()`, etc).

Additionally, it could be advantageous to be forgiving, to a degree, with your
language's syntax, since the autoformatter can take care of it. For instance,
you could allow trailing commas in list literals and things of that sort. The
autoformatter can then decide to add trailing commas if the literal spans many
lines, and not add them if it spans only one line.

Having a forgiving syntax also helps with cutting down on parse errors, which
makes your language easier to work with for a language server.

## Conclusion

I'd like to offer a few closing thoughts.

### Better for tooling, better for humans

When I say that we can design languages to work better with tooling, it may
sound like this is at the expense of making them harder for humans to work with.
And on a surface level, this might be true. For instance, it is more work for
the human to add type annotations to all exports as required by Flow's
types-first architecture.

However, I want to stress that ultimately, the goal is to make it easier for
humans to use the language. I believe that
[limitations engender opportunity][lim-op]: by adding some limitations to
languages so that they integrate better with tooling, we unlock the opportunity
to have surprisingly great tooling for those languages. Further, I believe the
increased quality of the tooling enabled by these design choices results in a
net gain for the developer.

### Inspired by a talk

Much of this article was inspired by a bunch of other things I've read and
watched. I've linked to the things I can find, but there's one thing in
particular, a talk by [Niko Matsakis][niko], about things like incremental
compilation in Rust, [salsa-rs][], and the Rust compiler query system that was
some inspiration for this post. Alas, I can't find the talk.

[lang-srv]: https://microsoft.github.io/language-server-protocol/
[parse-recovery]: https://blog.jez.io/error-recovery-part-1/
[rust-analyzer]: https://rust-analyzer.github.io
[ufcs]: /posts/pl-idea-ufcs/
[lang-srv-perf]: https://rust-analyzer.github.io/blog/2020/07/20/three-architectures-for-responsive-ide.html
[flow]: https://flow.org/
[types-first]: https://flow.org/en/docs/lang/types-first/
[ruby-mutation]: https://blog.jez.io/ruby-mutation/
[sorbet]: https://sorbet.org
[stripe]: https://stripe.com
[parse-kw]: https://github.com/sorbet/sorbet/pull/1993
[prettier]: https://prettier.io
[rustfmt]: https://github.com/rust-lang/rustfmt
[lim-op]: /posts/limitations-opportunity/
[niko]: http://smallcultfollowing.com/babysteps/about/
[salsa-rs]: https://github.com/salsa-rs/salsa
