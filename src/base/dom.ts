function $(query: string): HTMLElement {
    return document.querySelector(query) as HTMLElement
}

function mk(arg: string): HTMLElement {
    const [name, id] = arg.split("#")
    const el = document.createElement(
        name.length === 0
        ? "div"
        : name
    )
    if (typeof id !== "undefined") {
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

export {$, mk, append, prepend}
