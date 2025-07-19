import Point from "../geo/point";
import Vector from "../geo/vector";
export default class Tesselation {
    static triangleParing(p: number[][]): number[][];
    static ear_Q(i: number, j: number, k: number, p: number[][], isPolyPt: boolean[]): boolean;
    static cw(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean;
    static pointInTriangle(p: number[], t: number[][]): boolean;
    static tesselate2D(polygon: number[][]): number[][];
    static projectPoints(points: Point[], origin: Point, u: Vector, v: Vector): number[][];
    static tesselate3D(polygon: Point[]): number[][];
}
