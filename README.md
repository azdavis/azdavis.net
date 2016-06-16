# azdavis.xyz

a place for stuff

## testing, building and deploying

- `make npm-i-g` installs some global [npm][npm] packages
- `make` builds all html files and their dependencies (css, js)
- `make test` starts a server and open your browser to localhost:8080
- `surge login` prepares deployment to [surge][sur]
- `make deploy` deploys

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[sur]: https://surge.sh/
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
