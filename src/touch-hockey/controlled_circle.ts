import Circle from "./circle"

class ControlledCircle extends Circle {
    private id: string

    public controlWith(id: string): void {
        this.id = id
    }

    public isControlledBy(id: string): boolean {
        return this.id === id
    }
}

export default ControlledCircle
