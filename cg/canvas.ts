import Sprite from "./sprite"

namespace Canvas {
    let w: number
    let h: number
    const ratio = devicePixelRatio || 1
    const elem = document.querySelector("canvas") as HTMLCanvasElement
    const ctx = elem.getContext("2d")

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
