const s = <HTMLElement>document.querySelector("#url")
const u = location.host + location.pathname
s.innerHTML = u
s.style.display = "block"
