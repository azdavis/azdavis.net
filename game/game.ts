import Canvas from './canvas'
import Enemy from './enemy'
import Player from './player'

namespace Game {
    // whether the game is running (i.e., playing OR paused)
    export let running = false
    // whether the game is actively being played
    export let playing = false
    export const player = new Player()
    const info = <HTMLElement>document.querySelector('.info')
    let enemies: Enemy[]
    let loopID: number
    let score: number
    let timesSinceReload: number
    let enemySpawnRate: number

    // start playing loop every 2 ms
    export function start(): void {
        if (playing) {
            return
        }
        loopID = setInterval(() => loop(), 10)
        info.style.display = 'block'
        Canvas.shouldShowCursor(false)
        playing = running = true
    }

    // stop playing loop
    export function stop(): void {
        if (!playing) {
            return
        }
        clearInterval(loopID)
        setTimeout(Canvas.clear, 10)
        info.style.display = ''
        Canvas.shouldShowCursor(true)
        player.stopMoving()
        playing = false
    }

    // updates the info board with the game score, player lives, and player
    // ammo information
    export function updateInfo(): void {
        info.innerHTML = [
            `score: ${score}`,
            `lives: ${player.lives}`,
            `ammo:  ${player.ammo}`,
        ].join('<br>')
    }

    // position the player in the middle of the canvas, remove all enemies and
    // player bullets, clear the info board
    export function reset(): void {
        player.reset()
        player.x = (Canvas.w - player.w) / 2
        player.y = (Canvas.h - player.h) / 2
        enemies = []
        score = 0
        timesSinceReload = 0
        enemySpawnRate = 0.005
        info.style.fontSize = ''
        info.innerHTML = ''
        updateInfo()
    }

    // stop the game, show final stats
    function lose(): void {
        stop()
        player.lives = 0
        info.innerHTML = `score: ${score}`
        info.style.display = 'block'
        setTimeout(() => {
            info.innerHTML += '<br>press P key to restart'
            running = false
        }, 1000)
    }

    // move, draw, and handle collisions for all sprites in the game
    let i: number
    let j: number
    function loop(): void {
        Canvas.clear()
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
        if (Math.random() < enemySpawnRate) {
            enemies.push(new Enemy())
            enemySpawnRate += 0.0001
        }
        for (i = 0; i < enemies.length; i++) {
            if (!enemies[i]) {
                continue
            }
            enemies[i].moveTowards(player)
            Canvas.draw(enemies[i])
            if (player.hasAnyInside(enemies[i])) {
                enemies[i] = null
                player.lives--
                updateInfo()
                if (player.lives <= 0) {
                    lose()
                }
                continue
            }
            // O(n^2) is the bad
            for (j = 0; j < player.bullets.length; j++) {
                if (!player.bullets[j]) {
                    continue
                }
                if (enemies[i].hasAnyInside(player.bullets[j])) {
                    score += enemies[i].points
                    enemies[i] = player.bullets[j] = null
                    updateInfo()
                    break
                }
            }
        }
        timesSinceReload++
        if (timesSinceReload >= 100 && player.ammo < player.maxAmmo) {
            timesSinceReload = 0
            player.ammo++
            updateInfo()
        }
        player.getIJ()
        Canvas.stronglyContain(player)
        player.move()
        Canvas.draw(player)
    }
}

export default Game
