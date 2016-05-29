import Canvas from './canvas'
import Sprite from './sprite'
import Player from './player'
import Enemy from './enemy'
import Bullet from './bullet'

class Game {
    private enemies: Enemy[]
    private running = false
    private loopID: number
    canvas: Canvas
    player: Player

    // create this, add a canvas and player, and center the player on the
    // canvas
    constructor() {
        this.canvas = new Canvas()
        this.player = new Player()
        this.reset()
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
        this.loopID = setInterval(() => {
            this.loop()
        }, 2)
        this.running = true
    }

    // stop running loop
    stop(): void {
        clearInterval(this.loopID)
        this.player.i = this.player.j = 0
        this.canvas.clear()
        this.running = false
    }

    // position the player in the middle of the canvas, remove all enemies, and
    // remove all bullets
    reset(): void {
        this.player.x = (this.canvas.w - this.player.w) / 2
        this.player.y = (this.canvas.h - this.player.h) / 2
        this.enemies = []
        this.player.bullets = []
    }

    // move, draw, and handle collisions for all sprites in this
    private loop(): void {
        this.canvas.clear()
        let i: number
        let j: number
        let b: Sprite[] = this.player.bullets
        let e: Sprite[] = this.enemies
        for (i = 0; i < b.length; i++) {
            if (!b[i])
                continue
            b[i].move()
            this.canvas.draw(b[i])
            if (!this.canvas.weaklyContains(b[i]))
                b[i] = null
        }
        if (Math.random() < 0.001)
            e.push(new Enemy(
                Math.floor(Math.random() * this.canvas.w),
                Math.floor(Math.random() * this.canvas.h)
            ))
        for (i = 0; i < e.length; i++) {
            if (!e[i])
                continue
            e[i].moveTowards(this.player)
            this.canvas.draw(e[i])
            // O(n^2) is the bad
            for (j = 0; j < b.length; j++) {
                if (!b[j])
                    continue
                if (e[i].isTouching(b[j])) {
                    e[i] = b[j] = null
                    break
                }
            }
        }
        this.canvas.stronglyContain(this.player)
        this.player.move()
        this.canvas.draw(this.player)
    }
}

export default Game
