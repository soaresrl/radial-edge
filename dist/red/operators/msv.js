"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const utils_1 = require("../utils");
const vertexuse_1 = require("../vertexuse");
const ksv_1 = require("./ksv");
const operator_1 = require("./operator");
class MSV extends operator_1.default {
    constructor(owning_region, new_shell, new_vertex) {
        super();
        this.region = owning_region;
        this.shell = new_shell;
        this.vertex = new_vertex;
    }
    execute() {
        const new_vertexuse = new vertexuse_1.default();
        if (!this.region.shell) {
            this.shell.next = this.shell;
            this.shell.last = this.shell;
            this.region.shell = this.shell;
        }
        else {
            this.shell.next = this.region.shell;
            this.shell.last = this.region.shell.last;
            this.region.shell.last.next = this.shell;
            this.region.shell.last = this.shell;
            this.region.shell = this.shell;
        }
        this.shell.region = this.region;
        this.shell.desc_type = definitions_1.DescType.VERTEXUSE;
        this.shell.vertexuse = new_vertexuse;
        this.vertex.vertexuse = new_vertexuse;
        new_vertexuse.next = new_vertexuse;
        new_vertexuse.last = new_vertexuse;
        (0, utils_1.fill_vu_shell)(new_vertexuse, this.vertex, this.shell);
    }
    unexecute() {
        const ksv = new ksv_1.default(this.region, this.shell, this.vertex);
        ksv.execute();
    }
}
exports.default = MSV;
//# sourceMappingURL=msv.js.map