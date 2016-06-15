let s = <HTMLElement>document.querySelector("span")
let u = location.pathname
if (u.length > 20) {
    u = u.substring(0, 20) + "…"
}
s.innerHTML =  `"${u}"`
