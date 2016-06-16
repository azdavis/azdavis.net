const s = <HTMLElement>document.querySelector("#url")
const u = location.pathname
const maxLen = 20
s.innerHTML = `"${
    u.length <= maxLen ?
    u :
    u.substring(0, maxLen) + "…"
}"`
