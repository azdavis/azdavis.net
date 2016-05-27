import Canvas from './canvas'
import Sprite from './sprite'
import Player from './player'
import Enemy from './enemy'
import Bullet from './bullet'

class Game {
    private enemies: Enemy[] = []
    private running = false
    private renderID: number
    canvas: Canvas
    player: Player

    constructor() {
        this.canvas = new Canvas()
        this.player = new Player()
        this.player.x = (this.canvas.w - this.player.w) / 2
        this.player.y = (this.canvas.h - this.player.h) / 2
    }

    toggle(): void {
        if (this.running)
            this.stop()
        else
            this.start()
    }

    start(): void {
        this.running = true
        this.renderID = setInterval(() => {
            this.render()
        }, 2)
    }

    stop(): void {
        this.running = false
        clearInterval(this.renderID)
        this.canvas.clear()
        this.player.i = this.player.j = 0
        this.enemies = []
        this.player.bullets = []
    }

    private render(): void {
        this.canvas.clear()
        let i: number
        let a: Sprite[]
        a = this.player.bullets
        for (i = 0; i < a.length; i++) {
            if (!a[i])
                continue
            a[i].move()
            this.canvas.draw(a[i])
            if (!this.canvas.contains(a[i]))
                a[i] = null
        }
        a = this.enemies
        for (i = 0; i < a.length; i++) {
            a[i].moveTowards(this.player)
            this.canvas.draw(a[i])
        }
        this.canvas.contain(this.player)
        this.player.move()
        this.canvas.draw(this.player)
    }
}

export default Game
