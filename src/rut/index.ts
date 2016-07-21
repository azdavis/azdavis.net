import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import Loop from "./Loop"

onresize = Canvas.reset
document.body.appendChild(Canvas.el)

const audio = new Audio()
audio.loop = true

const html = document.documentElement
const msg = document.querySelector("#msg") as HTMLElement
const loadText = "Loading…"

let loaded = 0
const tryStart = () => {
    loaded++
    // there must be exactly this many occurrences of tryStart being bound to
    // an object's onload event handler
    if (loaded === 2) {
        html.style.cursor = "none"
        msg.remove()
        audio.play()
        requestAnimationFrame(Loop)
    }
}

if ("ontouchend" in window) {
    // HACK on iOS, audio/video resources only begin downloading after user
    // interaction (but luckily, after such interaction, events like
    // oncanplaythrough seem to work)
    msg.innerHTML = "Tap Anywhere"
    html.ontouchend = () => {
        msg.innerHTML = loadText
        audio.play()
        audio.pause()
    }
} else {
    msg.innerHTML = loadText
}

CenterImage.el.onload = audio.oncanplaythrough = tryStart

audio.src = "a.mp3"
CenterImage.el.src = "ci.png"

console.log("Ride of the Valkyries https://youtu.be/7AlEvy0fJto")

// HACK I kid you not, if this seemingly pointless line isn't here, Safari
// doesn't start autoplaying on the initial page load the first time the page
// is loaded (any other subsequent loads work)
//
// macOS 10.11.6 (15G31)
// Safari 9.1.2 (11601.7.7)

// tslint:disable:no-empty
setTimeout(() => {}, 9000)
// tslint:enable:no-empty
