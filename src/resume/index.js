import "/src/_base/dark"

const decode = x => atob(x).split("").reverse().join("")
const printable = x => x.match(/(mailto:|https?:\/\/|tel:)(.+[^\/]).*/)[2]
const todo = {
	email: "dWRlLnVtYy53ZXJkbmFAc2l2YWR6YTpvdGxpYW0=",
	gh: "c2l2YWR6YS9tb2MuYnVodGlnLy86c3B0dGg=",
	tel: "NjAwMS00MTUtODA5OmxldA=="
}
const links = document.querySelectorAll("a")

setTimeout(() => {
	for (const x in todo) {
		document.getElementById(x).href = decode(todo[x])
	}
	for (let i = 0; i < links.length; i++) {
		const x = links[i]
		x.setAttribute("data-print", printable(x.href))
	}
}, 500)
