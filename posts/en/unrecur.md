---
title: Rewriting recursion as iteration
date: 2025-01-29
desc: A constructive proof of an equivalence.
---

A consequence of the [Church-Turing thesis][ctt] is that [recursion][recur-post] and iteration are equivalent. This means that you can always take a piece of code using iteration, and rewrite it to use recursion, while changing nothing about the behavior of the code itself, and vice versa.

For instance, you can rewrite iterating over a list with recursion in Rust:

```rs
fn foo_iter<T>(xs: Vec<T>) {
  for x in xs {
    bar(x);
  }
}

fn foo_rec<T>(mut xs: Vec<T>) {
  if xs.is_empty() {
    return;
  }
  let x = xs.remove(0);
  bar(x);
  foo_rec(xs);
}
```

Of course, this is a contrived example. Also, the recursive version is less efficient:

- We might allocate a new stack frame for the recursive call to `foo_rec`, unless the optimizer notices it is a tail call.
- The call `remove(0)` has to shift over everything in the list by 1, which takes $O(n)$ time, making the entire `foo_rec` function $O(n^2)$ instead of `foo_iter`'s $O(n)$, assuming `bar` is $O(1)$.

But importantly, both `foo_iter` and `foo_rec` have the same behavior, in that they call `bar` with all the same `x` in the same order.

But how may we rewrite recursion as iteration? The answer is not always as clear, especially when considering things like:

1. Mutual recursion
2. Multiple recursive calls
3. Non-tail calls

In this post, we will start with some complex recursive code, containing all three of the above mentioned tricky bits. We will then gradually rewrite the code, preserving behavior along the way, until finally all recursive calls are removed.

The code for this post is available in this [repository][repo], which also shows each stage of the rewrite as git commits.

## Overview

- We'll have 2 functions, `func` and `gunc`.
- They recursively call themselves and each other.
- They pass around various changing data to each other.
- The functions will also pass around and append to a log of events, represented as a list.
- As we rewrite, we will test that the original version and the rewritten version produce the same event log, given the same starting data.

Remember, though, that the important thing is not the specific contrived example code that we'll be working with. Rather, it is the process itself, of incrementally rewriting and transforming the code while preserving its behavior, that is the most useful.

## Common code

First we define the events, some data, and a threshold so we don't infinitely recur:

```rs
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Event {
  A(bool),
  B(usize),
  C,
  D,
  E(usize),
  F,
  G,
}

#[derive(Debug, Clone)]
pub struct Data {
  pub num: usize,
  pub cond: bool,
}

pub const THRESHOLD: usize = 150;
```

## Starter code

Now we may define our glorious, contrived, mutually recursive `func` and `gunc`. Aren't they splendid?

```rs
use crate::common::{Data, Event, THRESHOLD};

pub fn func(es: &mut Vec<Event>, mut data: Data) -> usize {
  if data.num >= THRESHOLD {
    es.push(Event::A(data.cond));
    return es.len() + data.num;
  }
  data.cond = !data.cond;
  if data.cond {
    es.push(Event::B(data.num));
    data.num += 1;
    gunc(es, data.num).num + 2
  } else {
    es.push(Event::C);
    data.num += 6;
    func(es, data) + 3
  }
}

pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
  let cond = es.len() % 2 == 0;
  if num >= THRESHOLD {
    es.push(Event::D);
    return Data { num: es.len() | num, cond };
  }
  let data = Data { num: num + 2, cond };
  if es.len() < 5 {
    es.push(Event::E(es.len()));
    Data { num: func(es, data) + 3, cond }
  } else if es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0 {
    es.push(Event::F);
    let mut tmp = gunc(es, num + 4);
    tmp.cond = !tmp.cond;
    tmp
  } else {
    es.push(Event::G);
    let fst = func(es, data);
    let mut tmp = gunc(es, fst);
    tmp.num += fst;
    tmp
  }
}
```

## Do easy vars

We're going to be putting each recursive call on its own line, since we're going to be moving and changing the calls around a lot.

For most calls this is pretty easy.

```diff
@@ -9,11 +9,13 @@ pub fn func(es: &mut Vec<Event>, mut data: Data) -> usize {
   if data.cond {
     es.push(Event::B(data.num));
     data.num += 1;
-    gunc(es, data.num).num + 2
+    let tmp = gunc(es, data.num).num;
+    tmp + 2
   } else {
     es.push(Event::C);
     data.num += 6;
-    func(es, data) + 3
+    let tmp = func(es, data);
+    tmp + 3
   }
 }

@@ -26,7 +28,8 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
   let data = Data { num: num + 2, cond };
   if es.len() < 5 {
     es.push(Event::E(es.len()));
-    Data { num: func(es, data) + 3, cond }
+    let tmp = func(es, data);
+    Data { num: tmp + 3, cond }
   } else if es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0 {
     es.push(Event::F);
     let mut tmp = gunc(es, num + 4);
```

## Split else if

It's a little harder to do this when the call is inside the condition of an `if`. It's even harder when `&&` is involved.

