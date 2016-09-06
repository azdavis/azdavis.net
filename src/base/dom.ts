function $(query: string): HTMLElement {
    return document.querySelector(query) as HTMLElement
}

function append(el: HTMLElement, to: HTMLElement = document.body): void {
    to.appendChild(el)
}

function canvas(): {el: HTMLCanvasElement, cx: CanvasRenderingContext2D} {
    const el = document.createElement("canvas")
    return {
        el,
        cx: el.getContext("2d") as CanvasRenderingContext2D
    }
}

function div(id: string = ""): HTMLDivElement {
    const el = document.createElement("div")
    if (id !== "") {
        el.id = id
    }
    return el
}

export {$, append, canvas, div}
