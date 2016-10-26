function setDark(): void {
    const hr = new Date().getHours()
    document.documentElement.className
        = hr < 6 || 17 < hr
        ? "dark"
        : ""
}

setDark()
setInterval(setDark, 10000)
