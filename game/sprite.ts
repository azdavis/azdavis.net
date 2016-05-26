abstract class Sprite {
    elem: HTMLDivElement

    constructor(public x: number, public y: number) {
        this.elem = document.createElement('div')
        this.elem.className = 'sprite'
        this.setStyle()
        document.body.appendChild(this.elem)
    }

    move(dx: number, dy: number): void {
        if (dx == 0 && dy == 0)
            return
        this.x += dx
        this.y += dy
        this.setStyle()
    }

    private setStyle(): void {
        this.elem.style.left = this.x + 'px'
        this.elem.style.top = this.y + 'px'
    }
}

export default Sprite
