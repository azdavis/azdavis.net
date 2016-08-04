import {$, append, div} from "../base/dom"
import Board from "./Board"
import Canvas from "./Canvas"

const mobile = "ontouchend" in window

$("#msg").remove()
onresize = Board.draw

function makeDrawer(type: string): void {
    const el = div()
    el.innerHTML = type
    function draw(): void {
        Board.drawNew(type)
    }
    if (mobile) {
        el.ontouchend = draw
    } else {
        el.onclick = draw
    }
    append(el, Canvas.btns)
}

makeDrawer("regular")
makeDrawer("expansion")
append(Canvas.btns)
append(Canvas.container)

Board.drawNew("regular")

// HACK makes :active work on iOS
if (mobile) {
    // tslint:disable:no-empty
    document.documentElement.ontouchend = () => {}
    // tslint:enable:no-empty
}
