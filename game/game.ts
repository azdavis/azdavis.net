import Canvas from './canvas'
import Player from './player'
import Enemy from './enemy'

namespace Game {
    export let running = false
    export const player = new Player()
    const info = <HTMLDivElement>document.querySelector('.info')
    let enemies: Enemy[]
    let loopID: number
    let score = 0

    // start running loop every 2 ms
    export function start(): void {
        if (running) {
            return
        }
        loopID = setInterval(() => loop(), 10)
        running = true
    }

    // stop running loop
    export function stop(): void {
        if (!running) {
            return
        }
        clearInterval(loopID)
        player.i = player.j = 0
        Canvas.clear()
        running = false
    }

    // updates the info board with game score, player lives, and player bullets
    // information
    export function updateInfo(): void {
        info.innerHTML = [
            `score: ${score}`,
            `lives: ${player.lives}`,
            `bullets: ${player.bullets.length}`,
        ].join('<br>')
    }

    // position the player in the middle of the canvas, remove all enemies and
    // player bullets, clear the info board
    function reset(): void {
        player.x = (Canvas.w - player.w) / 2
        player.y = (Canvas.h - player.h) / 2
        enemies = []
        player.bullets = []
        info.innerHTML = ''
    }

    // move, draw, and handle collisions for all sprites in this
    function loop(): void {
        Canvas.clear()
        let i: number
        let j: number
        let b = player.bullets
        let e = enemies
        for (i = 0; i < b.length; i++) {
            if (!b[i]) {
                continue
            }
            b[i].move()
            Canvas.draw(b[i])
            if (!Canvas.weaklyContains(b[i])) {
                b[i] = null
            }
        }
        if (Math.random() < 0.001) {
            e.push(new Enemy(
                Math.floor(Math.random() * Canvas.w),
                Math.floor(Math.random() * Canvas.h)
            ))
        }
        for (i = 0; i < e.length; i++) {
            if (!e[i]) {
                continue
            }
            e[i].moveTowards(player)
            Canvas.draw(e[i])
            // O(n^2) is the bad
            for (j = 0; j < b.length; j++) {
                if (!b[j]) {
                    continue
                }
                if (e[i].isTouching(b[j])) {
                    e[i] = b[j] = null
                    updateInfo()
                    break
                }
            }
        }
        player.getIJ()
        Canvas.stronglyContain(player)
        player.move()
        Canvas.draw(player)
    }

    reset()
    updateInfo()
}

export default Game
