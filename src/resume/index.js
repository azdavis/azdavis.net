import "../base/dark"

const gid = x => document.getElementById(x)
const decode = x => atob(x).split("").reverse().join("")
const printable = x => x.match(/(mailto:|https?:\/\/|tel:)(.+[^\/]).*/)[2]

setTimeout(() => {
    gid("email").href = decode("dWRlLnVtYy53ZXJkbmFAc2l2YWR6YTpvdGxpYW0=")
    gid("gh").href = decode("c2l2YWR6YS9tb2MuYnVodGlnLy86c3B0dGg=")
    gid("tel").href = decode("NjAwMS00MTUtODA5OmxldA==")
    const links = document.querySelectorAll("a")
    for (let i = 0; i < links.length; i++) {
        const x = links[i]
        x.setAttribute("data-print", printable(x.href))
    }
}, 500)