We'll start by splitting an `else if` into `else` and `if`.

```diff
@@ -30,7 +30,8 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
     es.push(Event::E(es.len()));
     let tmp = func(es, data);
     Data { num: tmp + 3, cond }
-  } else if es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0 {
+  } else {
+    if es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0 {
       es.push(Event::F);
       let mut tmp = gunc(es, num + 4);
       tmp.cond = !tmp.cond;
@@ -43,3 +44,4 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
       tmp
     }
   }
+}
```

## Make cond var

Now we can make a variable for that new `if` condition.

```diff
@@ -31,7 +31,8 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
     let tmp = func(es, data);
     Data { num: tmp + 3, cond }
   } else {
-    if es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0 {
+    let cond = es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0;
+    if cond {
       es.push(Event::F);
       let mut tmp = gunc(es, num + 4);
       tmp.cond = !tmp.cond;
```

## Split &&

To split up `&&` we have to be careful to be maximally lazy.

```diff
@@ -31,7 +31,10 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
     let tmp = func(es, data);
     Data { num: tmp + 3, cond }
   } else {
-    let cond = es.len() % 3 > 0 && func(es, data.clone()) % 2 == 0;
+    let mut cond = es.len() % 3 > 0;
+    if cond {
+      cond = func(es, data.clone()) % 2 == 0;
+    }
     if cond {
       es.push(Event::F);
       let mut tmp = gunc(es, num + 4);
```

## Use tmp

Now we can put the call to `func` on its own line.

```diff
@@ -33,7 +33,8 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
   } else {
     let mut cond = es.len() % 3 > 0;
     if cond {
-      cond = func(es, data.clone()) % 2 == 0;
+      let tmp = func(es, data.clone());
+      cond = tmp % 2 == 0;
     }
     if cond {
       es.push(Event::F);
```

## Avoid early return

We have some early returns in `func` and `gunc` for the base case. We're going to remove the `return` and instead use a big `else`, indenting everything that used to be after the `return` in one level.

This isn't great coding style, but we need to do this because we're going to be putting both functions in one big wrapper function, to remove the **mutual** recursion (we'll still be recursive, but it'll be one function). That wrapper function will need to do its own bookkeeping, so we can't be `return`ing explicitly at inopportune times.

Note that the diffs shown here are ignoring whitespace changes, otherwise they'd be massive and confusing.

```diff
@@ -3,8 +3,8 @@ use crate::common::{Data, Event, THRESHOLD};
 pub fn func(es: &mut Vec<Event>, mut data: Data) -> usize {
   if data.num >= THRESHOLD {
     es.push(Event::A(data.cond));
-    return es.len() + data.num;
-  }
+    es.len() + data.num
+  } else {
     data.cond = !data.cond;
     if data.cond {
       es.push(Event::B(data.num));
@@ -18,13 +18,14 @@ pub fn func(es: &mut Vec<Event>, mut data: Data) -> usize {
       tmp + 3
     }
   }
+}

 pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
   let cond = es.len() % 2 == 0;
   if num >= THRESHOLD {
     es.push(Event::D);
-    return Data { num: es.len() | num, cond };
-  }
+    Data { num: es.len() | num, cond }
+  } else {
     let data = Data { num: num + 2, cond };
     if es.len() < 5 {
       es.push(Event::E(es.len()));
@@ -50,3 +51,4 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
       }
     }
   }
+}
```

## Add unused hunc

Now we can start to construct the wrapper function. We'll call it `hunc`. It will take a type that represents either the arguments to `func` or `gunc`, and will return a type that represents either the return type of `func` or `gunc`.

One unfortunate caveat of this approach is that it doesn't encode in the type system the information that whenever we pass it a `func` arg, we expect a `func` return, and same for `gunc`. We'll have to check every time at runtime, which is a performance penalty.

```diff
@@ -52,3 +52,20 @@ pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
     }
   }
 }
+
+enum Arg {
+  Func(Data),
+  Gunc(usize),
+}
+
+enum Ret {
+  Func(usize),
+  Gunc(Data),
+}
+
+fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
+  match arg {
+    Arg::Func(data) => Ret::Func(func(es, data)),
+    Arg::Gunc(num) => Ret::Gunc(gunc(es, num)),
+  }
+}
```

## Swap func

Now we can put the body of `func` into `hunc` and swap `func` to just delegate to `hunc`.

