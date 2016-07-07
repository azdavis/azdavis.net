import Data from "./data"
import HexTile from "./hex_tile"

namespace Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")

    const container = document.querySelector("#container") as HTMLElement
    let containerH: number
    const btns = document.querySelector("#btns") as HTMLElement

    const pxRatio = devicePixelRatio || 1
    let scale: number

    // resize the canvas to the given w and h while still fitting completely in
    // its container
    export function resize(w: number, h: number): void {
        cx.clearRect(0, 0, w, h)
        containerH = innerHeight - parseInt(getComputedStyle(btns).height, 10)
        container.style.height = `${containerH}px`
        scale = Math.min(innerWidth / w, containerH / h)
        el.width = scale * w * pxRatio
        el.height = scale * h * pxRatio
        el.style.width = `${scale * w}px`
        el.style.height = `${scale * h}px`
        cx.scale(scale * pxRatio, scale * pxRatio)
    }
}

export default Canvas
