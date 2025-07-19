import Point from "../geo/point";
import Triangle from "../geo/triangle";
export default class BoundingBox {
    min: Point;
    max: Point;
    constructor(min: Point, max: Point);
    static computeBoundingBox(points: Point[]): BoundingBox;
    clear(): void;
    expandToInclude(box: BoundingBox): void;
    intersects(other: BoundingBox): boolean;
    triangleIntersects(triangle: Triangle): boolean;
    volume(): number;
    expandedBbox(): BoundingBox;
}
