import Sprite from './sprite'

class Canvas {
    private ratio = window.devicePixelRatio || 1
    private ctx: CanvasRenderingContext2D
    private elem: HTMLCanvasElement
    w: number
    h: number

    constructor() {
        this.elem = document.createElement('canvas')
        this.ctx = this.elem.getContext('2d')
        this.resize()
        document.body.appendChild(this.elem)
    }

    resize(): void {
        this.w = window.innerWidth
        this.h = window.innerHeight
        this.elem.width = this.w * this.ratio
        this.elem.height = this.h * this.ratio
        this.elem.style.width = this.w + 'px'
        this.elem.style.height = this.h + 'px'
        this.ctx.scale(this.ratio, this.ratio)
    }

    draw(s: Sprite): void {
        this.ctx.fillStyle = s.fill
        this.ctx.fillRect(s.x, s.y, s.w, s.h)
        this.ctx.strokeStyle = s.stroke
        this.ctx.strokeRect(s.x, s.y, s.w, s.h)
    }

    contains(s: Sprite): boolean {
        return (
            s.x >= 0 &&
            s.x + s.w <= this.w &&
            s.y >= 0 &&
            s.y + s.h <= this.h
        )
    }

    contain(s: Sprite): void {
        if (s.x + s.i <= 0 || s.x + + s.w + s.i >= this.w)
            s.i = 0
        if (s.y + s.j <= 0 || s.y + + s.h + s.j >= this.h)
            s.j = 0
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.w, this.h)
    }
}

export default Canvas
