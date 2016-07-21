function mk(name: string): HTMLElement {
    return document.createElement(name)
}

function append(el: HTMLElement, to: HTMLElement = document.body): void {
    to.appendChild(el)
}

function prepend(el: HTMLElement, to: HTMLElement = document.body): void {
    to.insertBefore(el, to.firstChild)
}

export {mk, append, prepend}
