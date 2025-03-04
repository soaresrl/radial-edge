"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mmr_1 = require("./mmr");
const operator_1 = require("./operator");
class KMR extends operator_1.default {
    constructor(model, region) {
        super();
        this.model = model;
        this.region = region;
    }
    execute() {
        console.log("cannot execute KMR");
    }
    unexecute() {
        const mmr = new mmr_1.default(this.model, this.region);
        mmr.execute();
    }
}
exports.default = KMR;
//# sourceMappingURL=kmr.js.map