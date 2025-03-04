"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Region extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.model = null;
        this.shell = null;
        this.num_shells = 0;
        Region.counter++;
        this.id = Region.counter;
    }
}
Region.counter = 0;
exports.default = Region;
//# sourceMappingURL=region.js.map