import Data from "./data"
import HexTile from "./hex_tile"

namespace Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")

    const w = Data.tileScale * HexTile.c * 8
    const h = Data.tileScale * HexTile.a * 10
    export const center = {x: w / 2, y: h / 2}

    const msg = document.querySelector("#msg") as HTMLElement
    const container = document.querySelector("#container") as HTMLElement
    const pxRatio = devicePixelRatio || 1
    let scale: number
    let containerH: number

    // resize the canvas to be the size of the window
    export function resize(): void {
        containerH = innerHeight - parseInt(getComputedStyle(msg).height, 10)
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

    msg.innerHTML = `${"ontouchend" in window ? "tap" : "click"} to regenerate`
    resize()
}

export default Canvas