```diff
@@ -1,22 +1,9 @@
 use crate::common::{Data, Event, THRESHOLD};

-pub fn func(es: &mut Vec<Event>, mut data: Data) -> usize {
-  if data.num >= THRESHOLD {
-    es.push(Event::A(data.cond));
-    es.len() + data.num
-  } else {
-    data.cond = !data.cond;
-    if data.cond {
-      es.push(Event::B(data.num));
-      data.num += 1;
-      let tmp = gunc(es, data.num).num;
-      tmp + 2
-    } else {
-      es.push(Event::C);
-      data.num += 6;
-      let tmp = func(es, data);
-      tmp + 3
-    }
+pub fn func(es: &mut Vec<Event>, data: Data) -> usize {
+  match hunc(es, Arg::Func(data)) {
+    Ret::Func(ret) => ret,
+    Ret::Gunc(_) => unreachable!(),
   }
 }

@@ -65,7 +52,23 @@ enum Ret {

 fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
   match arg {
-    Arg::Func(data) => Ret::Func(func(es, data)),
+    Arg::Func(mut data) => Ret::Func(if data.num >= THRESHOLD {
+      es.push(Event::A(data.cond));
+      es.len() + data.num
+    } else {
+      data.cond = !data.cond;
+      if data.cond {
+        es.push(Event::B(data.num));
+        data.num += 1;
+        let tmp = gunc(es, data.num).num;
+        tmp + 2
+      } else {
+        es.push(Event::C);
+        data.num += 6;
+        let tmp = func(es, data);
+        tmp + 3
+      }
+    }),
     Arg::Gunc(num) => Ret::Gunc(gunc(es, num)),
   }
 }
```

## Swap gunc

And same for `gunc`.

```diff
@@ -8,35 +8,9 @@ pub fn func(es: &mut Vec<Event>, data: Data) -> usize {
 }

 pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
-  let cond = es.len() % 2 == 0;
-  if num >= THRESHOLD {
-    es.push(Event::D);
-    Data { num: es.len() | num, cond }
-  } else {
-    let data = Data { num: num + 2, cond };
-    if es.len() < 5 {
-      es.push(Event::E(es.len()));
-      let tmp = func(es, data);
-      Data { num: tmp + 3, cond }
-    } else {
-      let mut cond = es.len() % 3 > 0;
-      if cond {
-        let tmp = func(es, data.clone());
-        cond = tmp % 2 == 0;
-      }
-      if cond {
-        es.push(Event::F);
-        let mut tmp = gunc(es, num + 4);
-        tmp.cond = !tmp.cond;
-        tmp
-      } else {
-        es.push(Event::G);
-        let fst = func(es, data);
-        let mut tmp = gunc(es, fst);
-        tmp.num += fst;
-        tmp
-      }
-    }
+  match hunc(es, Arg::Gunc(num)) {
+    Ret::Func(_) => unreachable!(),
+    Ret::Gunc(ret) => ret,
   }
 }

@@ -69,6 +43,37 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
         tmp + 3
       }
     }),
-    Arg::Gunc(num) => Ret::Gunc(gunc(es, num)),
+    Arg::Gunc(num) => Ret::Gunc({
+      let cond = es.len() % 2 == 0;
+      if num >= THRESHOLD {
+        es.push(Event::D);
+        Data { num: es.len() | num, cond }
+      } else {
+        let data = Data { num: num + 2, cond };
+        if es.len() < 5 {
+          es.push(Event::E(es.len()));
+          let tmp = func(es, data);
+          Data { num: tmp + 3, cond }
+        } else {
+          let mut cond = es.len() % 3 > 0;
+          if cond {
+            let tmp = func(es, data.clone());
+            cond = tmp % 2 == 0;
+          }
+          if cond {
+            es.push(Event::F);
+            let mut tmp = gunc(es, num + 4);
+            tmp.cond = !tmp.cond;
+            tmp
+          } else {
+            es.push(Event::G);
+            let fst = func(es, data);
+            let mut tmp = gunc(es, fst);
+            tmp.num += fst;
+            tmp
+          }
+        }
+      }
+    }),
   }
 }
```

## Use unwrap\_\*

In `func` and `gunc`, which are now just stubs that call `hunc`, we have the previously described run-time match to extract the appropriate `func` or `gunc` return value. We're going to put that matching logic into some helper functions, since we'll be needing it a lot.

```diff
@@ -1,17 +1,11 @@
 use crate::common::{Data, Event, THRESHOLD};

 pub fn func(es: &mut Vec<Event>, data: Data) -> usize {
-  match hunc(es, Arg::Func(data)) {
-    Ret::Func(ret) => ret,
-    Ret::Gunc(_) => unreachable!(),
-  }
+  hunc(es, Arg::Func(data)).unwrap_func()
 }

 pub fn gunc(es: &mut Vec<Event>, num: usize) -> Data {
-  match hunc(es, Arg::Gunc(num)) {
-    Ret::Func(_) => unreachable!(),
-    Ret::Gunc(ret) => ret,
-  }
+  hunc(es, Arg::Gunc(num)).unwrap_gunc()
 }

 enum Arg {
@@ -24,6 +18,22 @@ enum Ret {
   Gunc(Data),
 }

+impl Ret {
+  fn unwrap_func(self) -> usize {
+    match self {
+      Ret::Func(ret) => ret,
+      Ret::Gunc(_) => unreachable!(),
+    }
+  }
+
+  fn unwrap_gunc(self) -> Data {
+    match self {
+      Ret::Func(_) => unreachable!(),
+      Ret::Gunc(ret) => ret,
+    }
+  }
+}
+
 fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
   match arg {
     Arg::Func(mut data) => Ret::Func(if data.num >= THRESHOLD {
```

