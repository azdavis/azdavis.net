---
title: Understanding Git repository state
date: 2022-12-22
desc: Tips and pointers for knowing what's going on with a Git repository.
---

[Git][git] is one of the most commonly used version control systems. It also has a [big reputation][taylor] of being [difficult to use][shit].

This often leads to developers getting their repositories into confusing states. [Sometimes][xkcd], this leads people to "declare bankruptcy" on their repository:

1. Clone a fresh copy of the repository
2. Manually move over all the relevant changes that should be kept
3. Destroy the old, "corrupted" copy

I say "corrupted" because often times, the repository is not actually literally corrupted. Rather, it is in a technically consistent, but very confusing, state.

I have collected a few tips and tricks for working with Git that are handy for understanding what the state of your repository is.

Knowing is half the battle. Once you know how to know what's going on with your repo, it's more likely you'll figure out how to fix it, without having to "declare bankruptcy".

## `git status`: Taking stock

The first command to learn is:

```text
$ git status
```

Note that the `$` is not part of the command, it is just an indicator that you would type whatever follows the `$` as a command at a terminal.

`git status` will tell you things like:

- What branch you have checked out
- What changes are staged (part of the next commit)
- What changes are not staged
- What files are not tracked at all

If you're in a weird state with Git, the first thing I recommend is getting yourself to a "clean working tree". That means dealing with any uncommitted changes and untracked files. Only once `git status` reports that the working tree is clean do I recommend trying to do anything else with your repository.

## `git log`: Knowing the past

Next is `git log`, which shows you the log of all past commits. The default appearance of `git log` is something like this[:][guy]

```text
$ git log
commit 3afabb0dc314b3c8e814f25775cc1c1c1318c5f7 (HEAD -> main)
Merge: 3893c52 31e2c04
Author: Guy Incognito <guy@example.com>
Date:   Tue Dec 20 23:15:10 2022 -0500

    Merge branch 'blub'

commit 31e2c04074ddc4ebc65bc22551e432975e26b234 (blub)
Author: Guy Incognito <guy@example.com>
Date:   Tue Dec 20 23:14:56 2022 -0500

    Implement blub

commit 3893c521e2538452d3270abd2d2282b628d9a534
Author: Guy Incognito <guy@example.com>
Date:   Tue Dec 20 17:05:57 2022 -0500

    Log when blopping

    This adds a log to most callsites of the `blop` family of functions. We
    don't want to add the logs to the `blop` functions themselves, since
    some calls shouldn't be logged.

commit 469e5ca247fd1e0943d1298863dd9cde63fbe7e0
Author: Guy Incognito <guy@example.com>
Date:   Tue Dec 20 17:01:26 2022 -0500

    Do not blop the flop when stdout is a tty
```

This is OK, but takes up quite a few lines per commit. Luckily, `git log` allows customizing its output.

Pass `--oneline` to `git log` to see just an abbreviated commit ID and the short message:

```text
$ git log --oneline
3afabb0 (HEAD -> main) Merge branch 'blub'
31e2c04 (blub) Implement blub
3893c52 Log when blopping
469e5ca Do not blop the flop when stdout is a tty
4226912 Change threshold for quz level
efdffd6 Only foo when the bar is quzzed
8b89519 Implement foo
0bf5604 Start
```

Much more concise.

Pass `--graph` as well to show an ASCII art rendition of the lineage of your commit history.

```text
$ git log --oneline --graph
*   3afabb0 (HEAD -> main) Merge branch 'blub'
|\
| * 31e2c04 (blub) Implement blub
* | 3893c52 Log when blopping
* | 469e5ca Do not blop the flop when stdout is a tty
* | 4226912 Change threshold for quz level
* | efdffd6 Only foo when the bar is quzzed
|/
* 8b89519 Implement foo
* 0bf5604 Start
```

Not we can clearly see where the `blub` branch diverged from `main`, which commits were on each branch, and when the branch was merged back in.

Pass `--all` to see information about all branches.

