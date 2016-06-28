import Sprite from "./sprite"

namespace Canvas {
    export const elem = document.querySelector("canvas") as HTMLCanvasElement
    export const ctx = elem.getContext("2d")
    const ratio = devicePixelRatio || 1
    let w: number
    let h: number

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        elem.width = w * ratio
        elem.height = h * ratio
        elem.style.width = w + "px"
        elem.style.height = h + "px"
        ctx.scale(ratio, ratio)
    }

    resize()
}

export default Canvas
