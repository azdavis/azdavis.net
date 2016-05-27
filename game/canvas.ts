import Sprite from './sprite'

class Canvas {
    private ratio = window.devicePixelRatio || 1
    private ctx: CanvasRenderingContext2D
    private elem: HTMLCanvasElement
    width: number
    height: number

    constructor() {
        this.elem = document.createElement('canvas')
        this.ctx = this.elem.getContext('2d')
        this.resize()
        document.body.appendChild(this.elem)
    }

    resize(): void {
        let w = window.innerWidth
        let h = window.innerHeight
        this.width = w
        this.height = h
        this.elem.width = w * this.ratio
        this.elem.height = h * this.ratio
        this.elem.style.width = w + 'px'
        this.elem.style.height = h + 'px'
        this.ctx.scale(this.ratio, this.ratio)
    }

    draw(s: Sprite): void {
        this.ctx.fillStyle = s.fill
        this.ctx.fillRect(s.x, s.y, s.width, s.height)
        this.ctx.strokeStyle = s.stroke
        this.ctx.strokeRect(s.x, s.y, s.width, s.height)
    }

    contains(s: Sprite): boolean {
        return (
            s.x >= 0 &&
            s.x + s.width <= this.width &&
            s.y >= 0 &&
            s.y + s.height <= this.height
        )
    }

    contain(s: Sprite): void {
        if (s.x + s.i <= 0 || s.x + + s.width + s.i >= this.width)
            s.i = 0
        if (s.y + s.j <= 0 || s.y + + s.height + s.j >= this.height)
            s.j = 0
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.elem.width, this.elem.height)
    }
}

export default Canvas
