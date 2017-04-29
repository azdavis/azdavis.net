const el = document.createElement("canvas")
const cx = el.getContext("2d")
const dim = {width: 0, height: 0, scale: devicePixelRatio || 1}

function resize() {
	dim.width = el.width = innerWidth * dim.scale
	dim.height = el.height = innerHeight * dim.scale
}

function clear() {
	cx.clearRect(0, 0, dim.width, dim.height)
}

resize()
onresize = resize
document.body.appendChild(el)

export default {cx, dim, clear}