## Inline func

Notice how short the definition of `func` is now. We can just inline every usage of `func` with a call to `hunc` with `func` args that unwraps a `func` return value.

```diff
@@ -49,7 +49,7 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
       } else {
         es.push(Event::C);
         data.num += 6;
-        let tmp = func(es, data);
+        let tmp = hunc(es, Arg::Func(data)).unwrap_func();
         tmp + 3
       }
     }),
@@ -62,12 +62,12 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
         let data = Data { num: num + 2, cond };
         if es.len() < 5 {
           es.push(Event::E(es.len()));
-          let tmp = func(es, data);
+          let tmp = hunc(es, Arg::Func(data)).unwrap_func();
           Data { num: tmp + 3, cond }
         } else {
           let mut cond = es.len() % 3 > 0;
           if cond {
-            let tmp = func(es, data.clone());
+            let tmp = hunc(es, Arg::Func(data.clone())).unwrap_func();
             cond = tmp % 2 == 0;
           }
           if cond {
@@ -77,7 +77,7 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
             tmp
           } else {
             es.push(Event::G);
-            let fst = func(es, data);
+            let fst = hunc(es, Arg::Func(data)).unwrap_func();
             let mut tmp = gunc(es, fst);
             tmp.num += fst;
             tmp
```

## Inline gunc

And same for `gunc`.

Notice at this point, we have removed the mutual recursion. `func` and `gunc` just delegate to `hunc`, and `hunc` only recursively calls itself.

```diff
@@ -44,7 +44,7 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
       if data.cond {
         es.push(Event::B(data.num));
         data.num += 1;
-        let tmp = gunc(es, data.num).num;
+        let tmp = hunc(es, Arg::Gunc(data.num)).unwrap_gunc().num;
         tmp + 2
       } else {
         es.push(Event::C);
@@ -72,13 +72,13 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
           }
           if cond {
             es.push(Event::F);
-            let mut tmp = gunc(es, num + 4);
+            let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
             tmp.cond = !tmp.cond;
             tmp
           } else {
             es.push(Event::G);
             let fst = hunc(es, Arg::Func(data)).unwrap_func();
-            let mut tmp = gunc(es, fst);
+            let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
             tmp.num += fst;
             tmp
           }
```

## Wrap every branch in a Ret

When we inlined the original bodies of `func` and `gunc` into `hunc`, we took both whole blocks and wrapped them each in their own appropriate `Ret` enum variant.

We're now going to go and wrap each individual final expression instead, since we're going to be moving around the various inner blocks more.

```diff
@@ -36,34 +36,36 @@ impl Ret {

 fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
   match arg {
-    Arg::Func(mut data) => Ret::Func(if data.num >= THRESHOLD {
+    Arg::Func(mut data) => {
+      if data.num >= THRESHOLD {
         es.push(Event::A(data.cond));
-      es.len() + data.num
+        Ret::Func(es.len() + data.num)
       } else {
         data.cond = !data.cond;
         if data.cond {
           es.push(Event::B(data.num));
           data.num += 1;
           let tmp = hunc(es, Arg::Gunc(data.num)).unwrap_gunc().num;
-        tmp + 2
+          Ret::Func(tmp + 2)
         } else {
           es.push(Event::C);
           data.num += 6;
           let tmp = hunc(es, Arg::Func(data)).unwrap_func();
-        tmp + 3
+          Ret::Func(tmp + 3)
         }
-    }),
-    Arg::Gunc(num) => Ret::Gunc({
+      }
+    }
+    Arg::Gunc(num) => {
       let cond = es.len() % 2 == 0;
       if num >= THRESHOLD {
         es.push(Event::D);
-        Data { num: es.len() | num, cond }
+        Ret::Gunc(Data { num: es.len() | num, cond })
       } else {
         let data = Data { num: num + 2, cond };
         if es.len() < 5 {
           es.push(Event::E(es.len()));
           let tmp = hunc(es, Arg::Func(data)).unwrap_func();
-          Data { num: tmp + 3, cond }
+          Ret::Gunc(Data { num: tmp + 3, cond })
         } else {
           let mut cond = es.len() % 3 > 0;
           if cond {
@@ -74,16 +76,16 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
             es.push(Event::F);
             let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
             tmp.cond = !tmp.cond;
-            tmp
+            Ret::Gunc(tmp)
           } else {
             es.push(Event::G);
             let fst = hunc(es, Arg::Func(data)).unwrap_func();
             let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
             tmp.num += fst;
-            tmp
+            Ret::Gunc(tmp)
+          }
         }
       }
     }
-    }),
   }
 }
```

## Add cont

This next step is also a bit of pre-work. The general idea of the next stage of the transformation is that we are going to change how we handle all the bits of code that comes after a given recursive call.

Instead of recursively calling `hunc` and then doing things with the return value, we're going to keep track of an explicit stack of reified local variables that we need to access after the recursive call.

