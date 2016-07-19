import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import ZoomText from "./ZoomText"

const zt: ZoomText[] = []
const ztMax = 50

// clear the canvas, maybe add a new ZoomText if there aren't already enough,
// draw the CenterImage, then draw all the ZoomText (possibly on top of
// CenterImage)
function Loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && zt.length < ztMax) {
        zt.push(new ZoomText())
    }

    CenterImage.move()
    CenterImage.draw()

    for (let i = 0; i < zt.length; i++) {
        zt[i].move()
        zt[i].draw()
    }

    requestAnimationFrame(Loop)
}

export default Loop
