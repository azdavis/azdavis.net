import $ from "../base/$"
import Board from "./Board"

onresize = Board.draw

function makeDrawer(type: string): void {
    const el = $(`#${type}`)
    el.onclick = () => {
        Board.drawNew(type)
    }
}

makeDrawer("reg")
makeDrawer("exp")

Board.drawNew("reg")

// HACK makes :active work on iOS
// tslint:disable:no-empty
document.documentElement.ontouchend = () => {}
// tslint:enable:no-empty
