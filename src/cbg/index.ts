import {$, append, div} from "../base/dom"
import Board from "./Board"
import Canvas from "./Canvas"

$("#noscript").remove()
onresize = Board.draw

function makeDrawer(type: string): void {
    const el = div()
    el.innerHTML = type
    el.onclick = () => {
        Board.drawNew(type)
    }
    append(el, Canvas.btns)
}

makeDrawer("regular")
makeDrawer("expansion")
append(Canvas.btns)
append(Canvas.container)

Board.drawNew("regular")

// HACK makes :active work on iOS
// tslint:disable:no-empty
document.documentElement.ontouchend = () => {}
// tslint:enable:no-empty