- Right before we make a call, we will push onto that stack the local variables we need around after that call is done.
- Then we'll make the call.
- Then finally we'll look at the stack in reverse order, popping off the stack and doing whatever it is we were going to do with the recursive call return value and the local variables (which we have in the stack).

This is basically what the "call stack" is and does. We're just making it explicit.

Doing this means every recursive call is a tail call.

We call the type that will represent all of the possible different recursive call sites and the actions we have to do after those calls `Cont`, for "[continuation][cont]".

```diff
@@ -34,8 +34,11 @@ impl Ret {
   }
 }

+enum Cont {}
+
 fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
-  match arg {
+  let mut cs = Vec::<Cont>::new();
+  let ret = match arg {
     Arg::Func(mut data) => {
       if data.num >= THRESHOLD {
         es.push(Event::A(data.cond));
@@ -87,5 +90,9 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
         }
       }
     }
+  };
+  while let Some(cont) = cs.pop() {
+    match cont {}
   }
+  ret
 }
```

## Wrap in loop

We discussed in the last step how we're going to use an explicit stack of continuations to make it so that every recursive call is a tail call.

It turns out that if we have a recursive function, where every recursive call is a tail call, we can transform it into an iterative function with a loop and mutation:

- We take the entire function and wrap it in a loop.
- Every time we would make a recursive call, we instead update the arguments to this function to be the new arguments, and `continue` along the loop.
- At the bottom we actually return out of the loop.

This is essentially what tail-call optimization is. We're just going to make it explicit.

In this step, we add a loop around everything that never loops (note the clippy allow), because we just unconditionally (for now) return at the very bottom.

If these last few steps seem a bit weird, stay with me! The next few steps, where we actually start using `Cont` and this outer `loop`, should help make it make sense.

Remember that at every step of the transformation so far, and to come, the behavior of `func` and `gunc` has not changed, and will not change.

```diff
@@ -38,6 +38,8 @@ enum Cont {}

 fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
   let mut cs = Vec::<Cont>::new();
+  #[allow(clippy::never_loop)]
+  loop {
     let ret = match arg {
       Arg::Func(mut data) => {
         if data.num >= THRESHOLD {
@@ -94,5 +96,6 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
     while let Some(cont) = cs.pop() {
       match cont {}
     }
-  ret
+    return ret;
+  }
 }
```

## Do C1

This is the first [defunctionalization of a continuation][defunctionalize] we perform. Most of the rest of the steps will basically look like this one.

We:

- Add a new variant to `Cont`.
- Update a single recursive call site to push that new `Cont` variant to the stack before the call.
- Remove the recursive call and instead mutate the `arg` and `continue`.
- Take all the code that was after the recursive call and move it to the `match cont` that we do as we pop off the stack.

Note that in the continuation code, we are updating the local variable `ret`, which was initially set above. When we're done removing all the recursion, `ret` will always start as a base-case value, and then we will pop off all the continuations from `cs` that we popped on when recurring (aka `continue`ing).

Note also that in this case, we didn't need any local variables to be live across the recursive call, so the `Cont` variant we're adding doesn't carry any data.

```diff
@@ -34,13 +34,14 @@ impl Ret {
   }
 }

-enum Cont {}
+enum Cont {
+  C1,
+}

-fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
+fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
   let mut cs = Vec::<Cont>::new();
-  #[allow(clippy::never_loop)]
   loop {
-    let ret = match arg {
+    let mut ret = match arg {
       Arg::Func(mut data) => {
         if data.num >= THRESHOLD {
           es.push(Event::A(data.cond));
@@ -50,16 +51,16 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
           if data.cond {
             es.push(Event::B(data.num));
             data.num += 1;
-            let tmp = hunc(es, Arg::Gunc(data.num)).unwrap_gunc().num;
-            Ret::Func(tmp + 2)
-          } else {
+            cs.push(Cont::C1);
+            arg = Arg::Gunc(data.num);
+            continue;
+          }
           es.push(Event::C);
           data.num += 6;
           let tmp = hunc(es, Arg::Func(data)).unwrap_func();
           Ret::Func(tmp + 3)
         }
       }
-      }
       Arg::Gunc(num) => {
         let cond = es.len() % 2 == 0;
         if num >= THRESHOLD {
@@ -94,7 +95,12 @@ fn hunc(es: &mut Vec<Event>, arg: Arg) -> Ret {
       }
     };
     while let Some(cont) = cs.pop() {
-      match cont {}
+      match cont {
+        Cont::C1 => {
+          let tmp = ret.unwrap_gunc().num;
+          ret = Ret::Func(tmp + 2);
+        }
+      }
     }
     return ret;
   }
```

## Do C2

This is pretty similar to the previous step.

```diff
@@ -36,6 +36,7 @@ impl Ret {

 enum Cont {
   C1,
+  C2,
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -57,8 +58,9 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           }
           es.push(Event::C);
           data.num += 6;
-          let tmp = hunc(es, Arg::Func(data)).unwrap_func();
-          Ret::Func(tmp + 3)
+          cs.push(Cont::C2);
+          arg = Arg::Func(data);
+          continue;
         }
       }
       Arg::Gunc(num) => {
@@ -100,6 +102,10 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           let tmp = ret.unwrap_gunc().num;
           ret = Ret::Func(tmp + 2);
         }
+        Cont::C2 => {
+          let tmp = ret.unwrap_func();
+          ret = Ret::Func(tmp + 3);
+        }
       }
     }
     return ret;
```

