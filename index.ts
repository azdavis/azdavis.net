const rel = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll("a")
const http = /https?:\/\//

let i: number
for (i = 0; i < rel.length; i++) {
    if (rel[i].href.match(http)) {
        rel[i].innerHTML = rel[i].href.replace(http, "")
    }
}

interface CSSStyleDeclaration {
    webkitFontSmoothing: string
    MozOsxFontSmoothing: string
}

const now = <HTMLElement>document.querySelector("#now")
const html = document.documentElement

function doDateThings(): void {
    const d = new Date()
    const hr = d.getHours()
    now.innerHTML = "" + d.getFullYear()
    if (hr <= 5 || hr >= 18) {
        html.style.backgroundColor = "#222"
        html.style.color = "#ddd"
        html.style.MozOsxFontSmoothing = "grayscale"
        html.style.webkitFontSmoothing = "antialiased"
    } else {
        html.style.backgroundColor =
            html.style.color =
            html.style.MozOsxFontSmoothing =
            html.style.webkitFontSmoothing =
            ""
    }
}

doDateThings()
setInterval(doDateThings, 10000)
