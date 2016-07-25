import Canvas from "./Canvas"
import CenterImage from "./CenterImage"
import ZoomText from "./ZoomText"

const zts: ZoomText[] = []
const ztsMax = 70

// clear the canvas, maybe add a new ZoomText if there aren't already enough,
// draw the CenterImage, then draw all the ZoomText (possibly on top of
// CenterImage)
function Loop(): void {
    Canvas.clear()

    if (Math.random() < 0.05 && zts.length < ztsMax) {
        zts.push(new ZoomText())
    }

    for (let i = 0; i < zts.length; i++) {
        zts[i].move()
        zts[i].draw()
    }

    CenterImage.move()
    CenterImage.draw()

    requestAnimationFrame(Loop)
}

export default Loop
