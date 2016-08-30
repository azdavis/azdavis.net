const load = document.querySelector("#load") as HTMLElement

addEventListener("DOMContentLoaded", () => {
    load.style.display = "block"
    load.innerHTML = `The benefits are plain to see: this page took ${
        (performance.now() / 1000).toFixed(3)
    } seconds to load. That's probably a pretty good speed for your network.`
}, false)
