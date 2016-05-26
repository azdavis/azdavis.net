import Player from './player'
import Enemy from './enemy'

let i = 0
const keys = {
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40
}
const enemies: Enemy[] = []
const user = new Player(800, 200)

enemies.push(new Enemy(0, 0))
enemies.push(new Enemy(100, 100))
enemies.push(new Enemy(400, 300))

window.onkeydown = (e): void => {
    switch (e.which) {
    case keys.lt: user.dir.lt = true; break
    case keys.up: user.dir.up = true; break
    case keys.rt: user.dir.rt = true; break
    case keys.dn: user.dir.dn = true; break
    }
}

window.onkeyup = (e): void => {
    switch (e.which) {
    case keys.lt: user.dir.lt = false; break
    case keys.up: user.dir.up = false; break
    case keys.rt: user.dir.rt = false; break
    case keys.dn: user.dir.dn = false; break
    }
}

setInterval((): void => {
    user.move()
    for (i = 0; i < enemies.length; i++)
        enemies[i].moveTowards(user)
})
