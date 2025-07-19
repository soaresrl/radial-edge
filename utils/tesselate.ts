import Point from "../geo/point";
import Vector from "../geo/vector";
import CompGeom from "./compgeom";

export default class Tesselation {
    static triangleParing(p: number[][]) {
        let triangles = [];
        let pn = p.length;
        
        let left = [];
        let right = [];
        let isPolyPt: boolean[] = [];

        for (let i = 0; i < pn; i++) {
            left.push(((i - 1) + pn) % pn);
            right.push(((i + 1) + pn) % pn);
            isPolyPt.push(true);            
        }

        let i = pn - 1;

        while (triangles.length < pn - 2) {
            i = right[i]

            if(Tesselation.ear_Q(left[i], i, right[i], p, isPolyPt)) {
                let tri = Array<number>(3);

                tri[0] = left[i];
                tri[1] = i;
                tri[2] = right[i]

                triangles.push(tri);
                isPolyPt[i] = false;

                left[right[i]] = left[i];
                right[left[i]] = right[i];
            }
        }

        return triangles;
    }

    static ear_Q(i: number, j: number, k: number, p: number[][], isPolyPt: boolean[]) {
        let t = new Array<Array<number>>(3)

        t[0] = p[i]
        t[1] = p[j]
        t[2] = p[k]

        if (Tesselation.cw(t[0][0], t[0][1], t[1][0], t[1][1], t[2][0], t[2][1])) {
            return false;
        }

        for (let m = 0; m < p.length; m++) {
            if (isPolyPt[m]) {
                if (p[m] != t[0] && p[m] != t[1] && p[m] != t[2]) {
                    if (Tesselation.pointInTriangle(p[m], t)) {
                        return false;
                    }
                }
            }            
        }

        return true;
    }

    static cw(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
        return !CompGeom.isLeftSide(ax, ay, bx, by, cx, cy);
    }

    static pointInTriangle(p: number[], t: number[][]) {
        for (let i = 0; i < 3; i++) {
            if(CompGeom.isRightSide(t[i][0], t[i][1], t[(i+1) % 3][0], t[(i+1) % 3][1], p[0], p[1])) {
                return false;
            }            
        }

        return true
    }

    static tesselate2D(polygon: number[][]) {
        let triangles: Array<Array<number>> = [];
        let pn = polygon.length;

        let left = [];
        let right = [];
        let isPolyPt: boolean[] = [];

        for (let i = 0; i < pn; i++) {
            left.push(((i - 1) + pn) % pn);
            right.push(((i + 1) + pn) % pn);
            isPolyPt.push(true);     
        }

        let i = pn - 1;

        let currSize = pn;
        let loopCount = 0;

        while (triangles.length < pn - 2) {
            i = right[i];

            if (Tesselation.ear_Q(left[i], i, right[i], polygon, isPolyPt)) {
                let tri = new Array<number>(3);

                tri[0] = left[i];
                tri[1] = i;
                tri[2] = right[i];

                triangles.push(tri);
                isPolyPt[i] = false;

                left[right[i]] = left[i];
                right[left[i]] = right[i];

                currSize -= 1;
                loopCount = 0;
            } else {
                loopCount += 1;
            }

            if (loopCount >= currSize) {
                triangles = [];
                
                return triangles;
            }
        }

        return triangles;
    }

    static projectPoints(points: Point[], origin: Point, u: Vector, v: Vector) {      
        return points.map((p) => {
            return [p.subtract(origin).dot(u), p.subtract(origin).dot(v)];
        });
    }

    static tesselate3D(polygon: Point[]) {
        const normal = (polygon[1].subtract(polygon[0]).cross(polygon[2].subtract(polygon[0]))).normalize();
        let u: Vector;
        let v: Vector;

        u = polygon[1].subtract(polygon[0]).normalize();
        v = normal.cross(u);
        
        const polygon2D = this.projectPoints(polygon, polygon[0], u, v);

        return Tesselation.tesselate2D(polygon2D);
    }
}