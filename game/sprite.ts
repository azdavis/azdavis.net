abstract class Sprite {
    elem: HTMLDivElement
    speed: number
    width = 50
    height = 50

    constructor(
        public x: number,
        public y: number
    ) {
        this.elem = document.createElement('div')
        this.elem.className = 'sprite'
        this.setStyle()
        document.body.appendChild(this.elem)
    }

    move(dx: number, dy: number): void {
        if (
            this.x + dx <= 0 ||
            this.x + dx >= window.innerWidth - this.width
        )
            dx = 0
        if (
            this.y + dy <= 0 ||
            this.y + dy >= window.innerHeight - this.height
        )
            dy = 0
        if (dx == 0 && dy == 0)
            return
        this.x += dx
        this.y += dy
        this.setStyle()
    }

    moveTowards(p: Sprite): void {
        let dx = p.x - this.x
        let dy = p.y - this.y
        let hyp = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        this.move(
            dx * this.speed / hyp,
            dy * this.speed / hyp
        )
    }

    private setStyle(): void {
        this.elem.style.left = this.x + 'px'
        this.elem.style.top = this.y + 'px'
    }
}

export default Sprite
