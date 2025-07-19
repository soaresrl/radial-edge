import Vector from "./vector";

export default class Point extends Vector {
    constructor(x: number, y: number, z: number){
        super(x, y, z);
    }

    isEqual(other: Point) {
        return (
            this.x == other.x &&
            this.y == other.y && 
            this.z == other.z
        )
    }
}