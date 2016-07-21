const s = document.createElement("div")
const u = location.host + location.pathname
s.id = "url"
s.innerHTML = u
document.body.insertBefore(s, document.body.firstChild)
