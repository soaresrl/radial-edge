export default class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    static fromPoints(start: {
        x: number;
        y: number;
        z: number;
    }, end: {
        x: number;
        y: number;
        z: number;
    }): Vector;
    length(): number;
    normalize(): Vector;
    dot(other: Vector): number;
    cross(other: Vector): Vector;
    add(other: Vector): Vector;
    subtract(other: Vector): Vector;
    multiply(scalar: number): Vector;
    isEqual(other: Vector): boolean;
}
