export default class Vector {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static fromPoints(start: {x: number, y: number, z: number}, end: {x: number, y: number, z: number}): Vector {
        return new Vector(end.x - start.x, end.y - start.y, end.z - start.z);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vector {
        const len = this.length();
        return new Vector(this.x / len, this.y / len, this.z / len);
    }

    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vector): Vector {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    isEqual(other: Vector) {
        return (
            this.x == other.x &&
            this.y == other.y && 
            this.z == other.z
        )
    }
}