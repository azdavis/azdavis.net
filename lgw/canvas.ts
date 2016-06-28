namespace Canvas {
    const elem = document.querySelector("canvas") as HTMLCanvasElement
    export const ctx = elem.getContext("2d")
    export let w: number
    export let h: number
    const ratio = devicePixelRatio || 1

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        elem.width = w * ratio
        elem.height = h * ratio
        elem.style.width = `${w}px`
        elem.style.height = `${h}px`
        ctx.scale(ratio, ratio)
    }

    // clear the entirety of the canvas
    export function clear(): void {
        ctx.clearRect(0, 0, w, h)
    }

    resize()
}

export default Canvas
