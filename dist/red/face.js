"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Face extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.faceuse = null;
        Face.counter++;
        this.id = Face.counter;
    }
}
Face.counter = 0;
exports.default = Face;
//# sourceMappingURL=face.js.map