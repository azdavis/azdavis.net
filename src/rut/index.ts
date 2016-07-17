import Canvas from "./Canvas"
import Rut from "./Rut"

onresize = Canvas.reset

const audio = new Audio()
audio.loop = true

const img = new Image()
// HACK these dimensions are directly from the file
const imgW = 219
const imgH = 292
let imgScale = 0.001

const rs = []
const rsMax = 50

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
let loaded = 0
const tryStart = () => {
    loaded++
    if (loaded >= 2) {
        audio.play()
        requestAnimationFrame(loop)
    }
}

img.onload = tryStart
if ("ontouchend" in window) {
    const mobile = document.querySelector("#mobile") as HTMLElement
    mobile.style.display = "block"
    document.body.ontouchend = () => {
        mobile.style.display = "none"
        tryStart()
    }
} else {
    audio.oncanplaythrough = tryStart
}

audio.src = "thor.mp3"
img.src = "rut.png"

console.log([
    "background audio is Thor Kills the Destroyer",
    "including it on this site is likely copyright infringement",
    "however, I ask that you not sue me",
    "this website gets few to no views anyway",
].join("\n"))
