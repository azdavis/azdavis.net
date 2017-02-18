const el = document.createElement("canvas")
const cx = el.getContext("2d")
const dim = {width: 0, height: 0, scale: devicePixelRatio || 1}

const resize = () => {
    el.width = dim.width = innerWidth * dim.scale
    el.height = dim.height = innerHeight * dim.scale
}

const clear = () => {
    cx.clearRect(0, 0, el.width, el.height)
}

resize()
onresize = resize
document.body.appendChild(el)

export default {cx, dim, clear}
