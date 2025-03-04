"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
const utils_1 = require("./utils");
class EdgeUse extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.vertexUse = null;
        this.mate = null;
        this.edge = null;
        this.orientation = definitions_1.Orientation.UNSPECIFIED;
        this.shell = null;
        this.loopuse = null;
        this.clockwiseEdgeUse = null;
        this.counterClockwiseEdgeUse = null;
        this.radial = null;
        EdgeUse.counter++;
        this.id = EdgeUse.counter;
    }
}
EdgeUse.counter = 0;
exports.default = EdgeUse;
//# sourceMappingURL=edgeuse.js.map