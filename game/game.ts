import Canvas from './canvas'
import Player from './player'
import Enemy from './enemy'

class Game {
    public running = false
    public canvas: Canvas
    public player: Player
    private info: HTMLDivElement
    private enemies: Enemy[]
    private loopID: number
    private score = 0

    // create this, add a canvas, player, info board, resets this, updates info
    public constructor() {
        this.canvas = new Canvas()
        this.player = new Player()
        this.info = <HTMLDivElement>document.querySelector('.info')
        this.reset()
        this.updateInfo()
    }

    // start running loop every 2 ms
    public start(): void {
        if (this.running) {
            return
        }
        this.loopID = setInterval(() => this.loop(), 10)
        this.running = true
    }

    // stop running loop
    public stop(): void {
        if (!this.running) {
            return
        }
        clearInterval(this.loopID)
        this.player.i = this.player.j = 0
        this.canvas.clear()
        this.running = false
    }

    // updates the info board with game score, player lives, and player bullets
    // information
    public updateInfo(): void {
        this.info.innerHTML = [
            `score: ${this.score}`,
            `lives: ${this.player.lives}`,
            `bullets: ${this.player.bullets.length}`,
        ].join('<br>')
    }

    // position the player in the middle of the canvas, remove all enemies and
    // player bullets, clear the info board
    private reset(): void {
        this.player.x = (this.canvas.w - this.player.w) / 2
        this.player.y = (this.canvas.h - this.player.h) / 2
        this.enemies = []
        this.player.bullets = []
        this.info.innerHTML = ''
    }

    // move, draw, and handle collisions for all sprites in this
    private loop(): void {
        this.canvas.clear()
        let i: number
        let j: number
        let b = this.player.bullets
        let e = this.enemies
        for (i = 0; i < b.length; i++) {
            if (!b[i]) {
                continue
            }
            b[i].move()
            this.canvas.draw(b[i])
            if (!this.canvas.weaklyContains(b[i])) {
                b[i] = null
            }
        }
        if (Math.random() < 0.001) {
            e.push(new Enemy(
                Math.floor(Math.random() * this.canvas.w),
                Math.floor(Math.random() * this.canvas.h)
            ))
        }
        for (i = 0; i < e.length; i++) {
            if (!e[i]) {
                continue
            }
            e[i].moveTowards(this.player)
            this.canvas.draw(e[i])
            // O(n^2) is the bad
            for (j = 0; j < b.length; j++) {
                if (!b[j]) {
                    continue
                }
                if (e[i].isTouching(b[j])) {
                    e[i] = b[j] = null
                    this.updateInfo()
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
