import $ from "./base/$"

const s = $("#url")
const u = location.host + location.pathname
s.innerHTML = u
s.style.display = "block"
