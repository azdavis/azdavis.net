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

    clear(): void {
        this.ctx.clearRect(0, 0, this.elem.width, this.elem.height)
    }
}

export default Canvas