## Do C3

This is mostly the same, but note that we need a local variable from before the call now. So we have this variant carry data, namely, the local variable we need after the call.

```diff
@@ -37,6 +37,7 @@ impl Ret {
 enum Cont {
   C1,
   C2,
+  C3(bool),
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -72,9 +73,10 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           let data = Data { num: num + 2, cond };
           if es.len() < 5 {
             es.push(Event::E(es.len()));
-            let tmp = hunc(es, Arg::Func(data)).unwrap_func();
-            Ret::Gunc(Data { num: tmp + 3, cond })
-          } else {
+            cs.push(Cont::C3(cond));
+            arg = Arg::Func(data);
+            continue;
+          }
           let mut cond = es.len() % 3 > 0;
           if cond {
             let tmp = hunc(es, Arg::Func(data.clone())).unwrap_func();
@@ -94,7 +96,6 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           }
         }
       }
-      }
     };
     while let Some(cont) = cs.pop() {
       match cont {
@@ -106,6 +107,10 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           let tmp = ret.unwrap_func();
           ret = Ret::Func(tmp + 3);
         }
+        Cont::C3(cond) => {
+          let tmp = ret.unwrap_func();
+          ret = Ret::Gunc(Data { num: tmp + 3, cond });
+        }
       }
     }
     return ret;
```

## Use post_if_c4

There's a bit of difficulty around transforming recursive calls that are followed by other recursive calls, as well as transforming calls that are part of a conditional branch that ends and rejoins the pre-existing control flow.

We'll see more in the next step, but for now we're just going to move some stuff into a helper function. It has only one call site now, but in the next step we'll add another call site.

```diff
@@ -82,18 +82,7 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             let tmp = hunc(es, Arg::Func(data.clone())).unwrap_func();
             cond = tmp % 2 == 0;
           }
-          if cond {
-            es.push(Event::F);
-            let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
-            tmp.cond = !tmp.cond;
-            Ret::Gunc(tmp)
-          } else {
-            es.push(Event::G);
-            let fst = hunc(es, Arg::Func(data)).unwrap_func();
-            let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
-            tmp.num += fst;
-            Ret::Gunc(tmp)
-          }
+          post_if_c4(es, data, num, cond)
         }
       }
     };
@@ -116,3 +105,18 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
     return ret;
   }
 }
+
+fn post_if_c4(es: &mut Vec<Event>, data: Data, num: usize, cond: bool) -> Ret {
+  if cond {
+    es.push(Event::F);
+    let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
+    tmp.cond = !tmp.cond;
+    Ret::Gunc(tmp)
+  } else {
+    es.push(Event::G);
+    let fst = hunc(es, Arg::Func(data)).unwrap_func();
+    let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
+    tmp.num += fst;
+    Ret::Gunc(tmp)
+  }
+}
```

## Do C4

Now we see why we needed the `post_if_c4` helper from last step.

```diff
@@ -38,6 +38,7 @@ enum Cont {
   C1,
   C2,
   C3(bool),
+  C4(Data, usize),
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -77,10 +78,11 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             arg = Arg::Func(data);
             continue;
           }
-          let mut cond = es.len() % 3 > 0;
+          let cond = es.len() % 3 > 0;
           if cond {
-            let tmp = hunc(es, Arg::Func(data.clone())).unwrap_func();
-            cond = tmp % 2 == 0;
+            cs.push(Cont::C4(data.clone(), num));
+            arg = Arg::Func(data);
+            continue;
           }
           post_if_c4(es, data, num, cond)
         }
@@ -100,6 +102,11 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           let tmp = ret.unwrap_func();
           ret = Ret::Gunc(Data { num: tmp + 3, cond });
         }
+        Cont::C4(data, num) => {
+          let tmp = ret.unwrap_func();
+          let cond = tmp % 2 == 0;
+          ret = post_if_c4(es, data, num, cond);
+        }
       }
     }
     return ret;
```

## Return ControlFlow

This next step is more pre-work.

In the next few steps, we're going to transform our helper function. Note that when we added the helper function, we actually unfortunately returned to a state where we have not only recursion, but mutual recursion: `hunc` called `post_if_c4` and vice versa.

We need to change `post_if_c4` to push to `cs`, update `arg`, and `continue` instead of recursively calling `hunc`, as in the previous steps. But there's a problem: we can't use `continue`, because we're not syntactically inside the outer loop in `hunc`.

The solution is to use `std::ops::ControlFlow`, in the [Rust standard library][control-flow]. This reifies the control flow choice between `break` and `continue`.

When we want to `continue` from `post_if_c4`, we'll return a `Continue` variant containing the new argument for the recursive call. When we want to just return, we'll use `Break`.

