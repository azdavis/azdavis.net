# azdavis.xyz

a place for stuff http://azdavis.xyz

## dependencies

- [npm][npm]
- [entr][ent]

## first-time setup

- `make npm-i-g` installs some global npm packages
- `surge login` prepares deployment to [surge][sur]
- `entr` runs arbitrary commands when files change

## testing, building and deploying

- `make`
    - compiles .ts to .js, .styl to .css, and .pug to .html
    - concatenates compiled assets into one html file
- `./server`
    - opens `$EDITOR` to the current directory
    - starts a server on port 8080 with `static`
    - `open`s your default browser to http://localhost:8080
    - uses `entr` to re-`make` whenever files change
- `make deploy`
    - ensures `git status` has no output
    - `git checkout`s the master branch
    - `make`es everything which is not up-to-date
    - `git push`es master to origin
    - uses `surge .` to upload all built files, images, etc.

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[ent]: http://entrproject.org
[sur]: https://surge.sh
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
