const hr = new Date().getHours()
if (hr < 6 || 17 < hr) {
	document.documentElement.className = "dark"
}
