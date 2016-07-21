import {mk, prepend} from "./base/dom"

const s = mk("#url")
s.innerHTML = location.host + location.pathname
prepend(s)
