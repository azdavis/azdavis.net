---
title: git new-branch
path: /posts/2018/06/07/git-new-branch/
date: 2018-06-07T05:28:31-00:00
---

It's a fairly common use case to create a new [git][] branch, switch to it,
make some commits on it, and then push a branch of the same name to origin. The
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

To use `git new-branch`, just put this in your `~/.gitconfig`:

```
[alias]
	new-branch = "!f() { \
		git checkout -b $1 && \
		git config branch.$1.remote origin && \
		git config branch.$1.merge refs/heads/$1; \
	}; f"
```

Here's [my gitconfig][], as an example.

This is great. It's actually doubly great, because now you can do things like
add a certain prefix to all your branch names automatically. This is encouraged
when working on [Stripe][] internal repositories.

```
[alias]
	new-branch = "!f() { \
		git checkout -b $LOGNAME/$1 && \
		git config branch.$LOGNAME/$1.remote origin && \
		git config branch.$LOGNAME/$1.merge refs/heads/$LOGNAME/$1; \
	}; f"
```

Side note: `$LOGNAME` is [POSIX][] for `$USER`.

[git]: https://git-scm.com
[my gitconfig]: https://github.com/azdavis/dotfiles/blob/master/home/gitconfig
[Stripe]: https://stripe.com
[POSIX]: http://pubs.opengroup.org/onlinepubs/9699919799/
