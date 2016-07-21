import {mk, prepend} from "./base/dom"

const s = mk("#url")
const u = location.host + location.pathname
s.innerHTML = u
prepend(s)
