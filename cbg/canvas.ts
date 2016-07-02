namespace Canvas {
    export const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")
    export const center = {x: 0, y: 0}
    const ratio = devicePixelRatio || 1
    let w: number
    let h: number
    const msg = document.querySelector("#msg") as HTMLElement

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        center.x = w / 2
        // because human eyes think the actual center is too low
        center.y = h / 2.2
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

    msg.innerHTML = `${"ontouchend" in window ? "tap" : "click"} anywhere`
    resize()
}

export default Canvas
