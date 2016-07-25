import {div, prepend} from "./base/dom"

const s = div("url")
s.innerHTML = location.host + location.pathname
prepend(s)
