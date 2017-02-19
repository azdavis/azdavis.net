const el = document.createElement("canvas")
const cx = el.getContext("2d")
const dim = {width: 0, height: 0, scale: devicePixelRatio || 1}

function resize() {
    el.width = dim.width = innerWidth * dim.scale
    el.height = dim.height = innerHeight * dim.scale
}

function clear() {
    cx.clearRect(0, 0, el.width, el.height)
}

function drawHex(x, y, r, fill) {
    const rOver2 = r / 2
    const rRoot3Over2 = r * 0.866025404
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

resize()
onresize = resize
document.body.appendChild(el)

export default {cx, dim, clear, drawHex, drawCircle}
