import Canvas from "./canvas"
import CenterImage from "./center_image"
import ZoomText from "./zoom_text"

const zts: ZoomText[] = []
const ztsMax = 70

// clear the canvas, maybe add a new ZoomText if there aren't already enough,
// draw all the ZoomText, then draw the CenterImage on top
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
