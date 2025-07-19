import { Orient2D } from "../exact/predicates";

export default class CompGeom {
    static areCollinear(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
        return Orient2D(ax, ay, bx, by, cx, cy) == 0.0
    }
    
    static isLeftSide(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
        return Orient2D(ax, ay, bx, by, cx, cy) > 0.0
    }

    static isRightSide(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
        return Orient2D(ax, ay, bx, by, cx, cy) < 0.0
    }
}