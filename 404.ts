const s = <HTMLElement>document.querySelector("#url")
const u = location.href
const maxLen = 80
s.innerHTML =
    u.length <= maxLen ?
    u :
    u.substring(0, maxLen - 2) + "…"

s.style.display = "block"
