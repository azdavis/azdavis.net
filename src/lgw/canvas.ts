import {canvas} from "../base/ts/dom"

module Canvas {
    export const {el, cx, pxRatio} = canvas()

    export let w: number
    export let h: number

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        el.width = w * pxRatio
        el.height = h * pxRatio
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        cx.scale(pxRatio, pxRatio)
    }

    // clear the entirety of the canvas
    export function clear(): void {
        cx.clearRect(0, 0, w, h)
    }

    resize()
}

export default Canvas