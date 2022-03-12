---
title: "PL idea: unified function call syntax"
date: 2022-03-11
---

Many programming languages have not only [functions], but methods. Methods are
similar to functions, but their biggest difference is that we call them with a
special "method call" syntax. Whereas function call syntax often looks like
`f(x, y)`, method call syntax often looks like `x.f(y)`.

## Functions

Here's a program in a fake language with Rust-like syntax. In it, we define a
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

Suppose we now want to perform a chain of rectangle manipulation operations, one
after the other. We might do something like this:

```rs
let r2 = scale(increase_width(reflect(decrease_height(r1, 4)), 7), 5)
```

This is not very easy to read, because:

1. This single line of code is very long.
2. Functions that are called last appear first in the program text, and vice
   versa.

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

Now, using methods, the order that the calls occur matches the order they appear
in the program. It's also easier to split the program across multiple lines
for legibility:

```rs
let r2 = r1
  .decrease_height(4)
  .reflect()
  .increase_width(7)
  .scale(5)
```

## Limitations of defining methods

However, there are often limitations on where we can define methods. Many
languages that support methods only allow defining methods "nearby" the
definition of the type itself. So we often cannot, for instance, define a method
on a type in a separate file from where the type is defined.

So suppose our `Rect` library was written by someone else and we're importing it
for our own use. We'd like to define and use a `shrink` operation, kind of like
the opposite of `scale`. The `Rect` library doesn't define a `shrink` method, so
we define it ourselves. But we have to define it as a function, not a method.

Now, when using our function, we must interrupt the flow of the chain of methods
calls from before:

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
method for any type. This is called monkey patching.

However, this too can cause issues. Here's one plausible example:

1. Suppose I define my own `shrink` method for `Rect`.
2. Later, I update my version of the `Rect` library, and the new version comes
   with their own version of `shrink`, which is different from mine.
3. A new developer comes along, reads the public docs for `shrink`, and uses
   `shrink` in their code, expecting it to behave as publicly documented.
4. The code actually calls my version of `shrink`, since my monkey-patch now
   overrides the existing definition on `Rect`.
5. The developer is confused as to why their code is broken.

As another example, try going on StackOverflow and searching for ruby-tagged
questions. [Some common methods][ruby-methods] like `blank?` and `present?`
actually only work when using the [Ruby on Rails][rails] library. This is
because Rails defines these methods as monkey patches on common Ruby classes.

To combat these issues, Ruby introduced [refinements][], which is a way to
restrict the scope of monkey patching.

## Wrapper types

Another alternative is to define a new wrapper type around the real type, then
define methods on the wrapper type. This is what [jQuery][jquery] does:

1. Given a native DOM value, or CSS selector for such values, the `$` function
   returns a [jQuery value][jquery-type] that wraps those values.
2. Then, methods on that jQuery value themselves return jQuery values.

This allows for [chaining][]:

```js
$("p").css("color", "red").find(".special").css("color", "green");
```

However, it can be inconvenient to have to wrap the actual value. In our `Rect`
example, we'd have to:

1. Create a new `WrappedRect` type, that contains a `Rect`.
2. Define our own methods on it, like `shrink`.
3. Define "forwarder" methods on it (`scale`, `reflect`, etc) that just call the
   underlying methods on the `Rect`.

## Unified function call syntax

Let's take a step back and remember what we really want.

We've seen how using the method call syntax can improve readability of long
chains of operations. This is because:

- The data flows in the order that we read the code in.
- The code is easy to split across many lines.

To use the method call syntax, we must define operations as methods, not
functions. And so we've investigated ways to define our own custom operations as
methods.

However, what if we allowed using the method call syntax for regular functions?
Let us define the method call syntax `rect.scale(5)` to be exactly equivalent to
as if we had written the call like a regular function call, `scale(rect, 5)`.

We can then get rid of the method versus function distinction entirely, and
define all functions as regular functions.

This idea is called [unified function call syntax][ufcs] (UFCS).

```rs
// defined like a function
fn scale(rect: Rect, by: Number) -> Rect { ... }

let r1 = Rect { ... }
// can call like a function...
let r2 = scale(r1, 5)
// ...or like a method.
let r3 = r1.scale(5)
```

With UFCS, the `.` acts a bit like [the pipe operator][pipe] from functional
programming.

Now we can choose to use the `.` syntax with our own functions or library
defined functions. We can choose to use the regular call syntax as well. The
decision is no longer made for us based on whether we defined the operation as a
"method" or a "function". Rather, it is up to the caller to decide which call
syntax makes the code more legible.

## Scoping considerations

With methods, we can treat types as a namespace for their methods. When we call
a method on a value of some type, we look up the type of the value, and then
find the method with that name defined on that type.

With UFCS, however, because we only have regular functions not defined "on"
types, we can't look up methods like this anymore.

There are a few things we could do instead.

- We could require explicitly importing every function. This can get tedious.
- We could allow functions defined in the same file as the type to be implicitly
  imported when the type is imported. But, this may get confusing if we then
  call those functions with the regular function call syntax. We might expect
  functions to only be in scope on types via the method call syntax, as in
  existing languages.

Additionally, what happens if we have two different types, each with identically
named methods? In languages with proper methods, again, since the methods are
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
