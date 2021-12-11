---
title: "Limitations provide opportunity"
date: 2021-12-10
---

One of my favorite classes I took in college was [Foundations of Programming
Languages][pl-cmu], taught by Prof. Robert Harper. In this class, we studied
various programming language features and formal semantics.

The most important thing I learned from the class is that _limitations provide
opportunity_. That is: if we _limit_ our possibilities in one respect, we gain
the _opportunity_ to exploit these limitations to great effect in other
respects.

Let us explore some examples of this phenomenon. In all of these examples, the
opportunity that is gained by imposing limitations is increased performance.

## Example: Static typing

In statically typed languages, a typechecker statically (i.e. before runtime)
determines the type of every term. If the typechecker detects a type error, the
program is not permitted to run.

In dynamically typed languages, there is no static typechecker, and type errors
are thus reported at runtime.

Statically typed languages have some limitations compared to dynamically typed
languages. But in exchange for this, statically typed languages also offer
performance benefits that dynamically typed languages cannot.

### Limitation: Type annotations

Most statically typed languages, like C, C++, and Java, require type annotations
for function parameters, function return values, local variables, struct/class
fields, etc. These annotations help the static typechecker determine the type of
every expression. But these languages thus limit the user by refusing to run
programs lacking such annotations.

Recent improvements in C++ and Java, as well as newer languages like Rust and
Go, decrease the annotation burden somewhat by allowing type inference for local
variables. But generally, most statically typed languages require the user to
write type annotations.

Meanwhile, in dynamically typed languages, like JavaScript, Python, and Ruby,
there is no built-in static typechecker, and thus type annotations are never
necessary. Usually they are not even _possible_ to write: the language has no
static types, and thus affords no syntax for static type annotations.

### Limitation: Incompleteness

In a statically typed language, the set of rules that govern what errors the
typechecker emits and when it emits them is called the type system.

A highly desirable property of a type system is that it is sound. This means
that if the typechecker does not report a type error for a program, then there
really are no type errors in that program.

The converse property is that of completeness: if a program has no type errors,
then the typechecker reports none.

Gödel's first incompleteness theorem states that once a formal system is
expressive enough, it cannot be both sound and complete.

Thus, because we often desire type systems to be both sound, and as expressive
as possible, it is often not possible for a type system to be complete.

This means that there will almost always be programs that "should" be
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
_ownership_. In Rust, a value can be owned by at most one variable at a time.
That variable is called the value's owner.

### Limitation: Harder to express some patterns

Because of the ownership system in Rust, certain fairly common patterns like a
doubly-linked list or a tree with parent pointers are more difficult to express.

### Opportunity: Static automatic memory management

Rust uses the strict rules of ownership, enforced statically by the compiler, to
automatically insert memory allocations and frees where needed. This
distinguishes Rust from nearly every other programming language in widespread
use.

Some languages, like C and C++, require the programmer to explicitly allocate
and free objects. This makes it hard to write programs free of memory errors
like leaks, double-frees and accessing freed memory. In Rust, because
allocations and frees are inserted automatically where needed, these memory
issues are far less common.

Most other languages use either a garbage collector or reference counting to
automatically manage memory. However, in these systems, it is not statically
knowable when objects should get freed. Thus, this information must be computed
and stored at runtime.

Much as in the discussion of static versus dynamic typing, computing and storing
additional information at runtime in this way imposes a performance penalty.

## Example: Placement of `impl`s

Rust allows defining _items_ like types and functions. As a convenience, Rust
permits defining items not just at the top-level as is common, but also inside
the body of function items. This lets the programmer restrict the scope of a
helper function to just the single function that uses the helper.

```rs
// top-level definition
fn top() {
  // inner definition
  fn helper() {}
  // `helper` is in scope here
  helper();
}

fn main() {
  // `top` is in scope here
  top();
  // error[E0425], `helper` is NOT in scope here
  helper();
}
```

### (Lack of) limitation: `impl`s may appear in function bodies

One kind of item in Rust is the `impl` item, which adds methods to a type.

```rs
struct Rectangle {
  width: u32,
  height: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

fn main() {
  let rect = Rectangle { width: 3, height: 4 };
  println!("{}", rect.area());
  // ==> 12
}
```

Note that an `impl` for a type may appear in a different file than the type
itself.

Further note that, being items, `impl`s may appear inside the body of function
items:

```rs
fn top() {
  impl Rectangle {
    fn area(&self) -> u32 {
      self.width * self.height
    }
  }
}
```

However, `impl`s have effect (i.e. they are "in scope") no matter where
declared. So, if as in this example, the `impl Rectangle` to add the `area`
method was inside the `top` function, `area` would still be a method on _all_
`Rectangle`s, whether they are used inside the scope of `top` or not.

This means that in Rust, changing the body of a function can affect items
declared outside of the scope of the function - even ones declared in a
different file.

### (Lack of) opportunity: incremental re-typechecking

[rust-analyzer][] is a [language server][] for Rust. A language server analyzes
a repository of code and provides information like

- the type of a given term
- where a given name is defined
- what methods are available for a given type

and so on.

We would like to optimize our language server by incrementally updating its
database of semantic knowledge about the code repository when a programmer
modifies files. For instance, if a programmer just edits a single function's
body, we can re-type-check just that function's body, since only that function's
body has changed.

Except this is _not_ true in Rust, as just discussed: the function body could
contain an `impl` for another type declared elsewhere. So applying this
optimization for Rust is more difficult.

## Conclusion

These examples illustrate that consciously choosing to add limitations can
provide benefits, often in the form of increased performance. Conversely,
removing limitations can in a sense _add_ limitations, in that we may no longer
take advantage of the types of opportunities discussed here.

[pl-cmu]: https://www.cs.cmu.edu/~rjsimmon/15312-s14/
[language server]: https://microsoft.github.io/language-server-protocol/
[rust-analyzer]: https://rust-analyzer.github.io
