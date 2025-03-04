import { Attribute } from "../red/definitions";
import Point from "./point";
import Segment from "./segment";
export default class Line extends Segment {
    start: Point;
    end: Point;
    private numberOfPoints;
    attributes: Attribute[];
    constructor(start: Point, end: Point);
    addPoint(point: Point): void;
    getNumberOfPoints(): number;
    isPossible(): boolean;
    getPoints(): Point[];
    getPointsToDraw(): Point[];
    getPointsToDrawPt(point: Point): Point[];
    setInitialPoint(point: Point): void;
    setEndPoint(point: Point): void;
    getBoundBox(): {
        xmin: number;
        ymin: number;
        zmin: number;
        xmax: number;
        ymax: number;
        zmax: number;
    };
    getType(): string;
}
