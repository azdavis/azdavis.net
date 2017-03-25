const clockStyle = document.getElementById("clock").style
clockStyle.display = "block"

function resize() {
    const dim = Math.min(innerWidth, innerHeight) - 40
    clockStyle.width = clockStyle.height = `${dim}px`
    // 8 rows of text
    // 1.3 line-height
    // 8 * 1.3 = 10.4
    clockStyle.fontSize = `${dim / 10.4}px`
    clockStyle.left = `${(innerWidth - dim) / 2}px`
    clockStyle.top = `${(innerHeight - dim) / 2}px`
}

resize()
onresize = resize

const els = {}
"it ha te qu tw fi mi to pa h1 h3 h2 h4 h5 h6 h7 h8 h9 h10 h11 h0 oc"
    .split(" ")
    .forEach(x => {
        els[x] = document.getElementById(x)
    })

function getIdsFor(date) {
    const m = date.getMinutes() + Math.round(date.getSeconds() / 60)
    const h = (date.getHours() + Math.round(m / 60)) % 12
    let ret = `it h${h} `
    if (m >= 58 || m < 3) {
        ret += "oc"
    } else if (m < 8) {
        ret += "fi mi pa"
    } else if (m < 13) {
        ret += "te mi pa"
    } else if (m < 18) {
        ret += "qu pa"
    } else if (m < 23) {
        ret += "tw mi pa"
    } else if (m < 28) {
        ret += "tw fi mi pa"
    } else if (m < 33) {
        ret += "ha pa"
    } else if (m < 38) {
        ret += "tw fi mi to"
    } else if (m < 43) {
        ret += "tw mi to"
    } else if (m < 48) {
        ret += "qu to"
    } else if (m < 53) {
        ret += "te mi to"
    } else {
        ret += "fi mi to"
    }
    return ret.split(" ")
}

let on = []
function tick() {
    const now = new Date()
    const hr = now.getHours()
    document.documentElement.className = hr < 6 || 17 < hr ? "dark" : ""
    on.forEach(x => {
        els[x].className = ""
    })
    on = getIdsFor(now)
    on.forEach(x => {
        els[x].className = "on"
    })
}
setInterval(tick, 1000)

if ("ontouchend" in window) {
    ontouchmove = () => false
}
