# azdavis.xyz

a place for stuff

## testing, building and deploying

- `make npm-i-g` to install some global [npm][npm] packages
- `make` to build all html files and their dependencies (usually css and/or js)
- `make test` to start a web server and open your browser to localhost:8080
- `surge login` to prepare deployment to [surge][sur]
- `make deploy` to deploy

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[sur]: https://surge.sh/
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
