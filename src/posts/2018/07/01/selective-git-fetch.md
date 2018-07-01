---
title: Selective git fetch
path: /posts/2018/07/01/selective-git-fetch/
date: 2018-07-01T00:56:00-00:00
---

If you work on a large git repository, every time you `git fetch` (or
`git pull`, which calls `git fetch`), you may notice lots of branches you don't
care about being updated.

To alleviate this, you can:

1. Prefix the branches that you work on with some prefix (perhaps your
   username), followed by a slash.
2. Tell git to only fetch those branches in `.git/config`.

```
[remote "origin"]
    url = https://github.com/azdavis/azdavis.xyz.git
    fetch = +refs/heads/azdavis/*:refs/remotes/origin/azdavis/*
```

If you want to fetch other branches (like `master`), you can specify those
with another `fetch = ...` line.

```
[remote "origin"]
    url = https://github.com/azdavis/azdavis.xyz.git
    fetch = +refs/heads/azdavis/*:refs/remotes/origin/azdavis/*
    fetch = +refs/heads/master:refs/remotes/origin/master
```
