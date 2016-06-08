import Canvas from './canvas'
import Player from './player'
import Enemy from './enemy'

namespace Game {
    export let running = false
    export const canvas = new Canvas()
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
        canvas.clear()
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
        player.x = (canvas.w - player.w) / 2
        player.y = (canvas.h - player.h) / 2
        enemies = []
        player.bullets = []
        info.innerHTML = ''
    }

    // move, draw, and handle collisions for all sprites in this
    function loop(): void {
        canvas.clear()
        let i: number
        let j: number
        let b = player.bullets
        let e = enemies
        for (i = 0; i < b.length; i++) {
            if (!b[i]) {
                continue
            }
            b[i].move()
            canvas.draw(b[i])
            if (!canvas.weaklyContains(b[i])) {
                b[i] = null
            }
        }
        if (Math.random() < 0.001) {
            e.push(new Enemy(
                Math.floor(Math.random() * canvas.w),
                Math.floor(Math.random() * canvas.h)
            ))
        }
        for (i = 0; i < e.length; i++) {
            if (!e[i]) {
                continue
            }
            e[i].moveTowards(player)
            canvas.draw(e[i])
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
        canvas.stronglyContain(player)
        player.move()
        canvas.draw(player)
    }

    reset()
    updateInfo()
}

export default Game
