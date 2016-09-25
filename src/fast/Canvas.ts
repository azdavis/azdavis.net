import {canvas} from "../base/ts/dom"

module Canvas {
    export const {el, cx, pxRatio} = canvas()
    export let w = 0
    export let h = 0

    const h1 = document.querySelector("h1")

    // make width = window width and height = h1 computed height, then rescale
    export function resize(): void {
        w = innerWidth
        h = parseInt(getComputedStyle(h1).height as string, 10)
        el.width = w * pxRatio
        el.height = h * pxRatio
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        cx.scale(pxRatio, pxRatio)
    }

    // clear the whole canvas
    export function clear(): void {
        cx.clearRect(0, 0, w, h)
    }

    resize()
    onresize = resize
    el.style.top = `${h1.offsetTop}px`
}

export default Canvas
