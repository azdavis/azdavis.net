const el = document.createElement("canvas")
const cx = el.getContext("2d")
const dim = {width: 0, height: 0, scale: devicePixelRatio || 1}

document.body.appendChild(el)

export default {cx, dim}
