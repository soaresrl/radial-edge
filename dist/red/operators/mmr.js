"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("./operator");
class MMR extends operator_1.default {
    constructor(model, region) {
        super();
        this.model = model;
        this.region = region;
    }
    execute() {
        this.model.region = this.region;
        this.region.model = this.model;
        this.region.next = this.region;
        this.region.last = this.region;
    }
    unexecute() {
        console.log("cannot unexecute MMR");
    }
}
exports.default = MMR;
//# sourceMappingURL=mmr.js.map