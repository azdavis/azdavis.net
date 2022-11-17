---
title: Provide the witness
date: 2022-11-17
desc: A strategy for code organization.
---

Recently I was adding functionality to a bit of code at [my job][stripe]. When doing this, I discovered an opportunity to do some refactoring that improved both my change and the overall quality of the code.

If you, like me,

- believe that use of the type system can improve code quality, and
- would like a small, concrete, and practical example of this,

then maybe this post can serve as such an example.

## Starting point

The original code did approximately this:

- We have an amount and some upper and lower bounds.
- We check if the amount is outside the bounds.
- If it is, then do a task with the amount and whether the amount was positive or negative.

In pseudocode it looked like this:

```rs
struct Bounds {
  lower: u32,
  upper: u32,
}

fn maybe_do_task(bounds: Bounds, amount: i32) {
  if !should_do_task(bounds, amount) {
    return;
  }
  let sign: Sign;
  if amount > 0 {
    sign = Sign::Positive;
  } else {
    sign = Sign::Negative;
  }
  do_task(sign, amount);
}

fn should_do_task(bounds: Bounds, amount: i32) -> bool {
  match amount.cmp(0) {
    Ordering::Equal => false,
    Ordering::Less => -amount > bounds.lower,
    Ordering::Greater => amount > bounds.upper,
  }
}
```

Of course, some irrelevant/sensitive details have been stripped out, but this is the general idea.

## First attempt

My goal was to do some extra calculations for the amount we pass in when doing the task. Instead of passing the whole amount, we want to first do some math with both the amount, and the bound that the amount was outside of.

```rs
struct Bounds {
  ...
}

fn maybe_do_task(bounds: Bounds, amount: i32) {
  if !should_do_task(bounds, amount) {
    return;
  }
  let sign: Sign;
  let task_amount: i32;
  if amount > 0 {
    sign = Sign::Positive;
    task_amount = amount - bounds.upper;
  } else {
    sign = Sign::Negative;
    task_amount = -(amount + bounds.upper);
  }
  do_task(sign, task_amount);
}

fn should_do_task(bounds: Bounds, amount: i32) -> bool {
  ...
}
```

During code review I got two pieces of feedback on this. The first was that before we do

```rs
amount = amount - bounds.upper;
```

We should first check that `amount` is actually greater than `bounds.upper`.

Now, in fact, we **already do** that check in this code. We check for `amount > bounds.upper` in `should_do_task`:

```rs
fn should_do_task(bounds: Bounds, amount: i32) -> bool {
  match amount.cmp(0) {
    ...
    Ordering::Greater => amount > bounds.upper,
  }
}
```

And we will have `return`ed out of `maybe_do_task` by now if that check was false:

```rs
fn maybe_do_task(bounds: Bounds, amount: i32) {
  if !should_do_task(bounds, amount) {
    return;
  }
  // by this point, if amount > 0, then
  // amount > bounds.upper is also known
  // to be true
  ...
}
```

However, this is non-trivial, non-local reasoning.

I realized that it would improve readability of this code if we could do the `amount - bounds.upper` calculation closer to when we check that `amount > bounds.upper`.

A consequence of improving readability is reducing the probability of introducing bugs. Which brings me to the second bit of feedback. I made a copy-paste error:

```rs
task_amount = -(amount + bounds.upper);
```

That line should use `bounds.lower` instead. Oops.

## Refactor

The problem with the current code is that the checking logic is very separate from the later calculation logic, even though they are quite related. This makes it harder to follow the code and thus easier to introduce bugs, which I promptly did.

The solution is this: Instead of returning just a `bool` saying "we can do the task", and then doing the (strongly related) calculation for how to do the task after that, what would really make sense is if we returned _either_ how to do the task, _or_ some indication that we can't do the task.

Many languages have support for this pattern, variously called "optional", "option", "maybe", "nilable", or "nullable":

| Language          | Name               |
| ----------------- | ------------------ |
| Rust              | `Option<X>`        |
| Java              | `Optional<X>`      |
| C++               | `std::optional<X>` |
| Haskell           | `Maybe X`          |
| Standard ML       | `X option`         |
| Ruby + [Sorbet][] | `T.nilable(X)`     |

Here's the refactored code:

```rs
struct Bounds {
  lower: u32,
  upper: u32,
}

fn maybe_do_task(bounds: Bounds, amount: i32) {
  match get_task_args(bounds, amount) {
    None => {}
    Some(args) => do_task(args.sign, args.amount),
  }
}

struct TaskArgs {
  sign: Sign,
  amount: i32,
}

fn get_task_args(
  bounds: Bounds,
  amount: i32,
) -> Option<TaskArgs> {
  match amount.cmp(0) {
    Ordering::Equal => None,
    Ordering::Less => {
      if -amount > bounds.lower {
        Some(TaskArgs {
          sign: Sign::Negative,
          amount: -(amount + bounds.lower),
        })
      } else {
        None
      }
    }
    Ordering::Greater => {
      if amount > bounds.upper {
        Some(TaskArgs {
          sign: Sign::Positive,
          amount: amount - bounds.upper,
        })
      } else {
        None
      }
    }
  }
}
```

Notice that `maybe_do_task` is quite simple now, and all the fiddly math logic with comparisons and negating and adding and subtracting and signs is localized to `get_task_args`. (I renamed it because of the change in return type.)

Note also that it's now immediately clear that `amount - bounds.upper` makes sense, because the check for `amount > bounds.upper` is literally on the previous line.

Finally, note that this allows us to remove the duplicated logic that compares `amount` with `0` in `should_do_task` and then again in `maybe_do_task`. Now we do only one comparison in `get_task_args` and do all the necessary logic in each branch of that comparison.

## Closing thoughts

This refactor would not have been possible without a type system that supports the option type.

Using the option type allows one to avoid the kind of "boolean blindness" (so called by my past professor, Robert Harper) we saw in the first attempt. Instead of reducing all our information down from `should_do_task` into a single bit (`true` or `false`), using a sum type allows us to provide to the caller a "witness" of the information that we calculated. Thus the blog post title.

Option types are a special case of [sum types][], which express an alternative between two or more types. Given:

- A general sum type between two types, written $\textsf{Either}[X, Y]$
- The "nothing" type, aka the empty [product type][], written $\langle \rangle$

One can recover the option type:

$$\textsf{Option}[X] = \textsf{Either}[X, \langle \rangle]$$

[stripe]: https://stripe.com
[sorbet]: https://sorbet.org
[sum types]: https://azdavis.net/posts/define-pl-04/
[product type]: https://azdavis.net/posts/define-pl-03/
