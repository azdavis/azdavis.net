import Sprite from './sprite'

namespace Canvas {
    export let w: number
    export let h: number
    const ratio = devicePixelRatio || 1
    const elem = <HTMLCanvasElement>document.querySelector('canvas')
    const ctx = elem.getContext('2d')

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        elem.width = w * ratio
        elem.height = h * ratio
        elem.style.width = w + 'px'
        elem.style.height = h + 'px'
        ctx.scale(ratio, ratio)
    }

    // draw s on the canvas
    export function draw(s: Sprite): void {
        ctx.fillStyle = s.fill
        ctx.fillRect(s.x, s.y, s.w, s.h)
        ctx.strokeStyle = s.stroke
        ctx.strokeRect(s.x, s.y, s.w, s.h)
    }

    // return whether any part of s is inside the canvas
    export function weaklyContains(s: Sprite): boolean {
        return (
            s.x >= 0 &&
            s.x + s.w <= w &&
            s.y >= 0 &&
            s.y + s.h <= h
        )
    }

    // change s's i and j to ensure no part of it is not contained in the
    // canvas (if s is on the canvas boundary and is moving to leave the
    // canvas, reset s's i or j to 0)
    export function stronglyContain(s: Sprite): void {
        if (s.x <= 0 && s.i <= 0 || s.x + s.w >= w && s.i >= 0) {
            s.i = 0
        }
        if (s.y <= 0 && s.j <= 0 || s.y + s.h >= h && s.j >= 0) {
            s.j = 0
        }
    }

    // clear the entirety of the canvas
    export function clear(): void {
        ctx.clearRect(0, 0, w, h)
    }

    // shows or hides the cursor
    export function shouldShowCursor(arg: boolean): void {
        elem.style.cursor = arg ? '' : 'none'
    }

    resize()
}

export default Canvas
