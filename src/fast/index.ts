import {append} from "../base/dom"

import Canvas from "./Canvas"
import Dot from "./Dot"

// 30 dots on screen, always
const dots: Dot[] = []
for (let i = 0; i < 30; i++) {
    dots.push(new Dot())
}

// each frame: clear the canvas, set up dot drawing, then for each dot: draw
// it, move it, and reset it if needed, then request another frame
function anim(): void {
    Canvas.clear()
    for (const d of dots) {
        d.draw()
        d.move()
        if (d.isOutOfBounds()) {
            d.reset()
        }
    }
    requestAnimationFrame(anim)
}

append(Canvas.el)
requestAnimationFrame(anim)
