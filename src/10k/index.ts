const load = document.querySelector("#load") as HTMLElement

addEventListener("DOMContentLoaded", () => {
    load.style.display = "block"
    load.innerHTML = `The benefits are plain to see: this page took ${
        performance.now().toFixed(3)
    } ms to load. That's probably a pretty good speed for your network.`
}, false)
