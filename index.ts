const rel = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll("a")
const http = /https?:\/\//
let i
for (i = 0; i < rel.length; i++) {
    if (rel[i].href.match(http)) {
        rel[i].innerHTML = rel[i].href.replace(http, "")
    }
}

document.querySelector("#now").innerHTML = "" + new Date().getFullYear()
