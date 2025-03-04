"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Shell extends utils_1.CircularDoublyLinkedListItem {
    constructor(region) {
        super();
        this.region = null;
        this.desc_type = null;
        this.faceuse = null;
        this.vertexuse = null;
        this.edgeuse = null;
        this.region = region;
        Shell.counter++;
        this.id = Shell.counter;
    }
}
Shell.counter = 0;
exports.default = Shell;
//# sourceMappingURL=shell.js.map