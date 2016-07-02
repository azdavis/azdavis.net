namespace Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")

    export let w: number
    export let h: number

    const ratio = devicePixelRatio || 1

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        el.width = w * ratio
        el.height = h * ratio
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        cx.scale(ratio, ratio)
    }

    // clear the entirety of the canvas
    export function clear(): void {
        cx.clearRect(0, 0, w, h)
    }

    resize()
}

export default Canvas
