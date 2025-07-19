import BoundingBox from "../utils/bbox";
import GeoObject from "./object";
import Point from "./point";
export default class Triangle implements GeoObject {
    a: Point;
    b: Point;
    c: Point;
    constructor(a: Point, b: Point, c: Point);
    intersect(other: Triangle): void;
    computeBoundingBox(): BoundingBox;
    intersectBBox(box: BoundingBox): boolean;
    triBoxOverlap(box: BoundingBox): boolean;
}
