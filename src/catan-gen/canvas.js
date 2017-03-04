const el = document.createElement("canvas")
const cx = el.getContext("2d")
const scale = devicePixelRatio || 1

function resize() {
    el.width = innerWidth * scale
    el.height = innerHeight * scale
    cx.textAlign = "center"
    cx.textBaseline = "middle"
}

function clear() {
    cx.clearRect(0, 0, el.width, el.height)
}

function drawHex(x, y, r, fill) {
    const rOver2 = r / 2
    const rRoot3Over2 = r * 0.866025404 // sqrt(3) / 2
    cx.fillStyle = fill
    cx.beginPath()
    cx.moveTo(x - rRoot3Over2, y - rOver2)
    cx.lineTo(x, y - r)
    cx.lineTo(x + rRoot3Over2, y - rOver2)
    cx.lineTo(x + rRoot3Over2, y + rOver2)
    cx.lineTo(x, y + r)
    cx.lineTo(x - rRoot3Over2, y + rOver2)
    cx.closePath()
    cx.fill()
}

const tau = Math.PI * 2
function drawCircle(x, y, r, fill) {
    cx.fillStyle = fill
    cx.beginPath()
    cx.arc(x, y, r, 0, tau)
    cx.closePath()
    cx.fill()
}

const hs = getComputedStyle(document.documentElement)
const fontWeight = hs.fontWeight
const fontFamily = hs.fontFamily
function drawText(msg, x, y, color, fontSize) {
    cx.fillStyle = color
    cx.font = `${fontWeight} ${fontSize}em ${fontFamily}`
    cx.fillText(msg, x, y)
}

resize()
document.body.appendChild(el)

export default {el, cx, resize, clear, drawHex, drawCircle, drawText}
