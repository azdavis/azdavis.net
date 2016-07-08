import Board from "./board"

onresize = Board.draw

function makeDrawer(type: string): void {
    const el = document.querySelector(`#${type}`) as HTMLElement
    el.onclick = () => {
        Board.drawNew(type)
    }
}

makeDrawer("reg")
makeDrawer("exp")

Board.drawNew("reg")

// HACK makes :active work on iOS
document.body.ontouchend = "" as any
