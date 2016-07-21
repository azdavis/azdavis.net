import Board from "./Board"
import Canvas from "./Canvas"

onresize = Board.draw

function makeDrawer(type: string): void {
    const el = document.createElement("div")
    el.innerHTML = type
    el.onclick = () => {
        Board.drawNew(type)
    }
    Canvas.btns.appendChild(el)
}

makeDrawer("regular")
makeDrawer("expansion")
document.body.appendChild(Canvas.btns)
document.body.appendChild(Canvas.container)

Board.drawNew("regular")

// HACK makes :active work on iOS
// tslint:disable:no-empty
document.documentElement.ontouchend = () => {}
// tslint:enable:no-empty
