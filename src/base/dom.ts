function $(query: string): HTMLElement {
    return document.querySelector(query) as HTMLElement
}

function append(el: HTMLElement, to: HTMLElement = document.body): void {
    to.appendChild(el)
}

function canvas(): HTMLCanvasElement {
    return document.createElement("canvas")
}

function div(id: string = ""): HTMLDivElement {
    const el = document.createElement("div")
    if (id !== "") {
        el.id = id
    }
    return el
}

export {$, append, canvas, div}
