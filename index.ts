const rel = document.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>
const http = /https?:\/\//

let i: number
for (i = 0; i < rel.length; i++) {
    if (rel[i].href.match(http)) {
        rel[i].innerHTML = rel[i].href.replace(http, "")
    }
}

const now = document.querySelector("#now") as HTMLElement
const html = document.documentElement

function doDateThings(): void {
    const d = new Date()
    const hr = d.getHours()
    now.innerHTML = String(d.getFullYear())
    html.className =
        5 < hr && hr < 18 ?
        "" :
        "dark"
}

doDateThings()
setInterval(doDateThings, 30000)
