abstract class Sprite {
    protected fill: string
    public constructor(protected x: number, protected y: number) {}
    public abstract draw(): void
}

export default Sprite
