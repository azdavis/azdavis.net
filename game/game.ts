import Canvas from './canvas'
import Sprite from './sprite'
import Player from './player'
import Enemy from './enemy'
import Bullet from './bullet'

class Game {
    private enemies: Enemy[] = []
    private running = false
    private loopID: number
    canvas: Canvas
    player: Player

    // create this, add a canvas and player, and center the player on the
    // canvas
    constructor() {
        this.canvas = new Canvas()
        this.player = new Player()
        this.player.x = (this.canvas.w - this.player.w) / 2
        this.player.y = (this.canvas.h - this.player.h) / 2
    }

    // switch the running state of this
    toggle(): void {
        if (this.running)
            this.stop()
        else
            this.start()
    }

    // start running loop every 2 ms
    start(): void {
        this.running = true
        this.loopID = setInterval(() => {
            this.loop()
        }, 2)
    }

    // stop running loop, remove all enemies and player.bullets
    stop(): void {
        this.running = false
        clearInterval(this.loopID)
        this.canvas.clear()
        this.player.i = this.player.j = 0
        this.enemies = []
        this.player.bullets = []
    }

    // move, draw, and handle collisions for all sprites in this
    private loop(): void {
        this.canvas.clear()
        let i: number
        let a: Sprite[]
        a = this.player.bullets
        for (i = 0; i < a.length; i++) {
            if (!a[i])
                continue
            a[i].move()
            this.canvas.draw(a[i])
            if (!this.canvas.weaklyContains(a[i]))
                a[i] = null
        }
        a = this.enemies
        for (i = 0; i < a.length; i++) {
            a[i].moveTowards(this.player)
            this.canvas.draw(a[i])
        }
        this.canvas.stronglyContain(this.player)
        this.player.move()
        this.canvas.draw(this.player)
    }
}

export default Game