Then `hunc`, which is the only caller of `post_if_c4`, can examine the `ControlFlow` value and either use the returned `Break` value or mutate its `arg` to the new argument inside the `Continue` variant and continue.

Note that we need to add a label to the `'outer` wrapper loop, so that, inside the `while` loop popping off the stack of `Cont`s, we can jump out of that loop and back into the main outer loop.

This corresponds to making more than one recursive call. If we have more than one recursive call, those further calls are necessarily after that first recursive call. Everything after a recursive call is inside a continuation, and we handle continuations in the `while` loop.

```diff
@@ -1,4 +1,5 @@
 use crate::common::{Data, Event, THRESHOLD};
+use std::ops::ControlFlow;

 pub fn func(es: &mut Vec<Event>, data: Data) -> usize {
   hunc(es, Arg::Func(data)).unwrap_func()
@@ -43,7 +44,7 @@ enum Cont {

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
   let mut cs = Vec::<Cont>::new();
-  loop {
+  'outer: loop {
     let mut ret = match arg {
       Arg::Func(mut data) => {
         if data.num >= THRESHOLD {
@@ -84,7 +85,13 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             arg = Arg::Func(data);
             continue;
           }
-          post_if_c4(es, data, num, cond)
+          match post_if_c4(es, data, num, cond) {
+            ControlFlow::Continue(a) => {
+              arg = a;
+              continue;
+            }
+            ControlFlow::Break(r) => r,
+          }
         }
       }
     };
@@ -105,7 +112,13 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
         Cont::C4(data, num) => {
           let tmp = ret.unwrap_func();
           let cond = tmp % 2 == 0;
-          ret = post_if_c4(es, data, num, cond);
+          match post_if_c4(es, data, num, cond) {
+            ControlFlow::Continue(a) => {
+              arg = a;
+              continue 'outer;
+            }
+            ControlFlow::Break(r) => ret = r,
+          }
         }
       }
     }
@@ -113,17 +126,17 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
   }
 }

-fn post_if_c4(es: &mut Vec<Event>, data: Data, num: usize, cond: bool) -> Ret {
+fn post_if_c4(es: &mut Vec<Event>, data: Data, num: usize, cond: bool) -> ControlFlow<Ret, Arg> {
   if cond {
     es.push(Event::F);
     let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
     tmp.cond = !tmp.cond;
-    Ret::Gunc(tmp)
+    ControlFlow::Break(Ret::Gunc(tmp))
   } else {
     es.push(Event::G);
     let fst = hunc(es, Arg::Func(data)).unwrap_func();
     let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
     tmp.num += fst;
-    Ret::Gunc(tmp)
+    ControlFlow::Break(Ret::Gunc(tmp))
   }
 }
```

## Do C5

With the new `ControlFlow` machinery, we can continue along (heh). Note that the continuations we're pushing are now **inside** `post_if_c4`.

We also have to pass `cs` into `post_if_c4`.

```diff
@@ -40,6 +40,7 @@ enum Cont {
   C2,
   C3(bool),
   C4(Data, usize),
+  C5,
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -85,7 +86,7 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             arg = Arg::Func(data);
             continue;
           }
-          match post_if_c4(es, data, num, cond) {
+          match post_if_c4(&mut cs, es, data, num, cond) {
             ControlFlow::Continue(a) => {
               arg = a;
               continue;
@@ -112,7 +113,7 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
         Cont::C4(data, num) => {
           let tmp = ret.unwrap_func();
           let cond = tmp % 2 == 0;
-          match post_if_c4(es, data, num, cond) {
+          match post_if_c4(&mut cs, es, data, num, cond) {
             ControlFlow::Continue(a) => {
               arg = a;
               continue 'outer;
@@ -120,18 +121,28 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             ControlFlow::Break(r) => ret = r,
           }
         }
+        Cont::C5 => {
+          let mut tmp = ret.unwrap_gunc();
+          tmp.cond = !tmp.cond;
+          ret = Ret::Gunc(tmp);
+        }
       }
     }
     return ret;
   }
 }

-fn post_if_c4(es: &mut Vec<Event>, data: Data, num: usize, cond: bool) -> ControlFlow<Ret, Arg> {
+fn post_if_c4(
+  cs: &mut Vec<Cont>,
+  es: &mut Vec<Event>,
+  data: Data,
+  num: usize,
+  cond: bool,
+) -> ControlFlow<Ret, Arg> {
   if cond {
     es.push(Event::F);
-    let mut tmp = hunc(es, Arg::Gunc(num + 4)).unwrap_gunc();
-    tmp.cond = !tmp.cond;
-    ControlFlow::Break(Ret::Gunc(tmp))
+    cs.push(Cont::C5);
+    ControlFlow::Continue(Arg::Gunc(num + 4))
   } else {
     es.push(Event::G);
     let fst = hunc(es, Arg::Func(data)).unwrap_func();
```

## Do C6

This one and the next one are pretty standard fare, so we won't discuss them much.

