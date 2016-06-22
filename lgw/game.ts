import Canvas from "./canvas"
import Enemy from "./enemy"
import Player from "./player"

namespace Game {
    // whether the game is running (i.e., playing OR paused)
    export let running = false
    // whether the game is actively being played
    export let playing = false
    export const player = new Player()
    const info = document.querySelector(".info") as HTMLElement
    const html = document.documentElement
    let loopID: number
    let score: number
    let enemies: Enemy[]
    let enemySpawnRate: number
    let timesSinceEnemy: number
    let timesSinceReload: number

    // begin the game, add a single enemy
    export function begin(): void {
        running = true
        reset()
        start()
        setTimeout(addEnemy, 500)
    }

    // end the game, show final stats
    function end(): void {
        running = false
        stop()
        player.lives = 0
        info.innerHTML = `score: ${score}`
        info.style.display = "block"
        setTimeout(() => {
            info.innerHTML += "<br>(to restart, press P)"
        }, 1000)
    }

    // start playing loop every 2 ms
    export function start(): void {
        playing = true
        loopID = requestAnimationFrame(loop)
        info.style.display = "block"
        html.style.cursor = "none"
    }

    // stop playing loop
    export function stop(): void {
        playing = false
        cancelAnimationFrame(loopID)
        Canvas.clear()
        info.style.display =
            html.style.cursor =
            ""
        player.stopMoving()
    }

    // position the player in the middle of the canvas, remove all enemies and
    // player bullets, clear the info board
    function reset(): void {
        player.reset()
        player.x = (Canvas.w - player.w) / 2
        player.y = (Canvas.h - player.h) / 2
        enemies = []
        score = timesSinceReload = timesSinceEnemy = 0
        enemySpawnRate = 0.005
        updateInfo()
    }

    // updates the info board with the game score, player lives, and player
    // ammo information
    export function updateInfo(): void {
        info.innerHTML = [
            `score: ${score}`,
            `lives: ${player.lives}`,
            `ammo:  ${player.ammo}`,
        ].join("<br>")
    }

    function addEnemy(): void {
        enemies.push(new Enemy())
        enemySpawnRate += 0.0001
        if (player.ammo < player.maxAmmo) {
            player.ammo++
            updateInfo()
        }
    }

    // move, draw, and handle collisions for all sprites in the game
    function loop(): void {
        let i: number
        let j: number

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

        timesSinceEnemy++
        updateInfo()
        if (
            timesSinceEnemy >= 20 && Math.random() < enemySpawnRate ||
            timesSinceEnemy >= 200
        ) {
            timesSinceEnemy = 0
            addEnemy()
        }

        for (i = 0; i < enemies.length; i++) {
            if (!enemies[i]) {
                continue
            }
            enemies[i].moveTowards(player)
            Canvas.draw(enemies[i])
            if (!player.invincible && player.hasAnyInside(enemies[i])) {
                enemies[i] = null
                player.loseLife()
                updateInfo()
                if (player.lives <= 0) {
                    end()
                    return
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

        if (player.ammo < player.maxAmmo) {
            timesSinceReload++
        }
        if (timesSinceReload >= 400) {
            timesSinceReload = 0
            player.ammo++
            updateInfo()
        }
        player.calcIJ()
        Canvas.stronglyContain(player)
        player.move()
        Canvas.draw(player)

        loopID = requestAnimationFrame(loop)
    }
}

export default Game
