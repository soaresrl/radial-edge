import { Attribute } from "../red/definitions";
import Point from "./point";
import Segment from "./segment";

export default class Line extends Segment {
    public start: Point;
    public end: Point;

    private numberOfPoints: number = 0;

    public attributes: Attribute[] = [];

    constructor(start: Point, end: Point){
        super();

        this.start = start;
        this.end = end;
    }

    addPoint(point: Point){
        if(this.numberOfPoints === 0){
            this.start = point;
            
            this.numberOfPoints++;
        } else {
            this.end = point;

            this.numberOfPoints++;
        }
    }

    getNumberOfPoints(){
        return this.numberOfPoints;
    }

    isPossible() {
        return !(this.numberOfPoints < 2);
    }

    getPoints() {
        if (this.numberOfPoints === 1) {
            return [this.start];
        }

        return [this.start, this.end];
    }

    getPointsToDraw() {
        return [this.start, this.end];
    }

    getPointsToDrawPt(point: Point) {
        const tmpPoints: Point[] = [this.start];

        if (this.numberOfPoints === 2) {
            tmpPoints.push(this.end);
        } else if (this.numberOfPoints === 1) {
            tmpPoints.push(point);
        }

        return tmpPoints;
    }

    setInitialPoint(point: Point){
        this.start = point;
    }

    setEndPoint(point: Point){
        this.end = point;
    }

    getBoundBox(){ 
        const xmin = Math.min(this.start.x, this.end.x);
        const ymin = Math.min(this.start.y, this.end.y);
        const zmin = Math.min(this.start.z, this.end.z);
        const xmax = Math.max(this.start.x, this.end.x);
        const ymax = Math.max(this.start.y, this.end.y);
        const zmax = Math.max(this.start.z, this.end.z);
        
        return {
            xmin,
            ymin,
            zmin,
            xmax,
            ymax,
            zmax
        }
    }

    getType() {
        return 'LINE';
    }
}