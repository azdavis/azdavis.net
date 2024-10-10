---
title: rjsonnet
date: 2024-10-10
desc: A language server for Jsonnet.
---

We use [Jsonnet][] extensively at [Databricks][db]. There are various editor tools and plugins for Jsonnet, but I wanted to try making my own.

So I created [rjsonnet][], a Jsonnet language server in Rust. It is available as a [VS Code][vscode] extension.

It has the usual features you'd expect from an editor plugin:

- Syntax highlighting
- Error tolerant parsing
- Inline errors and warnings
- Go-to-definition
- Standard library documentation

It also has type inference. This powers more advanced features:

- Hover for info
- Type errors
- Auto-completions, via knowing what fields are on an object

There are no changes to the usual Jsonnet syntax. To add "type annotations" to a function, you add type assertions on the parameters to the beginning of your function, like this:

```text
local mul(a, b) =
  assert std.isNumber(a) && std.isNumber(b);
  a * b
```

This will be inferred to have type

```text
(a: number, b: number) => number
```

The language server has been designed to be performant and efficient:

- It avoids repeated allocations of the same strings and types via interning
- It processes files in parallel
- It caches data across file updates, only updating what changed
- It only caches necessary data, saving memory

Please check it out!

[db]: https://www.databricks.com/
[jsonnet]: https://jsonnet.org/
[rjsonnet]: https://github.com/azdavis/rjsonnet
[vscode]: https://marketplace.visualstudio.com/items?itemName=azdavis.rjsonnet
