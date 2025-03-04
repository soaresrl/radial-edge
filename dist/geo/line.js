"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const segment_1 = require("./segment");
class Line extends segment_1.default {
    constructor(start, end) {
        super();
        this.numberOfPoints = 0;
        this.attributes = [];
        this.start = start;
        this.end = end;
    }
    addPoint(point) {
        if (this.numberOfPoints === 0) {
            this.start = point;
            this.numberOfPoints++;
        }
        else {
            this.end = point;
            this.numberOfPoints++;
        }
    }
    getNumberOfPoints() {
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
    getPointsToDrawPt(point) {
        const tmpPoints = [this.start];
        if (this.numberOfPoints === 2) {
            tmpPoints.push(this.end);
        }
        else if (this.numberOfPoints === 1) {
            tmpPoints.push(point);
        }
        return tmpPoints;
    }
    setInitialPoint(point) {
        this.start = point;
    }
    setEndPoint(point) {
        this.end = point;
    }
    getBoundBox() {
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
        };
    }
    getType() {
        return 'LINE';
    }
}
exports.default = Line;
//# sourceMappingURL=line.js.map