import Canvas from "./Canvas"
import RutImage from "./RutImage"
import RutText from "./RutText"

onresize = Canvas.reset

const audio = new Audio()
audio.loop = true

const rs: RutText[] = []
const rsMax = 50

function loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && rs.length < rsMax) {
        rs.push(new RutText())
    }

    RutImage.move()
    RutImage.draw()

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
let load = 0
const tryStart = () => {
    load++
    if (load === 2) {
        audio.play()
        requestAnimationFrame(loop)
    }
}

RutImage.el.onload = tryStart
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

RutImage.el.src = "rut.png"
audio.src = "thor.mp3"

console.log([
    "background audio is Thor Kills the Destroyer",
    "including it on this site is likely copyright infringement",
    "however, I ask that you not sue me",
    "this site gets few to no views anyway",
].join("\n"))
