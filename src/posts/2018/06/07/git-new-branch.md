---
title: git new-branch
path: /posts/2018/06/07/git-new-branch/
date: 2018-06-07T05:28:31-00:00
---

It's a fairly common use case to create a new git branch, switch to it, make
some commits on it, and then push a branch of the same name to origin. The
process usually looks something like this:

```
$ git checkout -b BRANCH
Switched to a new branch 'BRANCH'
$ <edit, compile, test, commit>
$ git push
fatal: The current branch BRANCH has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin BRANCH
```

Oh, right. The first time you push a branch, you have to add that extra
incantation. Luckily you can shorten `--set-upstream` to just `-u`.

It's a bit annoying, though, that only this first time do you have to remember
to add that extra `-u` and type the branch name twice. Every other time, just
`git push` is enough.

Enter: `git new-branch`.

```
$ git new-branch BRANCH
Switched to a new branch 'BRANCH'
$ <edit, compile, test, commit>
$ git push
```

To use `git new-branch`, just drop [it][1] into your $PATH.

[1]: https://github.com/azdavis/dotfiles/blob/master/bin/git-new-branch
