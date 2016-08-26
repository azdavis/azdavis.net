import {$, append, div} from "../base/dom"
import isMobile from "../base/isMobile"
import Board from "./Board"
import Canvas from "./Canvas"

$("#msg").remove()
onresize = Board.draw

function makeDrawer(type: string): void {
    const el = div()
    el.innerHTML = type
    function draw(): void {
        Board.drawNew(type)
    }
    if (isMobile) {
        el.ontouchend = draw
    } else {
        el.onclick = draw
    }
    append(el, Canvas.btns)
}

makeDrawer("regular")
makeDrawer("expansion")
append(Canvas.btns)
append(Canvas.el, Canvas.container)
append(Canvas.container)

Board.drawNew("regular")

// HACK makes :active work on iOS
if (isMobile) {
    // tslint:disable:no-empty
    document.documentElement.ontouchend = () => {}
    // tslint:enable:no-empty
}
