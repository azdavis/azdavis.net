import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import ZoomText from "./ZoomText"

const rs: ZoomText[] = []
const rsMax = 50

function Loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && rs.length < rsMax) {
        rs.push(new ZoomText())
    }

    CenterImage.move()
    CenterImage.draw()

    for (let i = 0; i < rs.length; i++) {
        rs[i].move()
        rs[i].draw()
        if (rs[i].isOutOfBounds()) {
            rs[i].reset()
        }
    }

    requestAnimationFrame(Loop)
}

export default Loop
