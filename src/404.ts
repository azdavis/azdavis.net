import {mk, prepend} from "./base/dom"

const s = mk("div")
const u = location.host + location.pathname
s.id = "url"
s.innerHTML = u
prepend(s)
