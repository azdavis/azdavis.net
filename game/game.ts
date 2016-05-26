import Player from './player'
import Enemy from './enemy'
import Canvas from './canvas'

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
        this.running =
            this.player.dir.lt =
            this.player.dir.up =
            this.player.dir.rt =
            this.player.dir.dn =
            false
        clearInterval(this.renderID)
        this.canvas.clear()
    }

    private render(): void {
        this.canvas.clear()
        this.player.move()
        this.canvas.draw(this.player)
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].moveTowards(this.player)
            this.canvas.draw(this.enemies[i])
        }
    }
}

export default Game
