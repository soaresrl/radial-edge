"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Segment {
    constructor() {
        this._isSelected = false;
        this._numberOfSubdv = 0;
    }
    setNumberOfSubdivisions(numberOfSubdivisions) {
        this._numberOfSubdv = numberOfSubdivisions;
    }
    getNumberOfSubdivisions() {
        return this._numberOfSubdv;
    }
    setSelected(isSelected) {
        this._isSelected = isSelected;
    }
    isSelected() {
        return this._isSelected;
    }
}
exports.default = Segment;
//# sourceMappingURL=segment.js.map