---
title: "PL idea: unified function call syntax"
date: 2022-03-11
---

Many programming languages have not only [functions], but methods. Methods are
similar to functions, but their biggest difference is that you call them with a
special "method call" syntax.

## Functions

Here's a program in a fake language with Rust-like syntax. It defines a
rectangle type and a function that scales a rectangle's dimensions by some
factor.

```rs
type Rect {
  width: Number
  height: Number
}

fn scale(rect: Rect, by: Number): Rect {
  return Rect {
    width: rect.width * by,
    height: rect.height * by,
  }
}

let r1 = Rect { width: 3, height: 4 }
let r2 = scale(r1, 5)
assert(r2.width == 15)
assert(r2.height == 20)
```

Now suppose we've defined many rectangle manipulation operations, and we now
want to perform a chain of operations one after the other to create a new
rectangle. We might do something like this:

```rs
let r2 = scale(increase_width(reflect(decrease_height(r1, 4)), 7), 5)
```

This is not very easy to read, because:

1. This single line of code is very long.
2. The functions are written in the opposite order that they are called. For
   instance, `scale` comes first in the program text, but we actually call
   `scale` last, after all the other functions.

We can somewhat fix the first problem by splitting the code into many lines, but
it's still not great.

```rs
let r2 = scale(
  increase_width(
    reflect(
      decrease_height(r1, 4),
    ),
    7,
  ),
  5,
)
```

We can also kind of fix both problems by introducing many intermediary
variables, but then we have to come up with awkward names for the variables:

```rs
let shorter = decrease_height(r1, 4)
let reflected = reflect(shorter)
let wider = increase_width(reflected, 7)
let r2 = scale(wider, 5)
```

## Methods

To fix both problems, we can change the definition of the function to be a
method instead. We must choose a type that this method will be "on", in this
case `Rect`. Then, once we define the method, we call it with a special method
call syntax: instead of e.g. `scale(rect, 5)` we do `rect.scale(5)`.

```rs
// `self` is a `Rect`.
fn Rect.scale(self, by: Number): Rect {
  return Rect {
    width: self.width * by,
    height: self.height * by,
  }
}

let r1 = Rect { width: 3, height: 4 }
// method call syntax
let r2 = r1.scale(5)
assert(r2.width == 15)
assert(r2.height == 20)
```

Now, using methods, the order of operations matches the order they appear in the
program, and it's also easier to split the program across multiple lines for
legibility:

```rs
let r2 = r1
  .decrease_height(4)
  .reflect()
  .increase_width(7)
  .scale(5)
```

## Limitations of defining methods

However, there are often limitations on where we can define methods. Many
languages that support methods only allow defining methods in the same file (or
a "nearby" file) as the file where we define the type itself.

So suppose our `Rect` library was written by someone else and we're importing it
for our own use. We'd like to define and use a `shrink` operation, kind of like
the opposite of `scale`. The `Rect` library authors didn't define a `shrink`
method, so we define the operation ourself, but we have to define it as a
function, not a method.

Now, when using our function, we are forced to interrupt the "flow" of the chain
of methods method from before:

```rs
let r2 =
  shrink(
    r1
      .decrease_height(4)
      .reflect(),
    2,
  )
    .increase_width(7)
    .scale(5)
```

This mix of styles hurts readability.

## Monkey patching

To counteract this, some languages, like Ruby, allow anyone to define any new
method for any type. In these languages, defining your own new method on a type
someone else defined is called monkey patching.

However, this too can cause issues. Suppose I define a new `shrink` method for
`Rect` and release it as a library, and someone else does too, but their
`shrink` method is a bit different from mine. Now, suppose someone depends on
both my library and the other library (perhaps without realizing it, through a
chain of dependencies). Which definition of `shrink` "wins"?

As another example, try going on StackOverflow and searching for ruby-tagged
questions. Some [common Ruby methods][ruby-methods] like `blank?` and `present?`
actually only work when using the [Ruby on Rails][rails] library, because Rails
defines these methods as monkey patches on common Ruby classes.

