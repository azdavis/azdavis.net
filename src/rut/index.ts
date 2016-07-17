import Canvas from "./Canvas"
import Rut from "./Rut"

onresize = Canvas.reset

// background audio (Thor Kills the Destroyer) - this is probably copyright
// infringement, but please do not sue - this website gets few to no hits
// anyway
const audio = new Audio()
audio.loop = true

// triumphant, confident central image
const img = new Image()
// HACK these dimensions are directly from the file
const imgW = 219
const imgH = 292
let imgScale = 0.001

// array of Ruts (max 50 on screen)
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
    // if mobile, the user must tap to begin
    const mobile = document.querySelector("#mobile") as HTMLElement
    mobile.style.display = "block"
    document.body.ontouchend = () => {
        mobile.style.display = "none"
        tryStart()
    }
} else {
    audio.oncanplaythrough = tryStart
}

// set these last, to make sure `on` functions get called
audio.src = "thor.mp3"
img.src = "rut.png"
