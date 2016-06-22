const s = document.querySelector("#url") as HTMLElement
const u = location.host + location.pathname
s.innerHTML = u
s.style.display = "block"
