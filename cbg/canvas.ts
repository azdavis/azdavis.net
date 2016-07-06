import Data from "./data"
import HexTile from "./hex_tile"

namespace Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")
    const w = Data.tileScale
            * HexTile.c
            * (2 + (Data.longestRow - 1) * 3)
    const h = Data.tileScale
            * HexTile.a
            * (Data.rows.length + 1)
    export const center = {x: w / 2, y: h / 2}

    const container = document.querySelector("#container") as HTMLElement
    let containerH: number
    const btns = document.querySelector("#btns") as HTMLElement
    const btnsH = parseInt(getComputedStyle(btns).height, 10)

    const pxRatio = devicePixelRatio || 1
    let scale: number

    // resize the canvas to be as large as possible while still fitting
    // completely in its container
    export function resize(): void {
        containerH = innerHeight - btnsH
        container.style.height = `${containerH}px`
        scale = Math.min(innerWidth / w, containerH / h)
        el.width = scale * w * pxRatio
        el.height = scale * h * pxRatio
        el.style.width = `${scale * w}px`
        el.style.height = `${scale * h}px`
        cx.scale(scale * pxRatio, scale * pxRatio)
    }

    // clear the entirety of the canvas
    export function clear(): void {
        cx.clearRect(0, 0, w, h)
    }

    resize()
}

export default Canvas
