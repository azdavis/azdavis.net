import Player from './player'
import Enemy from './enemy'

let i = 0
const $ = document.querySelector.bind(document)
const keys = {
    37: 'lt',
    38: 'up',
    39: 'rt',
    40: 'dn'
}
const enemies: Enemy[] = []
const user = new Player(800, 200)
console.log(user.speed)

enemies.push(new Enemy(100, 100))

setInterval((): void => {
    for (i = 0; i < enemies.length; i++)
        enemies[i].moveTowards(user)
})
