# azdavis.xyz

[a place for stuff][]

[a place for stuff]: http://azdavis.xyz

[![devDependency status][]][devDependency info]

[devDependency status]: https://david-dm.org/azdavis/azdavis.xyz/dev-status.svg
[devDependency info]: https://david-dm.org/azdavis/azdavis.xyz?type=dev

## dependencies

- [git][]
- [make][]
- [npm][]
- [entr][]

[git]: https://git-scm.com
[make]: https://www.gnu.org/software/make
[npm]: https://www.npmjs.com
[entr]: http://entrproject.org

## set up

    git clone https://github.com/azdavis/azdavis.xyz
    cd azdavis.xyz
    rm -r .git/hooks
    make setup

## change

    make test &
    $EDITOR <files>
    git add <files>
    git commit
    make deploy

## {con,per}formance

- [w3 validator][]
- [pagespeed insights][]

[w3 validator]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pagespeed insights]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