```diff
@@ -41,6 +41,7 @@ enum Cont {
   C3(bool),
   C4(Data, usize),
   C5,
+  C6,
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -126,6 +127,12 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
           tmp.cond = !tmp.cond;
           ret = Ret::Gunc(tmp);
         }
+        Cont::C6 => {
+          let fst = ret.unwrap_func();
+          let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
+          tmp.num += fst;
+          ret = Ret::Gunc(tmp);
+        }
       }
     }
     return ret;
@@ -145,9 +152,7 @@ fn post_if_c4(
     ControlFlow::Continue(Arg::Gunc(num + 4))
   } else {
     es.push(Event::G);
-    let fst = hunc(es, Arg::Func(data)).unwrap_func();
-    let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
-    tmp.num += fst;
-    ControlFlow::Break(Ret::Gunc(tmp))
+    cs.push(Cont::C6);
+    ControlFlow::Continue(Arg::Func(data))
   }
 }
```

## Do C7

This is the last one!

```diff
@@ -42,6 +42,7 @@ enum Cont {
   C4(Data, usize),
   C5,
   C6,
+  C7(usize),
 }

 fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
@@ -129,7 +130,12 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
         }
         Cont::C6 => {
           let fst = ret.unwrap_func();
-          let mut tmp = hunc(es, Arg::Gunc(fst)).unwrap_gunc();
+          cs.push(Cont::C7(fst));
+          arg = Arg::Gunc(fst);
+          continue 'outer;
+        }
+        Cont::C7(fst) => {
+          let mut tmp = ret.unwrap_gunc();
           tmp.num += fst;
           ret = Ret::Gunc(tmp);
         }
```

## Rm ControlFlow

Since we only return `Continue` from `post_if_c4`, we can remove `ControlFlow` and just always `continue`.

```diff
@@ -1,5 +1,4 @@
 use crate::common::{Data, Event, THRESHOLD};
-use std::ops::ControlFlow;

 pub fn func(es: &mut Vec<Event>, data: Data) -> usize {
   hunc(es, Arg::Func(data)).unwrap_func()
@@ -88,14 +87,9 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
             arg = Arg::Func(data);
             continue;
           }
-          match post_if_c4(&mut cs, es, data, num, cond) {
-            ControlFlow::Continue(a) => {
-              arg = a;
+          arg = post_if_c4(&mut cs, es, data, num, cond);
           continue;
         }
-            ControlFlow::Break(r) => r,
-          }
-        }
       }
     };
     while let Some(cont) = cs.pop() {
@@ -115,14 +109,9 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
         Cont::C4(data, num) => {
           let tmp = ret.unwrap_func();
           let cond = tmp % 2 == 0;
-          match post_if_c4(&mut cs, es, data, num, cond) {
-            ControlFlow::Continue(a) => {
-              arg = a;
+          arg = post_if_c4(&mut cs, es, data, num, cond);
           continue 'outer;
         }
-            ControlFlow::Break(r) => ret = r,
-          }
-        }
         Cont::C5 => {
           let mut tmp = ret.unwrap_gunc();
           tmp.cond = !tmp.cond;
@@ -145,20 +134,14 @@ fn hunc(es: &mut Vec<Event>, mut arg: Arg) -> Ret {
   }
 }

-fn post_if_c4(
-  cs: &mut Vec<Cont>,
-  es: &mut Vec<Event>,
-  data: Data,
-  num: usize,
-  cond: bool,
-) -> ControlFlow<Ret, Arg> {
+fn post_if_c4(cs: &mut Vec<Cont>, es: &mut Vec<Event>, data: Data, num: usize, cond: bool) -> Arg {
   if cond {
     es.push(Event::F);
     cs.push(Cont::C5);
-    ControlFlow::Continue(Arg::Gunc(num + 4))
+    Arg::Gunc(num + 4)
   } else {
     es.push(Event::G);
     cs.push(Cont::C6);
-    ControlFlow::Continue(Arg::Func(data))
+    Arg::Func(data)
   }
 }
```

## Conclusion

This transformation process should work for almost any arbitrarily complicated set of mutually recursive functions.

One case I found that I couldn't handle was when one of the mutually recursive functions takes an argument by reference, and its caller constructs an owned local variable and passes a reference to it. This is tricky to handle with Rust's borrow checker when transforming the continuations.

Even if I tried to move the temporary in the continuation variant and then grab a reference to that, it would still not work because we might mutate the continuation stack, which could invalidate the reference if the backing array was reallocated.

It might be possible to do this with some hackery with `Pin`. Basically, we need a guarantee that the local variable will not move until we process the continuation, at which point we can drop it.

[ctt]: https://en.wikipedia.org/wiki/Church–Turing_thesis
[recur-post]: /posts/assume-recursion-works/
[repo]: https://github.com/azdavis/unrecur
[cont]: https://en.wikipedia.org/wiki/Continuation
[defunctionalize]: https://www.pathsensitive.com/2019/07/the-best-refactoring-youve-never-heard.html
[control-flow]: https://doc.rust-lang.org/stable/core/ops/enum.ControlFlow.html
