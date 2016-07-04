import Canvas from "./canvas"
import Enemy from "./enemy"
import Player from "./player"

namespace Game {
    // whether the game is running (i.e., playing OR paused)
    export let running = false
    // whether the game is actively being played
    export let playing = false

    export const user = new Player()

    const info = document.querySelector("#info") as HTMLElement
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
        info.style.display = html.style.cursor = ""
        user.stopMoving()
    }

    // updates the info board with the game score, user lives, and user ammo
    // information
    export function updateInfo(): void {
        info.innerHTML = [
            `score: ${score}`,
            `lives: ${user.lives}`,
            `ammo:  ${user.ammo}`,
        ].join("<br>")
    }

    // end the game, show final stats
    function end(): void {
        running = false
        stop()
        user.lives = 0
        info.innerHTML = `score: ${score}`
        info.style.display = "block"
        setTimeout(() => {
            info.innerHTML += "<br>(to restart, press P)"
        }, 1000)
    }

    // position the user in the middle of the canvas, remove all enemies and
    // user bullets, clear the info board
    function reset(): void {
        user.reset()
        user.x = (Canvas.w - user.w) / 2
        user.y = (Canvas.h - user.h) / 2
        enemies = []
        score = timesSinceReload = timesSinceEnemy = 0
        enemySpawnRate = 0.005
        updateInfo()
    }

    // add an enemy, reload, increase the spawn rate
    function addEnemy(): void {
        enemies.push(new Enemy())
        enemySpawnRate += 0.0001
        if (user.ammo < Player.maxAmmo) {
            user.ammo++
            updateInfo()
        }
    }

    // move, draw, and handle collisions for all sprites in the game
    function loop(): void {
        Canvas.clear()

        for (let i = 0; i < user.bullets.length; i++) {
            if (!user.bullets[i]) {
                continue
            }
            user.bullets[i].move()
            user.bullets[i].draw()
            if (!user.bullets[i].isInBounds()) {
                user.bullets[i] = null
            }
        }

        timesSinceEnemy++
        if (timesSinceEnemy >= 20 && Math.random() < enemySpawnRate
         || timesSinceEnemy >= 200) {
            timesSinceEnemy = 0
            addEnemy()
        }

        for (let i = 0; i < enemies.length; i++) {
            if (!enemies[i]) {
                continue
            }
            enemies[i].moveTowards(user)
            enemies[i].draw()
            if (!user.invincible && user.overlaps(enemies[i])) {
                enemies[i] = null
                user.loseLife()
                updateInfo()
                if (user.lives <= 0) {
                    end()
                    return
                }
                continue
            }
            // O(n^2) is the bad
            for (let j = 0; j < user.bullets.length; j++) {
                if (!user.bullets[j]) {
                    continue
                }
                if (enemies[i].overlaps(user.bullets[j])) {
                    score += Enemy.points
                    enemies[i] = user.bullets[j] = null
                    updateInfo()
                    break
                }
            }
        }

        if (user.ammo < Player.maxAmmo) {
            timesSinceReload++
        }
        if (timesSinceReload >= 400) {
            timesSinceReload = 0
            user.ammo++
            updateInfo()
        }
        user.move()
        user.draw()

        loopID = requestAnimationFrame(loop)
    }
}

export default Game
