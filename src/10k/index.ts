const p = document.createElement("p")
const hr = document.querySelector("hr") as HTMLElement

addEventListener("DOMContentLoaded", () => {
    p.innerHTML = `The benefits are plain to see: this page took ${
        performance.now().toFixed(3)
    } ms to load. That's probably a pretty good speed for your network.`
    document.body.insertBefore(p, hr)
}, false)
