"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class LoopUse extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.faceuse = null;
        this.mate = null;
        this.loop = null;
        this.edgeuse = null;
        this.vertexuse = null;
        LoopUse.counter++;
        this.id = LoopUse.counter;
    }
}
LoopUse.counter = 0;
exports.default = LoopUse;
//# sourceMappingURL=loopuse.js.map