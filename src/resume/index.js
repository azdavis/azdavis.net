import "../base/dark"

const $ = x => document.querySelector(x)
const $$ = x => document.querySelectorAll(x)
const decode = x => atob(x).split("").reverse().join("")
const printable = x => x.match(/(mailto:|https?:\/\/|tel:)(.+[^\/]).*/)[2]

setTimeout(() => {
    $("#email").href = decode("dWRlLnVtYy53ZXJkbmFAc2l2YWR6YTpvdGxpYW0=")
    $("#gh").href = decode("c2l2YWR6YS9tb2MuYnVodGlnLy86c3B0dGg=")
    $("#tel").href = decode("NjAwMS00MTUtODA5OmxldA==")
    for (const x of $$("a")) {
        x.setAttribute("data-print", printable(x.href))
    }
}, 500)
