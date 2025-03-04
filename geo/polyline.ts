import { Attribute } from "../red/definitions";
import Edge from "../red/edge";
import Point from "./point";
import Segment from "./segment";

export default class Polyline extends Segment {
    private points: Point[] = [];

    private numberOfPoints: number = 0;
    private edge?: Edge;

    private attributes: Attribute[] = [];
    
    addPoint(point: Point){
        this.points.push(point);
        this.numberOfPoints++;
    }

    getNumberOfPoints(){
        return this.numberOfPoints;
    }

    isPossible() {
        return this.numberOfPoints > 1;
    }

    getPoints() {
        return this.points;
    }

    getPointsToDraw() {
        return this.points;
    }

    getPointsToDrawPt(point: Point) {
        const tmpPoints: Point[] = [...this.points];

        tmpPoints.push(point);

        return tmpPoints;
    }

    setInitialPoint(point: Point){
        this.points[0] = point;
    }

    setEndPoint(point: Point){
        this.points[this.numberOfPoints - 1] = point;
    }

    getBoundBox(){
        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let minZ = this.points[0].z;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;
        let maxZ = this.points[0].z;

        for (let i = 1; i < this.numberOfPoints; i++){
            const x = this.points[i].x;
            const y = this.points[i].y;
            const z = this.points[i].z;

            if (x < minX){
                minX = x;
            }

            if (x > maxX){
                maxX = x;
            }

            if (y < minY){
                minY = y;
            }

            if (y > maxY){
                maxY = y;
            }

            if (z < minZ){
                minZ = z;
            }

            if (z > maxZ){
                maxZ = z;
            }
        }

        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            minZ: minZ,
            maxZ: maxZ
        };
    }

    getType(){
        return "POLYLINE";
    }

    isUnlimited(){
        return true;
    }
}