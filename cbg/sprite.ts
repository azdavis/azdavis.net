abstract class Sprite {
    protected fill: string
    public constructor(protected x: number, protected y: number) {}
    protected abstract draw(): void
}

export default Sprite