```text
$ git log --oneline --graph --all
*   3afabb0 (HEAD -> main) Merge branch 'blub'
|\
| * 31e2c04 (blub) Implement blub
* | 3893c52 Log when blopping
* | 469e5ca Do not blop the flop when stdout is a tty
| | * 73973d5 (frob) Switch on frob flag to 50%
| | * 9f70999 Frob most callsites
| | * e43fd1a Start frobbing
| |/
|/|
* | 4226912 Change threshold for quz level
* | efdffd6 Only foo when the bar is quzzed
|/
* 8b89519 Implement foo
* 0bf5604 Start
```

Now we see there's another branch `frob` that hasn't been merged into `HEAD` yet. (`HEAD` is the currently checked-out commit.)

Pass `--stat` to see a summary of what changed in each commit. Since this is a fake example repo I created for illustrative purposes, you can see all I really did was just update the README for each commit, except on the `blub` branch.

```text
$ git log --oneline --graph --all --stat
*   3afabb0 (HEAD -> main) Merge branch 'blub'
|\
| * 31e2c04 (blub) Implement blub
| |  blub.txt | 1 +
| |  1 file changed, 1 insertion(+)
* | 3893c52 Log when blopping
| |  README.md | 2 +-
| |  1 file changed, 1 insertion(+), 1 deletion(-)
* | 469e5ca Do not blop the flop when stdout is a tty
| |  README.md | 2 +-
| |  1 file changed, 1 insertion(+), 1 deletion(-)
| | * 73973d5 (frob) Switch on frob flag to 50%
| | |  README.md | 2 +-
| | |  1 file changed, 1 insertion(+), 1 deletion(-)
| | * 9f70999 Frob most callsites
| | |  README.md | 2 +-
| | |  1 file changed, 1 insertion(+), 1 deletion(-)
| | * e43fd1a Start frobbing
| |/
|/|
| |    README.md | 2 +-
| |    1 file changed, 1 insertion(+), 1 deletion(-)
* | 4226912 Change threshold for quz level
| |  README.md | 2 +-
| |  1 file changed, 1 insertion(+), 1 deletion(-)
* | efdffd6 Only foo when the bar is quzzed
|/
|    README.md | 2 +-
|    1 file changed, 1 insertion(+), 1 deletion(-)
* 8b89519 Implement foo
|  README.md | 2 +-
|  1 file changed, 1 insertion(+), 1 deletion(-)
* 0bf5604 Start
   README.md | 1 +
   1 file changed, 1 insertion(+)
```

## `git show`: Inspecting an existing commit

You can use `git show` to learn what changes were included in a commit. Pass to `git show` the ID for a commit (or actually any object), which can be:

- a full commit hash
- an abbreviated commit hash
- a branch name
- a tag name
- `HEAD`, which means the currently checked-out commit
- things like `foo~`, which means "one commit before `foo`". `foo` could be any of the identifiers already mentioned, like a branch name, commit hash, or `HEAD`.

Here we use an abbreviated commit hash.

```text
$ git show 3893c52
commit 3893c521e2538452d3270abd2d2282b628d9a534
Author: Guy Incognito <guy@example.com>
Date:   Tue Dec 20 17:05:57 2022 -0500

    Log when blopping

    This adds a log to most callsites of the `blop` family of functions. We
    don't want to add the logs to the `blop` functions themselves, since
    some calls shouldn't be logged.

diff --git a/README.md b/README.md
index ec516d0..70541bd 100644
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
-Tue Dec 20 17:00:33 EST 2022
+Tue Dec 20 17:04:06 EST 2022
```

## Conclusion

There are a great many `git` commands, but these three I've touched on here I find the most helpful when trying to understand the current state of a repository.

All three commands:

- `git status`
- `git log`
- `git show`

are "read-only" commands. This means they will never modify the state of the repository by creating commits, checking out different files in the work tree, etc. They will only report on the state of the repository as it is now. So feel free to use them liberally.

[git]: https://git-scm.com
[xkcd]: https://xkcd.com/1597/
[shit]: https://ohshitgit.com
[taylor]: https://youtu.be/zAiOfWu5xUk?t=24
[guy]: https://youtu.be/7jaAeTaG_ms
