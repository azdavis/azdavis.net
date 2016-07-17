import Canvas from "./Canvas"
import Rut from "./Rut"

onresize = Canvas.reset

// background audio
const audio = new Audio()
audio.loop = true

// center image
const img = new Image()
// HACK these dimensions are directly from the file
const imgW = 219
const imgH = 292
let imgScale = 0.001

// array of Ruts
const rs = []
const rsMax = 50

// main loop
function loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && rs.length < rsMax) {
        rs.push(new Rut())
    }
    for (let i = 0; i < rs.length; i++) {
        rs[i].move()
        rs[i].draw()
        if (rs[i].isOutOfBounds()) {
            rs[i].reset()
        }
    }

    imgScale += (imgScale * (1 - imgScale)) * 0.01
    Canvas.cx.drawImage(
        img,
        0,
        0,
        imgW,
        imgH,
        (Canvas.w - imgScale * imgW) / 2,
        (Canvas.h - imgScale * imgH) / 2,
        imgScale * imgW,
        imgScale * imgH
    )

    requestAnimationFrame(loop)
}

// HACK there's probably a better way to do this
function start(): void {
    audio.play()
    requestAnimationFrame(loop)
}

let tryStart = (() => {
    let load = 0
    return () => {
        load++
        if (load >= 2) {
            start()
        }
    }
})()

audio.oncanplaythrough = tryStart
img.onload = tryStart

// set these last, to make sure `on` functions get called
audio.src = "thor.mp3"
img.src = "rut.png"
