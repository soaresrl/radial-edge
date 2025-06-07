import BoundingBox from "../utils/bbox";
import GeoObject from "./object";
import Point from "./point";
import Vector from "./vector";

export default class Triangle extends GeoObject {
    public a: Point;
    public b: Point;
    public c: Point;

    constructor(a: Point, b: Point, c: Point) {
        super();
        
        this.a = a;
        this.b = b;
        this.c = c;
    }

    intersect(other: Triangle) {
        const p = other.a;
    }

    computeBoundingBox(): BoundingBox {
        return BoundingBox.computeBoundingBox([this.a, this.b, this.c]);
    }

    intersectBBox(box: BoundingBox): boolean {
        // check if the triangle intersects the bounding box without computing the bounding box of the triangle
        const points = [this.a, this.b, this.c];
        for (let i = 0; i < 3; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % 3];

            if (box.min.x <= Math.max(p1.x, p2.x) && box.max.x >= Math.min(p1.x, p2.x) &&
                box.min.y <= Math.max(p1.y, p2.y) && box.max.y >= Math.min(p1.y, p2.y) &&
                box.min.z <= Math.max(p1.z, p2.z) && box.max.z >= Math.min(p1.z, p2.z)) {
                return true;
            }
        }
        return false;
    }

    triBoxOverlap(box: BoundingBox): boolean {
        const boxCenter = box.min.add(box.max).multiply(0.5);
        const boxHalfSize = box.max.subtract(box.min).multiply(0.5);

        const v0 = this.a.subtract(boxCenter);
        const v1 = this.b.subtract(boxCenter);
        const v2 = this.c.subtract(boxCenter);

        const e0 = v1.subtract(v0);
        const e1 = v2.subtract(v1);
        const e2 = v0.subtract(v2);

        const edges = [e0, e1, e2];

        const axisList: Vector[] = [];

        for (const edge of edges) {
            axisList.push(edge.cross(new Vector(1, 0, 0)));
            axisList.push(edge.cross(new Vector(0, 1, 0)));
            axisList.push(edge.cross(new Vector(0, 0, 1)));
        }

        // Test the 9 cross product axes
        for (const axis of axisList) {
            if (axis.x === 0 && axis.y === 0 && axis.z === 0) {
                continue; // Skip degenerate axis
            }
            const p0 = v0.dot(axis);
            const p1 = v1.dot(axis);
            const p2 = v2.dot(axis);

            const r = boxHalfSize.x*Math.abs(axis.x) + boxHalfSize.y*Math.abs(axis.y) + boxHalfSize.z*Math.abs(axis.z);
            const minP = Math.min(p0, p1, p2);
            const maxP = Math.max(p0, p1, p2);
            if (minP > -r || maxP < r) {
                return false;
            }
        }

        let minV = Math.min(v0.x, v1.x, v2.x);
        let maxV = Math.max(v0.x, v1.x, v2.x);
        if (minV > -boxHalfSize.x || maxV < boxHalfSize.x) {
            return false;
        }

        minV = Math.min(v0.y, v1.y, v2.y);
        maxV = Math.max(v0.y, v1.y, v2.y);
        if (minV > -boxHalfSize.y || maxV < boxHalfSize.y) {
            return false;
        }

        minV = Math.min(v0.z, v1.z, v2.z);
        maxV = Math.max(v0.z, v1.z, v2.z);
        if (minV > -boxHalfSize.z || maxV < boxHalfSize.z) {
            return false;
        }

        // Test the triangle normal
        const normal = e0.cross(e1);
        const d = -normal.dot(v0);
        const r = boxHalfSize.x*Math.abs(normal.x) + boxHalfSize.y*Math.abs(normal.y) + boxHalfSize.z*Math.abs(normal.z);
        const s = normal.dot(boxCenter) + d;
        if (Math.abs(s) > r) {
            return false;
        }

        return true;
    }
}
