import Vector from "./vector";
export default class Point extends Vector {
    constructor(x: number, y: number, z: number);
    isEqual(other: Point): boolean;
}
