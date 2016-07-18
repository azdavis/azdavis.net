import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import Loop from "./Loop"

onresize = Canvas.reset

const audio = new Audio()
audio.loop = true

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
        requestAnimationFrame(Loop)
    }
}

if ("ontouchend" in window) {
    // HACK on iOS, audio/video resources only begin downloading after user
    // interaction (but luckily, after such interaction, events like
    // oncanplaythrough seem to work)
    const loadText = progress.innerHTML
    progress.innerHTML = "Tap Anywhere"
    document.body.ontouchend = () => {
        progress.innerHTML = loadText
        audio.play()
        audio.pause()
    }
}
CenterImage.el.onload = audio.oncanplaythrough = tryStart

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
}, 5000)
