import "../base/dark"

function de(x: string): string {
    return atob(x).split("").reverse().join("")
}

function a(x: string): HTMLAnchorElement {
    return document.querySelector(`#${x}`) as HTMLAnchorElement
}

const email = de("dWRlLnVtYy53ZXJkbmFAc2l2YWR6YQ==")
const gh = de("c2l2YWR6YS9tb2MuYnVodGln")
const toDo = [
    {el: a("email"), print: email, href: `mailto:${email}`}
  , {el: a("gh"), print: gh, href: `https://${gh}`}
]

setTimeout(() => {
    for (const {el, print, href} of toDo) {
        el.href = href
        el.setAttribute("data-print", print)
    }
}, 500)
