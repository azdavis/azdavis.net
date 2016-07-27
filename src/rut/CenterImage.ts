import Canvas from "./Canvas"

module CenterImage {
    export const el = new Image()
    // HACK these dimensions are directly from a file
    const w = 214
    const h = 282
    let size = 0.001

    // resize this in a logistically-growing way
    export function move(): void {
        // the standard logistic function
        //
        //     f(x) = 1 / (1 + e^-x)
        //
        // is the solution to the differential equation
        //
        //     df/dx = f(x)(1 - f(x))
        //
        // rearranging yields
        //
        //     df = (df/dx)dx = f(x)(1 - f(x))dx
        //
        // additionally, the f(x) value that is dx away from the current x
        // value is about df away from the current f(x) value
        //
        //     f(x + dx) ≈ f(x) + df
        //
        size += size * (1 - size) * 0.005
    }

    // draw this directly in the center
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

export default CenterImage