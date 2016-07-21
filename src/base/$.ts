function $(q: string): HTMLElement {
    return document.querySelector(q) as HTMLElement
}

export default $
