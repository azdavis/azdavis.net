import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import ZoomText from "./ZoomText"

onresize = Canvas.reset

const audio = new Audio()
audio.loop = true

const rs: ZoomText[] = []
const rsMax = 50

function loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && rs.length < rsMax) {
        rs.push(new ZoomText())
    }

    CenterImage.move()
    CenterImage.draw()

    for (let i = 0; i < rs.length; i++) {
        rs[i].move()
        rs[i].draw()
        if (rs[i].isOutOfBounds()) {
            rs[i].reset()
        }
    }

    requestAnimationFrame(loop)
}

// HACK there's probably a better way to do this
const progress = document.querySelector("#progress") as HTMLElement
progress.style.display = "block"

let load = 0
const tryStart = () => {
    load++
    if (load === 2) {
        document.body.style.cursor =
            progress.style.display =
            "none"
        audio.play()
        requestAnimationFrame(loop)
    }
}

CenterImage.el.onload = tryStart
if ("ontouchend" in window) {
    audio.oncanplaythrough = () => {
        progress.innerHTML = "Tap Anywhere"
        document.body.ontouchend = tryStart
    }
} else {
    audio.oncanplaythrough = tryStart
}

CenterImage.el.src = "rut.png"
audio.src = "thor.mp3"

console.log([
    "background audio is Thor Kills the Destroyer",
    "see here: https://youtu.be/YGNCQUYeAQM",
    "including it on this site is likely copyright infringement",
    "however, I ask that you not sue me",
    "this site gets few to no views anyway",
].join("\n"))

setInterval(() => {
    // something is rotten in the state of Safari
    console.log(audio.readyState)
}, 2000)
