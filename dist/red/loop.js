"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Loop extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.loopuse = null;
        Loop.counter++;
        this.id = Loop.counter;
    }
}
Loop.counter = 0;
exports.default = Loop;
//# sourceMappingURL=loop.js.map