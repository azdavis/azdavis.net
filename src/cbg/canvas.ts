import {canvas, div} from "../base/ts/dom"

module Canvas {
    export const {el, cx, pxRatio} = canvas()
    export const container = div("container")
    export const btns = div("btns")

    const i = x => parseInt(x, 10)
    const g = getComputedStyle

    // resize the canvas to the given w and h while still fitting completely in
    // its container
    export function resize(w: number, h: number): void {
        const p = i(g(document.body).paddingTop)
                + i(g(document.body).paddingBottom)
        const b = i(g(btns).height)
                + i(g(btns).marginBottom)
        const ch = innerHeight - p - b
        const cw = innerWidth - p
        const scale = Math.min(cw / w, ch / h)

        cx.clearRect(0, 0, w, h)
        el.width = scale * w * pxRatio
        el.height = scale * h * pxRatio
        container.style.width = `${cw}px`
        container.style.height = `${ch}px`
        el.style.width = `${scale * w}px`
        el.style.height = `${scale * h}px`
        cx.scale(scale * pxRatio, scale * pxRatio)
    }
}

export default Canvas
