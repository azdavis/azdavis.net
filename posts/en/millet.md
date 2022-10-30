---
title: Millet
date: 2022-07-02
desc: A language server for Standard ML.
img: /img/millet/0-logo.png
---

Millet, a [language server][lang-srv] for [Standard ML][sml] (SML), is now available. Check it out on:

- [GitHub][repo]
- [VS Code marketplace][vs-code-marketplace]
- [Open VSX][ovsx]

![Millet logo](/img/millet/0-logo.png)

I'd like to:

1. Introduce some of the main features of the project.
2. Note some caveats and potential areas of improvement.
3. Talk a bit about its development.
4. Close with some thanks.

## Features: an overview

### Basic

The extension provides syntax highlighting, as well as bracket and comment configuration.

### Snippets

There are snippets for common language constructs.

![Millet suggesting a snippet for a case expression](/img/millet/1-snippet.png)

### Inline errors

Parse errors, type errors, and more show up directly in the editor.

![Millet showing an error that a function is not exhaustive](/img/millet/2-error.png)

Every error has an error code. In the screenshot, that's the blue number [5011][err-5011] next to the the error message. Click it for a more detailed explanation.

### Hover for type/documentation

Hover over an expression, pattern, type, or keyword to see more information about it.

![Millet showing information about the type of an expression when hovering](/img/millet/3-hover-ty.png)

When something has a polymorphic type, Millet displays both:

- the most general type of the item, and
- the specific type induced by this usage of that item.

![Millet showing first the most general type of a function, then the specific type induced by the types of the function arguments](/img/millet/4-hover-poly-ty.png)

Most items from the standard basis library also have built-in documentation available on hover.

![Millet showing the general type, specific type, and documentation for List.foldl, a standard basis library function](/img/millet/5-hover-std-basis-doc.png)

Millet allows for user-written doc comments as well. Use the syntax:

```sml
(*!
 * My _favorite_ number.
 *)
val num = 5
```

Note that:

- The `(*!` and `*)` must be on their own lines.
- The comment is parsed as [Markdown][md].
- Leading `*` at the start of each line of the comment are required.

![Millet showing user-written doc comments on hover](/img/millet/5a-hover-user-doc.png)

### Go to definition/type definition

Jump to (or peek) the definition of a value, type, structure, signature, or functor.

![Millet peeking the definition of a structure member](/img/millet/6-def-peek.png)

Additionally, if the item has a type, it's possible to jump to (or peek) the definition of the type of that item.

Since types can be composed of other types, there may be many options to jump to. In that case, all available options are shown.

![Millet peeking all the involved type definitions of an expression](/img/millet/7-ty-def-peek.png)

### Holes

Millet supports the full grammar of Standard ML. In addition, Millet parses various "holes", like `_` and `...`.

Though these "holes" are rejected in later stages of analysis, a programmer can use them as placeholders. Millet even reports the inferred type of hole expressions in the error.

![Millet showing an error for an expression hole, noting its inferred type](/img/millet/8-exp-hole.png)

### Code actions

Millet provides code actions to reduce manual typing of boilerplate code.

The "fill case" quick fix automatically fills a `case` expression with all the variants of a `datatype`.

<video controls>
  <source src="/img/millet/9-fill-case.mp4#t=0.001">
</video>

### Multiple files

To allow for large projects with many files, Millet has support for some common SML "group" file types:

- [ML Basis][mlb] ("MLB")
- [SML/NJ Compilation Manager][cm] ("CM")

These file types tell Millet what files in the project to analyze, and in what order.

## Limitations: a caveat

At time of writing, there are some [known issues][known-issues] with Millet:

- Some (hopefully less common) MLB, CM, and SML features are not implemented.
- Millet re-analyzes every file when even one file is changed. Millet is fast enough that this works for small projects, but certainly not for large ones.
- There are a whole slew of language server features that Millet doesn't offer.

