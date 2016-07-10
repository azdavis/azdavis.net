# azdavis.xyz

a place for stuff http://azdavis.xyz

[![devDependency Status](https://david-dm.org/azdavis/azdavis.xyz/dev-status.svg)](https://david-dm.org/azdavis/azdavis.xyz#info=devDependencies)

## first-time setup

- make sure you have
    - [git][git]
    - [make][mak]
    - [npm][npm]
    - [entr][ent]
- `make setup`
    - sets up some git hooks
    - installs some npm devDependencies
    - prepares deployment to [surge][sur]

## useful commands

- `make`
    - lints and compiles .ts to .js
    - compiles .styl to .css
    - compiles .pug to .html
    - concatenates compiled assets into one .html file
- `./server`
    - starts a server on port 8080
    - opens your default browser to http://localhost:8080
    - re-makes whenever files change
- `make deploy`
    - ensures the current git status is empty
    - ensures the current git branch is master
    - makes everything which is not up-to-date
    - git pushes master to origin
    - uploads all built files, images, etc.

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[git]: https://git-scm.com
[mak]: https://www.gnu.org/software/make
[npm]: https://www.npmjs.com
[ent]: http://entrproject.org
[sur]: https://surge.sh
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
