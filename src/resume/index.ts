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
    {el: a("email"), href: email, print: `mailto:${email}`}
  , {el: a("gh"), href: gh, print: `https://${gh}`}
]

setTimeout(() => {
    toDo.forEach(x => {
        x.el.href = x.href
        x.el.setAttribute("data-print", x.print)
    })
}, 200)
