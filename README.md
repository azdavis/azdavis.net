# azdavis.xyz

a place for stuff

## building and deploying

1. `make npm-i-g` to install some global [npm][npm] packages
2. `make` to build all html files and their dependencies
3. `surge login` to prepare deployment
4. `make deploy` to deploy

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[w3v]: https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=http%3A%2F%2Fazdavis.xyz%2F
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=azdavis.xyz
