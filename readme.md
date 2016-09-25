# azdavis.xyz

[a place for stuff][]

[a place for stuff]: http://azdavis.xyz

[![devDependency status][]][devDependency info]

[devDependency status]: https://david-dm.org/azdavis/azdavis.xyz/dev-status.svg
[devDependency info]: https://david-dm.org/azdavis/azdavis.xyz?type=dev

## first-time setup

### install dependencies

- [git][]
- [make][]
- [npm][]
- [entr][]

### `make setup`

- set up some git hooks
- install some [npm devDependencies][devDependency info]
- get some non-git-tracked binary files
- prepare deployment to [surge][]

[git]: https://git-scm.com
[make]: https://www.gnu.org/software/make
[npm]: https://www.npmjs.com
[entr]: http://entrproject.org
[surge]: https://surge.sh

## useful commands

### `make`

- lint and compile .ts to .js
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

- [w3 validator][]
- [pagespeed insights][]

[w3 validator]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pagespeed insights]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
