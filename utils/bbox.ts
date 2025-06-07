import Point from "../geo/point";
import Triangle from "../geo/triangle";
import Vector from "../geo/vector";

export default class BoundingBox {
    public min: Point;
    public max: Point;

    constructor(min: Point, max: Point){
        this.max = max;
        this.min = min;
    }

    static computeBoundingBox(points: Point[]) {
        let minX: number = Infinity, minY: number = Infinity, minZ: number = Infinity;
        let maxX: number = -Infinity, maxY: number = -Infinity, maxZ: number = -Infinity;

        for(let p of points) {
            if (p.x < minX) {
                minX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            }
            if (p.z < minZ) {
                minZ = p.z;
            }

            if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y > maxY) {
                maxY = p.y;
            }
            if (p.z > maxZ) {
                maxZ = p.z;
            }
        }

        // check if bounding box collapses in one dimension and expand for a minimun
        let epsilon = 0.01;
        if (maxX - minX < epsilon) {
            let center = (maxX + minX) / 2;
            minX = center - epsilon / 2;
            maxX = center + epsilon / 2;
        }
        if (maxY - minY < epsilon) {
            let center = (maxY + minY) / 2;
            minY = center - epsilon / 2;
            maxY = center + epsilon / 2;
        }
        if (maxZ - minZ < epsilon) {
            let center = (maxZ + minZ) / 2;
            minZ = center - epsilon / 2;
            maxZ = center + epsilon / 2;
        }

        return new BoundingBox(new Point(minX, minY, minZ), new Point(maxX, maxY, maxZ));
    }

    clear() {
        let minX: number = Infinity, minY: number = Infinity, minZ: number = Infinity;
        let maxX: number = -Infinity, maxY: number = -Infinity, maxZ: number = -Infinity;
        
        this.min = new Point(minX, minY, minZ);
        this.max = new Point(maxX, maxY, maxZ);
    }

    expandToInclude(box: BoundingBox) {
        this.min.x = Math.min(this.min.x, box.min.x);
        this.min.y = Math.min(this.min.y, box.min.y);
        this.min.z = Math.min(this.min.z, box.min.z);
        this.max.x = Math.max(this.max.x, box.max.x);
        this.max.y = Math.max(this.max.y, box.max.y);
        this.max.z = Math.max(this.max.z, box.max.z);
    }

    intersects(other: BoundingBox): boolean {
        if ((this.max.x <= other.min.x || this.min.x >= other.max.x) ||
            (this.max.y <= other.min.y || this.min.y >= other.max.y) ||
            (this.max.z <= other.min.z || this.min.z >= other.max.z)) {

            return false;
        }

        return true;
    }

    triangleIntersects(triangle: Triangle): boolean {
        const points = [triangle.a, triangle.b, triangle.c];
        for (let i = 0; i < 3; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % 3];

            if (this.min.x <= Math.max(p1.x, p2.x) && this.max.x >= Math.min(p1.x, p2.x) &&
                this.min.y <= Math.max(p1.y, p2.y) && this.max.y >= Math.min(p1.y, p2.y) &&
                this.min.z <= Math.max(p1.z, p2.z) && this.max.z >= Math.min(p1.z, p2.z)) {
                return true;
            }
        }
        return false;
    }

    volume() {
        const dx = this.max.x - this.min.x;
        const dy = this.max.y - this.min.y;
        const dz = this.max.z - this.min.z;

        return dx * dy * dz;
    }

    expandedBbox() {
        let center = this.max.add(this.min).multiply(0.5);

        let newMin = center.subtract(this.min).multiply(1.2).add(center);
        let newMax = center.subtract(this.max).multiply(1.2).add(center);

        const expanded = new BoundingBox(newMin, newMax);

        return expanded
    }
}