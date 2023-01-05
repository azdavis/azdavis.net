---
title: Limitations engender opportunity
date: 2021-12-10
desc: "Alternative title: 'tradeoffs are a thing'."
---

In college, I took the class [Foundations of Programming Languages][pl-cmu], taught by Professor [Robert Harper][bob]. In this class, we studied [programming languages][pfpl] and [formal semantics][].

One thing I learned from Professor Harper is that limitations engender opportunity. That is, if we limit our possibilities in one respect, we gain the opportunity to exploit these limitations to great effect in other respects.

Let us explore some examples of limitations in programming languages, and what opportunities they unlock. In these examples, the opportunity that we gain by imposing limitations is improved performance.

## Example: Static typing

In statically typed programming languages, a typechecker statically (i.e. before runtime) determines the type of every [term][]. If the typechecker detects a type error, the program is not permitted to run.

In [dynamically typed][uni-typed] languages, there is no static typechecker, and type errors are thus reported at runtime.

### Limitation: Type annotations

Most ([but][sml] not [all][ocaml]) statically typed languages, like C, Java, and Rust, require some amount of type annotations for function parameters, function return values, local variables, struct/class fields, etc. These annotations help the static typechecker determine the type of every term. But these languages thus limit the user by refusing to run programs lacking such annotations.

Here's some Rust code that defines a function from integers to integers. We must explicitly note the input and output types with annotations.

```rust
//     type annotations
//        vvv     vvv
fn inc(x: u32) -> u32 {
  x + 1
}
```

Meanwhile, in dynamically typed languages, like JavaScript, Python, and Ruby, there is no static typechecker built in to the language, and thus type annotations are never necessary. Usually they are not even possible to write, since the language has no static types, and thus affords no syntax for static type annotations.

This JavaScript code, comparable with the Rust code above, has no type annotations.

```js
function inc(x) {
  return x + 1;
}
```

Some dynamically typed languages have optional static typecheckers:

- JavaScript has [TypeScript][ts] and [Flow][flow]
- Python has [MyPy][mypy]
- Ruby has [Sorbet][sorbet]

However, these tools are not required. For instance, this TypeScript code has type annotations, but it is converted into the type-annotation-less JavaScript code above before being run.

```ts
function inc(x: number): number {
  return x + 1;
}
```

### Limitation: Incompleteness

A highly desirable property of a typechecker is that it is sound. This means that if the typechecker does not report a type error for a program, then there really are no type errors in that program.

The converse property is that of completeness: if a program has no type errors, then the typechecker reports none.

Gödel's first incompleteness theorem states that once a system is expressive enough, it cannot be both sound and complete.

Thus, because we often desire a typechecker to be both sound, and as expressive as possible, it is often not possible for it to be complete.

This means that there will always be programs that ought to be well-typed, but for which the typechecker will report an error.

### Limitation: Rice's theorem

