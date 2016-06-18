# azdavis.xyz

a place for stuff http://azdavis.xyz

## testing, building and deploying

- `make npm-i-g` installs some global [npm][npm] packages
- `make` builds all html files and their dependencies (css, js)
- `./server` does the following:
    - starts a server on port 8080
    - opens your default browser to http://localhost:8080
    - runs `make` every 2 seconds (basically pseudo-filewatching)
- `surge login` prepares deployment to [surge][sur]
- `make deploy` does the following:
    - `git checkout` the master branch
    - `make` everything which is not up-to-date
    - `git push` master to origin
    - `surge .` all built files, images, etc.

## {con,per}formance

- [w3 validator][w3v]
- [pagespeed insights][pag]

[npm]: https://www.npmjs.com
[sur]: https://surge.sh
[w3v]: https://validator.w3.org/nu/?doc=http://azdavis.xyz
[pag]: https://developers.google.com/speed/pagespeed/insights/?url=http://azdavis.xyz
