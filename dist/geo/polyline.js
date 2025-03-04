"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const segment_1 = require("./segment");
class Polyline extends segment_1.default {
    constructor() {
        super(...arguments);
        this.points = [];
        this.numberOfPoints = 0;
        this.attributes = [];
    }
    addPoint(point) {
        this.points.push(point);
        this.numberOfPoints++;
    }
    getNumberOfPoints() {
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
    getPointsToDrawPt(point) {
        const tmpPoints = [...this.points];
        tmpPoints.push(point);
        return tmpPoints;
    }
    setInitialPoint(point) {
        this.points[0] = point;
    }
    setEndPoint(point) {
        this.points[this.numberOfPoints - 1] = point;
    }
    getBoundBox() {
        let minX = this.points[0].x;
        let minY = this.points[0].y;
        let minZ = this.points[0].z;
        let maxX = this.points[0].x;
        let maxY = this.points[0].y;
        let maxZ = this.points[0].z;
        for (let i = 1; i < this.numberOfPoints; i++) {
            const x = this.points[i].x;
            const y = this.points[i].y;
            const z = this.points[i].z;
            if (x < minX) {
                minX = x;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (y > maxY) {
                maxY = y;
            }
            if (z < minZ) {
                minZ = z;
            }
            if (z > maxZ) {
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
    getType() {
        return "POLYLINE";
    }
    isUnlimited() {
        return true;
    }
}
exports.default = Polyline;
//# sourceMappingURL=polyline.js.map