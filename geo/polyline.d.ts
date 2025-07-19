import Point from "./point";
import Segment from "./segment";
export default class Polyline extends Segment {
    private points;
    private numberOfPoints;
    private edge?;
    private attributes;
    addPoint(point: Point): void;
    getNumberOfPoints(): number;
    isPossible(): boolean;
    getPoints(): Point[];
    getPointsToDraw(): Point[];
    getPointsToDrawPt(point: Point): Point[];
    setInitialPoint(point: Point): void;
    setEndPoint(point: Point): void;
    getBoundBox(): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        minZ: number;
        maxZ: number;
    };
    getType(): string;
    isUnlimited(): boolean;
}
