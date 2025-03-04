"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
const utils_1 = require("./utils");
class FaceUse extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.owningShell = null;
        this.face = null;
        this.mate = null;
        this.loopuse = null;
        this.orientation = definitions_1.Orientation.UNSPECIFIED;
        FaceUse.counter++;
        this.id = FaceUse.counter;
    }
}
FaceUse.counter = 0;
exports.default = FaceUse;
//# sourceMappingURL=faceuse.js.map