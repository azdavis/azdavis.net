---
title: Test the repository
date: 2023-01-17
desc: Going beyond testing the behavior of programs.
---

We usually write tests that check that our code behaves a certain way when we run it. However, we can use tests to check not just the behavior of programs, but the "behavior" of the entire project and all of its code files.

I learned about this idea of "testing everything" from Alex Kladov, aka matklad, and his post [How to Test][how]. It's a great post, and I'm focusing on just one part of it in this post of mine.

## Examples

In my project [Millet][], a [language server][lsp] for [Standard ML][sml], I have some [repository tests][repo], which ensure the repository itself must be a certain way.

### Statics rule references

For every rule in the statics for the [Definition of Standard ML][defn], there must be exactly one place in the code that references that rule.

### Manual sync

Sometimes there are places in the code that must be kept "in sync" with some other place. In this case, there must be exactly two comments that name the thing that must be kept in sync, to link them together.

### Test references

There are comments above interesting or unintuitive bits of the code that make reference to tests that specifically use that interesting or unintuitive bit. These comments must refer to actual tests.

### Node version

All of the following Node versions must be the same:

- The one mentioned in the readme under the directions for building the project
- The one we use for building the project in CI
- The one we use in the npm scripts in the `package.json` for the VS Code extension

### Documentation

- Every Rust file must have a `//!` documentation comment at the start of the file.
- Every crate in `crates/` must be mentioned in the [architecture documentation][arch]. The idea of "architecture documentation" comes again from a [post][arch-post] from matklad.
- Every diagnostic that Millet can emit must have a unique diagnostic code that must be [documented][diagnostics].
- The VS Code settings must be documented in the [manual][] exactly as they appear in the `package.json` for the extension.

### Changelog

Every `git` tag must have a corresponding entry in the [changelog][].

## Conclusion

Writing tests for the repository itself is a nifty trick with a lot of possible benefits:

- If there is a test that everything must be documented, it can nudge you to write more documentation.
- If there is a test that things must reference one another with special comments, it is less likely those things will drift out of sync with one another.

And so on.

[millet]: /posts/millet
[lsp]: https://microsoft.github.io/language-server-protocol/
[sml]: https://smlfamily.github.io
[how]: https://matklad.github.io/2021/05/31/how-to-test.html#Test-Everything
[arch-post]: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
[repo]: https://github.com/azdavis/millet/blob/ed79c7e2302f8ecdb7c1b87e44c43a5e6f74aa91/crates/tests/src/repo.rs
[defn]: https://smlfamily.github.io/sml97-defn.pdf
[arch]: https://github.com/azdavis/millet/blob/ed79c7e2302f8ecdb7c1b87e44c43a5e6f74aa91/docs/ARCHITECTURE.md
[changelog]: https://github.com/azdavis/millet/blob/ed79c7e2302f8ecdb7c1b87e44c43a5e6f74aa91/docs/CHANGELOG.md
[diagnostics]: https://github.com/azdavis/millet/blob/ed79c7e2302f8ecdb7c1b87e44c43a5e6f74aa91/docs/diagnostics.md
[manual]: https://github.com/azdavis/millet/blob/ed79c7e2302f8ecdb7c1b87e44c43a5e6f74aa91/docs/manual.md
