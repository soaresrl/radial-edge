"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class VertexUse extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.vertex = null;
        this.shell = null;
        this.loopuse = null;
        this.edgeuse = null;
        VertexUse.counter++;
        this.id = VertexUse.counter;
    }
}
VertexUse.counter = 0;
exports.default = VertexUse;
//# sourceMappingURL=vertexuse.js.map