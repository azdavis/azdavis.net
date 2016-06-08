import Canvas from './canvas'
import Enemy from './enemy'
import Player from './player'

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

    // updates the info board with game score, player lives, and player ammo
    // information
    export function updateInfo(): void {
        info.innerHTML = [
            `score: ${score}`,
            `lives: ${player.lives}`,
            `ammo: ${player.ammo}`,
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
        for (i = 0; i < player.bullets.length; i++) {
            if (!player.bullets[i]) {
                continue
            }
            player.bullets[i].move()
            Canvas.draw(player.bullets[i])
            if (!Canvas.weaklyContains(player.bullets[i])) {
                player.bullets[i] = null
            }
        }
        if (Math.random() < 0.001) {
            enemies.push(new Enemy(
                Math.floor(Math.random() * Canvas.w),
                Math.floor(Math.random() * Canvas.h)
            ))
        }
        for (i = 0; i < enemies.length; i++) {
            if (!enemies[i]) {
                continue
            }
            enemies[i].moveTowards(player)
            Canvas.draw(enemies[i])
            // O(n^2) is the bad
            for (j = 0; j < player.bullets.length; j++) {
                if (!player.bullets[j]) {
                    continue
                }
                if (enemies[i].isTouching(player.bullets[j])) {
                    enemies[i] = player.bullets[j] = null
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
