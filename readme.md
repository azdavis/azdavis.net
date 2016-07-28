# azdavis.xyz

a place for stuff http://azdavis.xyz

[![devDependency Status][img]][inf]

[img]: https://david-dm.org/azdavis/azdavis.xyz/dev-status.svg
[inf]: https://david-dm.org/azdavis/azdavis.xyz#info=devDependencies

## first-time setup

### install dependencies

- [git][git]
- [make][mak]
- [npm][npm]
- [entr][ent]

### `make setup`

- set up some git hooks
- install some [npm devDependencies][inf]
- get some non-git-tracked binary files
- prepare deployment to [surge][sur]

[git]: https://git-scm.com
[mak]: https://www.gnu.org/software/make
[npm]: https://www.npmjs.com
[ent]: http://entrproject.org
[sur]: https://surge.sh

## useful commands

### `make`

- lint and compiles .ts to .js
- lint and compile .styl to .css
- compile .pug to .html
- concatenate compiled assets into one .html file

### `make test`

- start a server on port 8080
- open your default browser to http://localhost:8080
- re-make whenever files change

### `make deploy`

- ensure there are no uncommitted changes
- ensure the current git branch is master
- make everything which is not up-to-date
- git push master to origin
- upload all built files, images, etc.
- report number of files and size of deploy

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
