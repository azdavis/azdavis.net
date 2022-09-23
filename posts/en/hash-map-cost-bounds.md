---
title: Hash map cost bounds
date: 2022-09-20
desc: A technicality hidden in some asymptotic cost bounds.
---

A while ago, I found myself quite confused by exactly how hash maps can claim to have such excellent performance.

I've since, to my knowledge, cleared up my understanding, so I thought I'd write up the misunderstanding I had and how I resolved it.

The one sentence TL;DR of the entire post is this:

> The asymptotic cost bounds for hash map performance assume the sizes of all keys are bounded by some fixed constant.

## Background

A hash map is a data structure that maps keys to values. Its most important operations are:

- **Insert** a key-value pair into the map.
- **Get** the value associated with a given key in the map.
- **Remove** a key-value pair from the map.

For instance, in TypeScript:

```ts
// create a new, empty map
let m = new Map<string, number>();

// insert
m.set("foo", 150);

// get
let num = m.get("foo");
console.log(num); // ==> 150

// remove
m.delete("foo");
```

## Implementation sketch

Roughly speaking, a hash map has two key components:

1. A hash function.
2. A backing array.

All of the major operations on a hash map involve a given key. Given that key, a hash map implementation will:

1. Apply the hash function to the key, to transform the key into a hash value. The hash value will be a non-negative integer, aka a natural number.
2. Use that hash value and other factors, such as the backing array's size, to compute an index into the backing array.
3. Index into the array with that index to either:
   - Insert a value there (insert).
   - Return whatever value is there (get).
   - Remove the value there (remove).

There's a **lot** of detail I'm glossing over here, but this is the general idea.

## Cost bounds

The asymptotic cost bounds for the performance of the various hash map operations are quite impressive.

A hash map may execute a single one of the three core operations (insert, get, or remove):

- On average, in constant time, aka $O(1)$.
- In the worst case, in linear time, aka $O(n)$.

Indeed, hash maps are quite a ubiquitous and important data structure because of this. In practice, other data structures, even those with asymptotically better worst-case performance, such as search trees, are often eschewed for the all-powerful hash map.

This fact has somewhat to do with cache locality (or lack thereof) on modern CPUs. Search trees are often implemented with each node as a new memory allocation, which leads to lots of pointer chasing.

## Cost to hash the keys

But in any case, what confused me is the assertion that all of the hash map operations could possibly operate in constant time at all. Specifically, I was concerned about how much time it would take to apply the hash function to a given key.

If the keys are, for example, strings, then any decent hash function for strings would have to traverse the entire string, incorporating information from each byte of the string to calculate the hash value for that string. This is an $O(n)$ operation.

How, then, can the average case for hash map operations be $O(1)$ and only the worst-case be $O(n)$, given that we must **always** hash the key?

## A sneaky conflation

To begin to answer this question, we should first be more precise about what we mean by $n$.

Computer scientists and software engineers usually use the variable $n$ to talk about various common cost bounds. From lowest to highest, some common cost bounds are:

| Name        | Big-$O$     |
| ----------- | ----------- |
| Constant    | $O(1)$      |
| Logarithmic | $O(\log n)$ |
| Linear      | $O(n)$      |
| Quadratic   | $O(n^2)$    |
| Cubic       | $O(n^3)$    |
| Exponential | $O(2^n)$    |

It's not wrong to say that traversing every byte of a string is an $O(n)$ operation. However, the key is that $n$ here refers specifically to the number of bytes in that string.

By contrast, when we say that the common hash map operations each have worst-case performance $O(n)$, here, $n$ refers to the number of key-value pairs in the map.

So, we have two completely different things:

1. The length of a string key in bytes
2. The size of the hash map

But both are, colloquially, "$n$", since we often use $n$ as much as possible when expressing "sizes" of things.

Thus, I conflated the two in my mind, and got confused.

## An implicit component

We are now ready to answer the question of how the hash map operations can execute in constant time on average.

The answer is, actually, the TL;DR at the top of this post, which I will include again here:

> The asymptotic cost bounds for hash map performance assume the sizes of all keys are bounded by some fixed constant.

The way I like to think of this is that there is an implicit third component of a hash map, in addition to the hash function and backing array:

3. A natural number $c$ such that the size of every key is less than or equal to $c$.

This implicit component is an invariant about the hash map. The invariant must be upheld in order for us to say that we may hash an arbitrary key in constant time.

## A related example

This [concept][limitations-opportunity], in which we enforce a bound on the size of the keys to be able to achieve good performance, comes up in other computer science contexts.

One such context it came up for me was when I was implementing a dynamic programming algorithm. I wished to construct a DP table keyed on strings. However, a TA pointed out to me that since there was no constant bound on the size of the string keys I would be using, I could not claim that accessing the DP table would be a constant-time operation. I thus had to restructure my approach.

[limitations-opportunity]: /posts/limitations-opportunity/
