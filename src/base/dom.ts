function $(query: string): HTMLElement {
    return document.querySelector(query) as HTMLElement
}

function div(id: string = ""): HTMLDivElement {
    const el = document.createElement("div")
    if (id !== "") {
        el.id = id
    }
    return el
}

function append(el: HTMLElement, to: HTMLElement = document.body): void {
    to.appendChild(el)
}

function prepend(el: HTMLElement, to: HTMLElement = document.body): void {
    to.insertBefore(el, to.firstChild)
}

export {$, div, append, prepend}
