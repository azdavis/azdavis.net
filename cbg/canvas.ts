import Data from "./data"
import HexTile from "./hex_tile"

namespace Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")
    const container = document.querySelector("#container") as HTMLElement
    const btns = document.querySelector("#btns") as HTMLElement
    const pxRatio = devicePixelRatio || 1

    function css(el: HTMLElement, prop: string): number {
        return parseInt(getComputedStyle(el)[prop], 10)
    }

    // resize the canvas to the given w and h while still fitting completely in
    // its container
    export function resize(w: number, h: number): void {
        const p = 2 * css(document.body, "padding")
        const b = css(btns, "height") + css(btns, "marginBottom")
        const ch = innerHeight - p - b
        const cw = innerWidth - p
        const scale = Math.min(cw / w, ch / h)

        cx.clearRect(0, 0, w, h)
        container.style.width = `${cw}px`
        container.style.height = `${ch}px`
        el.width = scale * w * pxRatio
        el.height = scale * h * pxRatio
        el.style.width = `${scale * w}px`
        el.style.height = `${scale * h}px`
        cx.scale(scale * pxRatio, scale * pxRatio)
    }
}

export default Canvas
