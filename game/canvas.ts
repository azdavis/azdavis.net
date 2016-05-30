import Sprite from './sprite'

class Canvas {
    public w: number
    public h: number
    private ratio = devicePixelRatio || 1
    private ctx: CanvasRenderingContext2D
    private elem: HTMLCanvasElement

    // create this, resize it, and append it to the document body
    public constructor() {
        this.elem = document.createElement('canvas')
        this.ctx = this.elem.getContext('2d')
        this.resize()
        document.body.appendChild(this.elem)
    }

    // resize this to be the size of the window
    public resize(): void {
        this.w = innerWidth
        this.h = innerHeight
        this.elem.width = this.w * this.ratio
        this.elem.height = this.h * this.ratio
        this.elem.style.width = this.w + 'px'
        this.elem.style.height = this.h + 'px'
        this.ctx.scale(this.ratio, this.ratio)
    }

    // draw s on this
    public draw(s: Sprite): void {
        this.ctx.fillStyle = s.fill
        this.ctx.fillRect(s.x, s.y, s.w, s.h)
        this.ctx.strokeStyle = s.stroke
        this.ctx.strokeRect(s.x, s.y, s.w, s.h)
    }

    // return whether any part of s is inside this
    public weaklyContains(s: Sprite): boolean {
        return (
            s.x >= 0 &&
            s.x + s.w <= this.w &&
            s.y >= 0 &&
            s.y + s.h <= this.h
        )
    }

    // change s's i and j to ensure no part of it is not contained in this
    public stronglyContain(s: Sprite): void {
        if (s.x + s.i <= 0 || s.x + + s.w + s.i >= this.w) {
            s.i = 0
        }
        if (s.y + s.j <= 0 || s.y + + s.h + s.j >= this.h) {
            s.j = 0
        }
    }

    // clear the entirety of this
    public clear(): void {
        this.ctx.clearRect(0, 0, this.w, this.h)
    }
}

export default Canvas
