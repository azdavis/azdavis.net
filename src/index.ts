const anchors = document.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>
const http = /https?:\/\//

for (let i = 0; i < anchors.length; i++) {
    if (anchors[i].href.match(http)) {
        anchors[i].innerHTML = anchors[i].href.replace(http, "")
    }
}

const now = document.querySelector("#now") as HTMLElement
const d = new Date()

now.innerHTML = String(d.getFullYear())
