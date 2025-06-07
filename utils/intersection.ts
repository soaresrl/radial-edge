import { Orient2D, Orient2DAdapt, Orient3D } from "../exact/predicates";
import Line from "../geo/line";
import Point from "../geo/point";
import Triangle from "../geo/triangle";
import Vector from "../geo/vector";

export default class Intersection {
    /**
     * Computes the intersection of a line segment and a triangle.
     * Returns an array with coordinates [tp, up, vp] if the intersection occurs,
     * or null if there is no intersection.
     */
    static segmentTriangleIntersection(segment: Line, triangle: Triangle) {
        const D = segment.end.subtract(segment.start);
        const E1 = triangle.b.subtract(triangle.a);
        const E2 = triangle.c.subtract(triangle.a);
        const F = segment.start.subtract(triangle.a);
        const K = D.cross(E2);
        const L = F.cross(E1);

        const v = new Vector(E2.dot(L), F.dot(K), D.dot(L)).multiply(1 / E1.dot(K));

        const tp = v.x;
        const up = v.y;
        const vp = v.z;

        return [tp, up, vp];
    }

    static segmentTriangleIntersectionExact(segment: Line, triangle: Triangle): null | Point {
        const a = triangle.a;
        const b = triangle.b;
        const c = triangle.c;

        const r = segment.start;
        const s = segment.end;

        // let abcr = Orient3D(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, r.x, r.y, r.z);
        let rbca = Orient3D(r.x, r.y, r.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z);
        let sbca = Orient3D(s.x, s.y, s.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z);
        // let abcs = Orient3D(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, s.x, s.y, s.z);

        const delta = Orient2D(rbca, sbca, 1, 1, 0, 0);

        const deltaUp = Orient3D(a.x, a.y, a.z, r.x, r.y, r.z, c.x, c.y, c.z, s.x, s.y, s.z);
        const deltaVp = Orient3D(a.x, a.y, a.z, b.x, b.y, b.z, r.x, r.y, r.z, s.x, s.y, s.z);
        const deltaCompWp = Orient2D(deltaVp, deltaUp, -1, 1, 0, 0);

        const cond1 = ((delta * deltaUp) >= 0 && (Math.abs(delta) >= Math.abs(deltaUp)));

        const cond2 = ((delta * deltaVp) >= 0 && (Math.abs(delta) >= Math.abs(deltaVp)));

        const cond3 = Math.abs(deltaCompWp) <= Math.abs(delta)

        if (!(cond1 && cond2 && cond3)) {
            return null; // No intersection
        }

        if (delta !== 0) {
            const deltaTp = Orient3D(r.x, r.y, r.z, b.x, b.y, b.z, c.x, c.y, c.z, a.x, a.y, a.z);
            const tp = deltaTp / delta; // Makes the division as there is no exact arithmetic in this context

            if (tp < 0 || tp > 1) {
                return null; // Intersection point is outside the segment
            }

            return new Point(Orient2D(tp, 0, 1, s.x, 0, r.x), Orient2D(tp, 0, 1, s.y, 0, r.y), Orient2D(tp, 0, 1, s.z, 0, r.z));
        }

        return null
    }
}