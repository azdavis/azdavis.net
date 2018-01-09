var anchors = document.querySelectorAll("a")
var i

var rmRes = [/^https?:\/\//, /^tel:/, /^mailto:/]
function fix(x) {
	var ret = x
	var i
	for (var i = 0; i < rmRes.length; i++) {
		ret = ret.replace(rmRes[i], "")
	}
	return ret
}

for (i = 0; i < anchors.length; i++) {
	anchors[i].setAttribute("data-print", fix(anchors[i].href))
}
