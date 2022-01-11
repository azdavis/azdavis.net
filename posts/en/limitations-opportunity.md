---
title: "Limitations engender opportunity"
date: 2021-12-10
---

In college, I took the class [Foundations of Programming Languages][pl-cmu],
taught by Prof. Robert Harper. In this class, we studied programming languages
and formal semantics.

One thing I learned from Prof. Harper is that limitations engender opportunity.
That is, if we limit our possibilities in one respect, we gain the opportunity
to exploit these limitations to great effect in other respects.

In these examples, the opportunity that we gain by imposing limitations is
improved performance.

## Example: Static typing

In statically typed programming languages, a typechecker statically (i.e. before
runtime) determines the type of every [term][]. If the typechecker detects a
type error, the program is not permitted to run.

In dynamically typed languages, there is no static typechecker, and type errors
are thus reported at runtime.

### Limitation: Type annotations

Most statically typed languages, like C, C++, and Java, require some amount of
type annotations for function parameters, function return values, local
variables, struct/class fields, etc. These annotations help the static
typechecker determine the type of every expression. But these languages thus
limit the user by refusing to run programs lacking such annotations.

Meanwhile, in dynamically typed languages, like JavaScript, Python, and Ruby,
there is no built-in static typechecker, and thus type annotations are never
necessary. Usually they are not even possible to write, since the language has
no static types, and thus affords no syntax for static type annotations.

### Limitation: Incompleteness

A highly desirable property of a typechecker is that it is sound. This means
that if the typechecker does not report a type error for a program, then there
really are no type errors in that program.

The converse property is that of completeness: if a program has no type errors,
then the typechecker reports none.

[Gödel's first incompleteness theorem][godel-first] essentially states that once
a system is expressive enough, it cannot be both sound and complete.

Thus, because we often desire a typechecker to be both sound, and as expressive
as possible, it is often not possible for it to be complete.

This means that there will almost always be programs that ought to be
well-typed, but for which the typechecker will report an error.

### Opportunity: No runtime type checks

In dynamically typed languages like JavaScript, Python, and Ruby, type errors
occur at runtime. This means that, at runtime, we must check the type of a value
before performing an operation on it, to know whether we must raise a type
error.

This is an performance penalty, since it takes some non-zero amount of CPU
cycles and branching to perform these checks.

In statically typed languages, because the static typechecker knows the type of
each term before the program runs, we know that, when our program is running, it
will be free of type errors. This means that there is no need to do runtime type
checks.

### Opportunity: No runtime storage of types

In dynamically typed languages, since we must know the type of each value at
runtime, we must record the type of each value along with the value itself.

This is another performance penalty, this time in the sense of storage space
rather than CPU cycles, because must use a small amount of storage to tag each
value with its type.

In statically typed languages, we do not perform runtime type checks, and so we
need not store the types of values at runtime.

## Example: Ownership

The Rust programming language has a unique memory management system based around
the concept of ownership:

- In Rust, at most one variable can "own" a given value at a time.
- That variable is called the value's owner.
- When the owner goes out of scope, the value is dropped (i.e. "deallocated" or
  "freed").

### Limitation: Harder to express some patterns

Because of the ownership system in Rust, cyclic data structures are more
difficult (but not impossible) to express. This includes data structures like:

- A doubly-linked list, which allows inserting between adjacent nodes in
  constant time.
- A tree with parent pointers, which allows going from a child node to its
  parent in constant time.

### Opportunity: Static automatic memory management

Rust uses the strict rules of ownership, enforced statically by the compiler, to
automatically insert memory allocations and deallocations where needed. This
distinguishes Rust from nearly every other programming language in widespread
use.

Some languages, like C and C++, require the programmer to explicitly allocate
and free memory. This makes it hard to write programs free of memory errors
like:

- Memory leaks, where we fail to deallocate memory that won't be used anymore
- Double-frees, where we attempt to deallocate memory that has already been
  deallocated
- Uses-after-free, where we erroneously access memory that has already been
  deallocated

In Rust, because of the ownership system, these memory issues are far less
common.

Most other languages use either a garbage collector or reference counting to
automatically manage memory. In these systems, it is not statically known when
memory should get deallocated. Thus, the runtime system decides when to
deallocate memory while the program is running.

Much as in the discussion of static versus dynamic typing, computing and storing
additional information at runtime in this way imposes a performance penalty.

## Example: Placement of `impl`s

Rust allows defining items like types and functions. These items can be defined
not just at the top level, but but also inside the body of function items. This
lets the programmer restrict the scope of an item to just the single function
that uses that item.

```rs
// top-level item
fn outer() {
  // inner item
  fn inner() {}
  // `inner` is in scope inside `outer`
  inner();
}

fn main() {
  // `outer` is in scope here
  outer();
  // error, `inner` is NOT in scope here
  inner();
}
```

### (Lack of) limitation: `impl`s may appear in function bodies

One kind of item in Rust is the `impl` item, which adds methods to a type. In
this example, we define a type `Rect`, and then add an `area` method onto that
type with an `impl`.

```rs
struct Rect {
  width: u32,
  height: u32,
}

impl Rect {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

fn main() {
  let r = Rect { width: 3, height: 4 };
  println!("{}", r.area());
  // ==> 12
}
```

Note that, being items, `impl`s may appear inside the body of function items.

```rs
fn outer() {
  impl Rect {
    fn area(&self) -> u32 {
      self.width * self.height
    }
  }
}
```

However, `impl`s have effect regardless of where they are declared. So, if as in
this example, the `impl Rect` to add the `area` method was inside the `outer`
function, `area` would still be a method on all `Rect`s, whether they are used
inside the scope of `outer` or not.

This means that in Rust, changing the body of a function can affect items
declared outside of the scope of the function.

### (Lack of) opportunity: incremental re-typechecking

[rust-analyzer][] is a [language server][] for Rust. A language server analyzes
a repository of code and provides information like

- the type of a given term
- the definition site of a given variable
- what methods are available for a given type

and so on.

When a programmer modifies files in the repository, we would like to
incrementally update the language server's database of semantic knowledge about
the repository.

For instance, if a programmer edits a single function's body, we would like to
only re-typecheck that function's body. We can do this if we know that, if the
only thing that changed was a single function's body, not its type, then it is
not possible for the well-typed-ness of other functions to change.

Except this is not true in Rust, as just discussed, because the function body
could contain an `impl` for another type declared elsewhere. Then adding or
removing `impl`s could add or removes methods on types defined elsewhere, which
may be used in other functions.

So, writing an incrementally-updating language server for Rust is more difficult
than it would be if `impl`s were not allowed in function bodies.

## Conclusion

These examples illustrate that consciously choosing to add limitations can
engender benefits, often in the form of improved performance.

Conversely, ostensibly removing limitations can in a sense add limitations, in
that we may no longer take advantage of the types of opportunities discussed
here.

[pl-cmu]: https://www.cs.cmu.edu/~rjsimmon/15312-s14/
[language server]: https://microsoft.github.io/language-server-protocol/
[rust-analyzer]: https://rust-analyzer.github.io
[term]: /posts/lambda-cube
[godel-first]: https://en.wikipedia.org/wiki/Gödel%27s_incompleteness_theorems#First_incompleteness_theorem
