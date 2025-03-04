"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Model extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.id = 0;
        this.region = null;
        this.face = null;
        this.loop = null;
        this.edge = null;
        this.vertex = null;
        Model.counter++;
        this.id = Model.counter;
    }
}
Model.counter = 0;
exports.default = Model;
//# sourceMappingURL=model.js.map