const printable = x => x.match(/(mailto:|https?:\/\/|tel:)(.+[^\/])/)[2]
const links = document.querySelectorAll("a")

for (let i = 0; i < links.length; i++) {
	const x = links[i]
	x.setAttribute("data-print", printable(x.href))
}
