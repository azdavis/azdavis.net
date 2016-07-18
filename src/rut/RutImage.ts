import Canvas from "./Canvas"

module RutImage {
    export const el = new Image()
    // HACK these dimensions are directly from the file
    const w = 219
    const h = 292
    let size = 0.001

    export function move(): void {
        size += (size * (1 - size)) * 0.01
    }

    export function draw(): void {
        Canvas.cx.drawImage(
            el, 0, 0, w, h,
            (Canvas.w - size * w) / 2,
            (Canvas.h - size * h) / 2,
            size * w,
            size * h
        )
    }
}

export default RutImage
