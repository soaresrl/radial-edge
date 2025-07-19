import Line from "../geo/line";
import Point from "../geo/point";
import Triangle from "../geo/triangle";
export default class Intersection {
    /**
     * Computes the intersection of a line segment and a triangle.
     * Returns an array with coordinates [tp, up, vp] if the intersection occurs,
     * or null if there is no intersection.
     */
    static segmentTriangleIntersection(segment: Line, triangle: Triangle): number[];
    static segmentTriangleIntersectionExact(segment: Line, triangle: Triangle): null | Point;
}
