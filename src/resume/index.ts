import "../base/dark"

const els = [
    "email"
  , "gh"
].map(x => document.querySelector(`#${x}`) as HTMLAnchorElement)

const data = [
    "dWRlLnVtYy53ZXJkbmFAc2l2YWR6YQ=="
  , "c2l2YWR6YS9tb2MuYnVodGln"
].map(x => atob(x).split("").reverse().join(""))

setTimeout(() => {
    els[0].href = `mailto:${data[0]}`
    els[1].href = `https://${data[1]}`
    els.forEach((el, i) => el.setAttribute("data-print", data[i]))
}, 200)
