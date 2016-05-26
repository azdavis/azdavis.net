import Player from './player'
import Enemy from './enemy'

const $ = document.querySelector.bind(document)
const keys = {
    lt: 37,
    up: 38,
    rt: 39,
    dn: 40
}

const p = new Player(100, 100)
const e = new Enemy(400, 400)

setInterval(() => {
    e.moveTowards(p)
}, 5)
