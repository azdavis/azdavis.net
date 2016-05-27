import Canvas from './canvas'
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
        this.player.x = (this.canvas.width - this.player.width) / 2
        this.player.y = (this.canvas.height - this.player.height) / 2
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
        })
    }

    stop(): void {
        this.running = false
        this.player.i = this.player.j = 0
        clearInterval(this.renderID)
        this.canvas.clear()
    }

    private render(): void {
        this.canvas.clear()
        let i: number
        for (i = 0; i < this.player.bullets.length; i++) {
            this.player.bullets[i].move()
            this.canvas.draw(this.player.bullets[i])
        }
        for (i = 0; i < this.enemies.length; i++) {
            this.enemies[i].moveTowards(this.player)
            this.canvas.draw(this.enemies[i])
        }
        this.player.move()
        this.canvas.draw(this.player)
    }
}

export default Game