With enough spare time on my (or others') part, these limitations might be addressed in the future.

## Development: a narrative

### Prelude

It was the early months of 2020, the last semester of my undergraduate career at Carnegie Mellon. I was a teaching assistant for [15-150][], our introductory-level functional programming class, taught in Standard ML.

This being the fifth time I'd TA'd that class, I saw once again a pattern I had become familiar with. I would see students grapple with not just the "deep ideas" of the course, but "surface level" issues.

In my view, the whole point of any course is to provoke thought about the "deep ideas". So the first category of struggling seems to me more acceptable, or at least, less avoidable.

But these "surface level" issues were not inherent to functional programming itself. Rather, they were about things like the quality of the error messages reported by the implementation of Standard ML that we chose to use.

To me, these issues seemed more solvable. I thought that with [improved tooling][tooling] for SML, students would be able to focus on thinking about the fundamentals of FP. That way, they could minimize time spent doing things like deciphering inscrutable error messages.

In particular, I desired good editor integration. With this, the code editing experience is elevated above the common tedious loop of:

1. Write some code in an editor.
2. Switch to the terminal to compile it.
3. Compile it, and inspect any errors.
4. Switch back to the editor to make modifications.
5. Return to step 1.

Instead, in many cases, the programmer enters the much tighter loop of:

1. Write some code in an editor.
2. There is no step 2, because errors appear in the editor.

Now, while 15-150 is the class I was most involved in as a TA at CMU, I found that I particularly enjoyed other classes involved with programming languages. In addition to 15-150, classes like:

- [15-312][], PL theory
- [15-411][], compilers
- [17-396][], PL design
- [98-317][], a student-run type-theory-ish course

rank among my most favorite at CMU.

So, with the combination of:

- not having not much to do during COVID lockdown due to my summer plans being absolutely wrecked,
- the desire to improve the SML tooling experience, informed by my experience as a 15-150 student and TA, and
- a general interest in programming languages, and experience in related courses,

I set to work implementing a suite of tools for Standard ML.

### First attempt

Rather early along, I realized the most important of these tools would be a [language server][lang-srv]. This is the core of the "in-editor" experience. So I focused on that.

However, the requirements for a language server are rather different from that of a traditional compiler. The major difference is this:

- A language server should strive to process and analyze partial, possibly even malformed input as much as possible.
- By contrast, a compiler may (nay, must) reject invalid input and refuse to process it further.

It wasn't until I was basically done with the MVP that I realized this. Thus, in this first iteration, Millet would immediately halt when there was even one error in the program. This is basically unacceptable for a language server.

This, combined with:

- Bugs
- Other questionable design decisions
- Lack of enthusiasm from others
- My full-time job starting

meant that I ended up putting the project on hold indefinitely.

### Interlude

Somewhere in there, I wrote [another language server][c0ls], this time for [C0][c0], CMU's own teaching language used in [15-122][], the intro-level imperative programming course. This time, I wrote the language server more like a language server and less like a compiler.

However, it was only after I got it to MVP status that I realized [one already existed][c0-staff], and it:

- was more full-featured than my own
- had existing users
- was officially supported by the 15-122 staff

So I stopped work on my own.

### Revival

The project remained dormant until May 2022, when a friend shared a screenshot with me. It was a discussion about Millet in a CMU student Discord.

I could hardly believe it. Even in its unfinished state (which was noted in the discussion), Millet was still attracting some interest.

This alone was enough to get me back in action. First I modernized the old code and tests:

- Updating dependencies
- Splitting the old code into crates
- Moving tests into regular Rust tests runnable with `cargo test`

Then, alongside the old code, I wrote a completely new implementation, using what I had learned about the requirements of language servers.

After reaching parity with the old implementation, I deleted the old to continue with the new. It's since become better than the old implementation ever was.

#### It's faster

I profiled it, and made copying of some key data structures more efficient. This sped it up by 15x on one particularly large 15-150 homework handout.

#### It handles more language constructs

For instance, it now supports:

- `sharing` specifications
- `where` signature expressions
- `#` record selectors
- `...` pattern rows (as in `val {x, ...} = {y = 1, x = 2}`)
- All derived forms
- Various common extensions, like:
  - Or patterns
  - `where S = T`
  - `functor` and `signature` in `local`

In addition, it handles other language constructs ostensibly supported in the old implementation with much fewer bugs.

#### It's built like a language server

This means it's able to:

- Show more than 1 error at a time.
- Handle partial parses, type errors, etc while leaving valid code still analyzable.

#### It has more features

In addition to showing errors inline (or, well, the old implementation really just showed "error" inline), it now has:

- Snippets
- Hover for info
- Jump to def
- Code actions

#### It supports multiple files

The old implementation would analyze each SML file in the workspace in isolation. This meant files could not import or export things from one another.

Now, Millet uses its support for MLB and CM files to process many files.

## Thanks: a recognition

I'd like to give thanks to some folks that helped me along the way:

- CMU, where I first discovered my enjoyment of PL-related things.
- 15-150, the class I TA'd the most.
- [Project Savanna][proj-sav], a group who shares my desire in improving the tooling around SML. Many of them are current and former 15-150 TAs.
- The CMU student Discord, for motivating me to revive and improve the project.
- [Yixin He][yixin], for the art.
- My girlfriend, for supporting me and the things I like.

[15-122]: https://www.cs.cmu.edu/~15122/
[15-150]: https://www.cs.cmu.edu/~15150/
[15-312]: https://www.cs.cmu.edu/~rjsimmon/15312-s14/
[15-411]: https://www.cs.cmu.edu/afs/cs/academic/class/15411-f20/www/
[17-396]: https://www.cs.cmu.edu/~aldrich/courses/17-396/
[98-317]: https://hypefortypes.github.io
[c0-staff]: https://github.com/CalLavicka/c0-vscode-extension
[c0]: https://c0.cs.cmu.edu/docs/c0-reference.pdf
[c0ls]: https://github.com/azdavis/c0ls
[cm]: https://www.smlnj.org/doc/CM/new.pdf
[err-5011]: https://github.com/azdavis/millet/blob/main/docs/errors.md#5011
[known-issues]: https://github.com/azdavis/millet/blob/main/docs/known-issues.md
[lang-srv]: https://microsoft.github.io/language-server-protocol/
[md]: https://www.markdownguide.org
[mlb]: http://mlton.org/MLBasis
[naming]: https://github.com/azdavis/millet#naming
[proj-sav]: https://discord.gg/hgPSUby2Ny
[repo]: https://github.com/azdavis/millet
[sml]: https://smlfamily.github.io
[tooling]: /posts/pl-idea-tooling
[vs-code-marketplace]: https://marketplace.visualstudio.com/items?itemName=azdavis.millet
[yixin]: https://yixinhe.me
[ovsx]: https://open-vsx.org/extension/azdavis/millet
