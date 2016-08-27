import {$, append, div} from "../base/dom"
import isMobile from "../base/isMobile"
import Board from "./Board"
import Canvas from "./Canvas"

$("#msg").remove()
onresize = Board.draw

function mkDrawer(type: string): void {
    const el = div()
    el.innerHTML = type
    el[isMobile ? "ontouchend" : "onclick"] = () => {
        Board.drawNew(type)
    }
    append(el, Canvas.btns)
}

mkDrawer("regular")
mkDrawer("expansion")
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