Another important result is that of [Rice's theorem][rice]. This states that it is undecidable, aka impossible in general, to statically determine **anything** non-trivial about a program's behavior when run.

The purpose of a static type system is to reject programs that would encounter some error if we ran the program. Static type systems should be, and [usually][cpp-parse-undecidable] are, decidable. It follows from this, and Rice's theorem, that all static type systems are necessarily approximations.

Therefore, at least one of the following must be true about all programming languages:

- The typechecker for the language is incomplete.
  - This means the typechecker rejects programs that would not error when run.
  - Example: Most programming languages.
- The typechecker for the language is unsound.
  - This means the typechecker does not reject programs that error when run.
  - Example: [TypeScript][ts].
- The language is not Turing-complete.
  - This means the language cannot perform certain classes of computations.
  - Example: [Dhall][dhall].

Interestingly, and speaking of Turing, it can be proven that both Rice's theorem and Gödel's incompleteness's theorems ([and other theorems][halt]) follow directly from a single underlying concept: the undecidability of Turing's halting problem.

### Opportunity: No runtime type checks

In dynamically typed languages, type errors occur at runtime. This means that, at runtime, we must check the type of a value before performing an operation on it, to know whether we must raise a type error.

This is an performance penalty, since it takes a small but non-zero amount of time to perform these checks.

In statically typed languages, because the static typechecker knows the type of each term before the program runs, we know that, when our program is running, it will be free of type errors. This means that there is no need to do runtime type checks.

### Opportunity: No runtime storage of types

In dynamically typed languages, since we must know the type of each value at runtime, we must record the type of each value along with the value itself.

This is another performance penalty, this time in the sense of storage space rather than time, because the running program must use memory to tag each value with its type.

For instance, this program shows that in Python, the value `True` takes 28 bytes to store.

- Some of these 28 bytes are for the actual value of the boolean, to distinguish it from the other boolean, `False`.
- Some are for recording this value's type, `bool`.
- Some are for other purposes, like the reference count for garbage collection.

```py
import sys
print(sys.getsizeof(True)) # ==> 28
```

By contrast, in statically typed languages, we do not perform runtime type checks, and so we need not store the types of values at runtime.

This Rust program shows that value `true`, of type `bool`, takes only 1 byte to store.

```rs
fn main() {
  println!("{}", std::mem::size_of_val(&true)); // ==> 1
}
```

## Example: Ownership

The Rust programming language has a unique memory management system based around the concept of ownership:

- In Rust, at most one variable can "own" a given value at a time.
- That variable is called the value's owner.
- When the owner goes out of scope, the value is dropped (i.e. "deallocated" or "freed").

Consider this short Rust function, which shows a value, its owner, and when the value is dropped:

```rs
fn show_len() {
  let xs = vec![2, 4, 7];
  //       ^^^^^^^^^^^^^ a Vec value
  //  ^^ `xs` is the owner of the value
  let len = xs.len();
  println!("Length: {len}");
  // at the end of this function,
  // `xs` goes out of scope.
  // so, the Vec value is dropped.
}
```

### Limitation: Harder to express some patterns

Because of the ownership system in Rust, cyclic data structures are more difficult (but not impossible) to express. This includes data structures like:

- A doubly-linked list, which allows inserting between adjacent nodes in constant time.
- A tree with parent pointers, which allows going from a child node to its parent in constant time.

### Opportunity: Static automatic memory management

When compiling a Rust program, the compiler uses the rules of ownership to automatically insert memory allocations and deallocations exactly where needed. This distinguishes Rust from nearly every other programming language in widespread use.

Some languages, like C and C++, require the programmer to explicitly allocate and free memory. This makes it hard to write programs free of memory errors. There are many forms of memory errors:

- Memory leak: we fail to deallocate memory that won't be used anymore
- Double free: we deallocate memory that has already been deallocated
- Use after free: we access memory that has already been deallocated
- Out of bounds: we access memory outside of the range of memory we control
- Segmentation fault: we access memory in a restricted area, and the operating system intervenes to prevent this

In Rust, because allocations and deallocations are automatically inserted where appropriate, these memory issues are far less common.

Most other languages use either a garbage collector or reference counting to automatically manage memory. In these systems, it is not statically known when memory should get deallocated. Thus, the runtime system decides when to deallocate memory while the program is running.

Much as in the discussion of static versus dynamic typing, computing, storing, and acting upon additional information at runtime in this way imposes a performance penalty.

## Example: References

Another unique feature of Rust is its system of references. References in Rust are similar to pointers as in C and C++, but have some key differences.

### Limitation: Permitted operations

References can be shared or exclusive, and Rust places limitations on what kinds of references can be created when, and what operations are permitted on those references.

Given a value, Rust allows either unlimited shared references to that value, or a single exclusive reference to that value, to be in scope at a time.

Further, when shared reference to a value are in scope, Rust generally does not allow mutating that value. And when an exclusive reference to a value is in scope, Rust only allows mutating that value via that exclusive reference.

### Opportunity: `noalias` information passed to LLVM

The Rust compiler transforms Rust code into a low-level format called LLVM IR, which is then transformed into machine code by LLVM.

Because of the restrictions around using references in Rust, the Rust compiler can tell LLVM that exclusive references really are exclusive by adding `noalias` annotations to this compiled LLVM IR. Then, when the IR is compiled down to assembly, this knowledge can be exploited to generate fewer assembly operations, improving runtime performance.

For example, consider this C function:

```c
void add_twice(int* a, int* b) {
  *a += *b;
  *a += *b;
}
```

Because `a` and `b` might be the same pointer, we must dereference `b` both times we add it to `*a`, since `*b` could have changed after the first add.

For instance, this is legal:

```c
int main(void) {
  int x = 1;
  add_twice(&x, &x);
  printf("%d\n", x); // ==> 4
  return 0;
}
```

Now consider this similar Rust function:

```rs
fn add_twice(a: &mut i32, b: &mut i32) {
  *a += *b;
  *a += *b;
}
```

This function itself is legal, but calling it as we did in C is not. When we attempt to do so:

```rs
fn main() {
  let mut x = 1;
  add_twice(&mut x, &mut x);
  println!("{}", x);
}
```

We get an error:

```text
error[E0499]: cannot borrow `x` as mutable more than once at a time
 --> src/main.rs:8:21
  |
8 |   add_twice(&mut x, &mut x);
  |   --------- ------  ^^^^^^ second mutable borrow occurs here
  |   |         |
  |   |         first mutable borrow occurs here
  |   first borrow later used by call
```

As noted, Rust does not allow having more than one exclusive reference to a single value in scope at a time.

Because of this limitation, Rust can instruct LLVM to compile `add_twice` to be more efficient. We can dereference `*b` only once, and re-use its value for both adds to `*a`.

Although this also is possible in C by using the `restrict` keyword, in Rust it is the default. It turns out that Rust exposed multiple bugs in LLVM, because its ability to add pervasive `noalias` annotations tested many more situations than C and C++ programmers had ever tested by adding manual `restrict` annotations.

## Example: Placement of `impl`s

Rust allows defining items like types and functions. These items can be defined not just at the top level, but also inside the body of function items. This lets the programmer restrict the scope of an item to just the single function that uses that item.

```rs
fn outer() {
  fn inner() {}
  inner();
}

fn main() {
  outer();
  inner(); // ==> error: not in scope
}
```

### (No) limitation: `impl`s in function bodies

One kind of item in Rust is the `impl` item, which adds methods to a type. In this example, we define a type `Rect`, and then add an `area` method onto that type with an `impl`.

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
  println!("{}", r.area()); // ==> 12
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

However, `impl`s have effect regardless of where they are declared. So, if as in this example, the `impl Rect` to add the `area` method was inside the `outer` function, `area` would still be a method on all `Rect`s, whether they are used inside the scope of `outer` or not.

This means that in Rust, changing the body of a function, like `outer`, can affect items declared outside of the scope of the function, like `Rect`.

### (No) opportunity: Incremental re-typechecking

[rust-analyzer][] is a [language server][] for Rust. A language server analyzes a repository of code and provides information like

- the type of a given term
- the definition site of a given variable
- what methods are available for a given type

and so on.

When a programmer modifies files in the repository, we would like to incrementally update the language server's database of semantic knowledge about the repository.

For instance, if a programmer edits a single function's body, we would like to only re-typecheck that function's body. We can do this if we know that, if the only thing that changed was a single function's body, not its type, then it is not possible for the well-typed-ness of other functions to change.

Except this is not true in Rust, as just discussed. This is because the edited function's body could contain an `impl` for another type defined elsewhere. And editing that `impl` could add or remove methods for that type, which may be used in other functions.

So, writing an incrementally-updating language server for Rust is more difficult than it would be if `impl`s were not allowed in function bodies.

## Conclusion

These examples illustrate that consciously choosing to add limitations can engender benefits, often in the form of improved performance.

Conversely, ostensibly removing limitations can in a sense add limitations, in that we may no longer take advantage of the types of opportunities discussed here.

[pl-cmu]: https://www.cs.cmu.edu/~rjsimmon/15312-s14/
[bob]: https://www.cs.cmu.edu/~rwh/
[formal semantics]: /posts/define-pl-01/
[pfpl]: https://www.cs.cmu.edu/~rwh/pfpl/
[uni-typed]: https://existentialtype.wordpress.com/2011/03/19/dynamic-languages-are-static-languages/
[language server]: https://microsoft.github.io/language-server-protocol/
[rust-analyzer]: https://rust-analyzer.github.io
[term]: /posts/lambda-cube/
[sml]: https://www.smlnj.org/sml97.html
[ocaml]: https://ocaml.org
[ts]: https://www.typescriptlang.org
[flow]: https://flow.org
[mypy]: http://mypy-lang.org
[sorbet]: https://sorbet.org
[cpp-parse-undecidable]: https://blog.reverberate.org/2013/08/parsing-c-is-literally-undecidable.html
[halt]: http://www.scottaaronson.com/blog/?p=710
[rice]: https://busy-beavers.tigyog.app/rice
[ts]: https://www.typescriptlang.org/docs/handbook/type-compatibility.html#a-note-on-soundness
[dhall]: https://docs.dhall-lang.org/discussions/Safety-guarantees.html#turing-completeness
