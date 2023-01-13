---
title: SSH without a password with Kerberos
date: 2022-12-28
desc: Avoid typing your password every time you `ssh`.
---

At [CMU][cmu], we use AFS (Andrew File System) on university-owned servers. Students frequently need to `ssh` into these servers to do schoolwork. It can get annoying to have to type your password every time to do this.

There is a way to set up SSH for password-less authentication. The key (pun slightly intended) is to use Kerberos and store your authentication information once in a special keytab file.

I learned how to do this by reading another [post][], as well as some trial and error.

Note that this method was tested on macOS only, on the day of publication of this post. It may not work on other OSes, and it may break in the future.

This guide is also somewhat CMU-specific, but it should be able to be adapted more generally for other use cases.

## Check your `ktutil`

We're going to be creating a Kerberos keytab file. This keytab file will reside on your local computer, and will allow you to `ssh` into stuff without typing your password.

To manage keytab files, you'll need a command-line program called `ktutil` on your local computer. On my macOS machine, it's pre-installed:

```sh
$ ktutil --version
ktutil (Heimdal 1.5.1apple1)
Copyright 1995-2011 Kungliga Tekniska Högskolan
Send bug-reports to heimdal-bugs@h5l.org
```

## Decide where the keytab file will go

We'll be using `ktutil` to create the keytab file. You'll need to decide where this file should go on your local computer.

My suggestion would be to create a directory called `~/.local` and put your keytab named `keytab` in it:

```sh
$ mkdir -p ~/.local
$ ls ~/.local/keytab
ls: /Users/<USERNAME>/.local/keytab: No such file or directory
```

The usage of `ls` verifies that there is no pre-existing `~/.local/keytab` which would be overwritten with the following steps. Its output will show your local username in place of `<USERNAME>`.

We're now going to create the keytab file.

## Populate the keytab file

Utter the following magical incantation to set up the keytab file.

```sh
$ ktutil \
  -k ~/.local/keytab \
  add \
  -p <ANDREW_USERNAME>@ANDREW.CMU.EDU \
  -e aes256-cts-hmac-sha1-96 \
  -V 1
```

A few caveats:

- If you put your keytab in some other place that wasn't `~/.local/keytab`, change the thing after `-k` to wherever the keytab file is.
- Replace `<ANDREW_USERNAME>` with your CMU Andrew username, not your local computer username.
- You'll need to type and re-type your CMU Andrew password.

Afterwards, you can verify it worked with a usage of the `file` command:

```sh
$ file ~/.local/keytab
/Users/<USERNAME>/.local/keytab: Kerberos Keytab file, realm=ANDREW.CMU.EDU, principal=<ANDREW_USERNAME>/, type=12345, date=Thu Dec 10 01:23:45 2050, kvno=10
```

The specifics might be slightly different, but the bottom line is that it is a valid "Kerberos Keytab" file.

## Set up `ssh` to use the keytab

We'll need to configure SSH to use the keytab file we just created.

`ssh` is configured with the `~/.ssh/config` file. Create that file if it doesn't exist, then add these lines to it, replacing `<ANDREW_USERNAME>` with your username:

```text
Host cmu
  User <ANDREW_USERNAME>
  Hostname unix.andrew.cmu.edu
  GSSAPIAuthentication yes
  GSSAPIDelegateCredentials yes
```

This'll allow you to type

```sh
$ ssh cmu
```

instead of the usual

```sh
$ ssh <ANDREW_USERNAME>@unix.andrew.cmu.edu
```

You may want to add more `Host`s with other `Hostname`s if you e.g. want to use the "shark machines" (not sure if they still use those, but they did from 2016-2020).

The bits with `GSSAPI` tell `ssh` to use Kerberos for authentication for `ssh cmu`.

## Check your shell

The last step will involve adding configuration not for `ssh`, but your shell itself. To know where to add the configuration, you need to know what shell you're using.

Type:

```sh
$ echo $0
```

at the command line to see what shell program you're currently running.

- If it says e.g. `/bin/zsh`, then your configuration will go in `~/.zshrc`.
- If it says e.g. `/bin/bash`, then it'll go in `~/.bashrc` or `~/.bash_profile`.

I'm not sure on the specifics for bash because I don't use bash. The default on macOS is zsh nowadays.

Create the appropriate shell configuration file if it doesn't exist already, so that we can add to it in the next step.

## Add shell configuration

Every time you `ssh`, you'll need to first generate a "ticket" from the keytab file.

You don't technically need to make a new ticket every time, but since tickets expires after some time, it's nice to set up your `ssh` to make a new one every time.

First create a shell function that'll generate a ticket for you. Add this function to the shell configuration file you determined from the previous step:

```sh
get_kerberos_ticket() {
  kinit -t ~/.local/keytab <ANDREW_USERNAME>@ANDREW.CMU.EDU
}
```

Again, you'll need to replace `<ANDREW_USERNAME>`, as well as the path to the keytab if you changed that.

Now, every time you `ssh`, you can manually say `get_kerberos_ticket` to generate a ticket. Like this:

```sh
$ get_kerberos_ticket
$ ssh cmu
```

But you could also set up your shell to do that for you. To do that, add this function to your shell configuration file:

```sh
ssh() {
  get_kerberos_ticket
  command ssh -q "$@"
}
```

This function overrides the `ssh` command. When called, it:

1. Gets a ticket
2. Calls the real `ssh` command with all the arguments passed to the wrapper `ssh` function

Note that the `-q` passed to `ssh` is optional, but I find it nice to quiet down some informational messages from `ssh` that I find overly chatty.

If you use `scp` to transfer files to and from the remote machines, you can set it up with a similar overriding function:

```sh
scp() {
  get_kerberos_ticket
  command scp -q "$@"
}
```

Again, the `-q` is optional.

[cmu]: https://www.cmu.edu
[post]: https://uz.sns.it/~enrico/site/posts/kerberos/password-less-ssh-login-with-kerberos.html