To combat these issues, Ruby introduced [refinements][], which is essentially a
way to restrict the scope of monkey patching.

## Wrapper types

Another alternative is to define a new "wrapper" type around the real type, then
define methods on the wrapper type. This is what [jQuery][jquery] does:

1. Given a "native" DOM value or CSS selector for such values, the `$` function
   returns a [jQuery value][jquery-type] that "wraps" those values.
2. Then, many of the common methods on the jQuery value return new jQuery
   values.

This allows for [chaining][]:

```js
$("p").css("color", "red").find(".special").css("color", "green");
```

However, it can be inconvenient to have to "wrap" the actual value. In our
`Rect` example, we'd have to:

1. Create a new `WrappedRect` type, that contains a `Rect`.
2. Define our own methods on it, like `shrink`.
3. Define "forwarder" methods on it (`scale`, `reflect`, etc) that just call the
   underlying methods on the `Rect`.

## Unified function call syntax

Let's take a step back and remember what we really want. We've seen how using
the method call syntax can improve readability of long chains of operations,
since the data flows in the order that we read the code in.

Given that, we've investigated ways of getting around the restrictions on where
we're allowed to define methods. If we can get around those restrictions, then
we may define our own methods on types that are not our own.

However, what if we instead just did away with "methods" versus "functions"
entirely? As noted, a method is basically just a function with some extra syntax
at the definition site to note that it's a method. Let us instead remove the
distinction between functions and methods, and only allow defining functions.

Wwe will then allow for a method call "syntax sugar" `rect.scale(5)` that is
exactly equivalent to as if you had written the call like a regular function
call, `scale(rect, 5)`. This idea is called "[unified function call
syntax][ufcs]" (UFCS).

```rs
// defined like a function
fn scale(rect: Rect, by: Number) -> Rect { ... }

let r1 = Rect { ... }
// can call like a function...
let r2 = scale(r1, 5)
// ...or like a method.
let r3 = r1.scale(5)
```

With UFCS, the `.` for "method calls" acts a bit more like [the pipe
operator][pipe] from functional programming.

Now we can choose to use the `.` "chaining" syntax with our own functions or
library defined functions. We can choose to use the "regular" call syntax as
well. The decision is no longer made for us based on who defined the operation;
rather, it is up to the caller to decide which call syntax makes the code more
legible.

## Scoping considerations

With methods, we can treat types as a namespace for their methods. For instance,
if we call a method on a value of some type, but that method is not explicitly
imported, we can just look up the type of the value, see what methods are
defined on it, and use that.

With UFCS, however, because we only have regular functions not defined "on"
types, we don't have this benefit anymore.

There are a few things we could do.

1. We could require explicitly importing every function. This can get tedious.
2. We could allow functions defined in the same file as the type to be
   implicitly imported when the type is imported. But, this may get confusing if
   we then call those functions with the regular function call syntax, since we
   might expect functions to only be in scope on types via the method call
   syntax, as in existing languages.

Additionally, if we're introducing functions into the top level namespace, what
is to be done if we import two different types, each with identically named
methods? In languages with proper methods, again, since the methods are
"on" the types themselves, this is not an issue, but it may be an issue here.

A possible solution would be to allow a form of [ad-hoc
polymorphism][ad-hoc-poly]. This allows many functions to exist with the same
name, as long as they have different types. Then the compiler could select the
appropriate function to call based on the types of the function arguments.

[functions]: /posts/lambda-cube
[ruby-methods]: https://stackoverflow.com/questions/885414
[rails]: https://rubyonrails.org
[refinements]: https://docs.ruby-lang.org/en/2.4.0/syntax/refinements_rdoc.html
[jquery]: https://jquery.com
[jquery-type]: https://api.jquery.com/Types/#jQuery
[chaining]: https://stackoverflow.com/questions/7475336
[ufcs]: https://en.wikipedia.org/wiki/Uniform_Function_Call_Syntax
[pipe]: https://stackoverflow.com/questions/12921197
[ad-hoc-poly]: https://en.wikipedia.org/wiki/Ad_hoc_polymorphism
