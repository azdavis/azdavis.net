const rel = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll("a")
const http = /https?:\/\//

let i: number
for (i = 0; i < rel.length; i++) {
    if (rel[i].href.match(http)) {
        rel[i].innerHTML = rel[i].href.replace(http, "")
    }
}

const now = <HTMLElement>document.querySelector("#now")
const html = document.documentElement

function doDateThings(): void {
    const d = new Date()
    const hr = d.getHours()
    now.innerHTML = "" + d.getFullYear()
    html.className =
        5 < hr && hr < 18 ?
        "" :
        "dark"
}

doDateThings()
setInterval(doDateThings, 10000)
