import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import Loop from "./Loop"

onresize = Canvas.reset

const audio = new Audio()
audio.loop = true

const msg = document.querySelector("#msg") as HTMLElement
const loadText = "Loading…"

let loaded = 0
const tryStart = () => {
    loaded++
    // there must be exactly this many occurrences of tryStart being bound to
    // an object's onload event handler
    if (loaded === 2) {
        document.body.style.cursor =
            msg.style.display =
            "none"
        audio.play()
        requestAnimationFrame(Loop)
    }
}

if ("ontouchend" in window) {
    // HACK on iOS, audio/video resources only begin downloading after user
    // interaction (but luckily, after such interaction, events like
    // oncanplaythrough seem to work)
    msg.innerHTML = "Tap Anywhere"
    document.body.ontouchend = () => {
        msg.innerHTML = loadText
        audio.play()
        audio.pause()
    }
} else {
    msg.innerHTML = loadText
}

CenterImage.el.onload = audio.oncanplaythrough = tryStart

audio.src = "ride.mp3"
CenterImage.el.src = "rut.png"

console.log("Ride of the Valkyries https://youtu.be/7AlEvy0fJto")
