import "../base/dark"

const els = [
    "email"
  , "tel"
  , "gh"
].map(x => document.querySelector(`#${x}`) as HTMLAnchorElement)

const data = [
    "dWRlLnVtYy53ZXJkbmFAc2l2YWR6YQ=="
  , "NjAwMS00MTUtODA5"
  , "c2l2YWR6YS9tb2MuYnVodGln"
].map(x => atob(x).split("").reverse().join(""))

setTimeout(() => {
    els[0].href = `mailto:${data[0]}`
    els[1].href = `tel:${data[1]}`
    els[2].href = `https://${data[2]}`
    els.forEach((el, i) => el.setAttribute("data-print", data[i]))
}, 200)
