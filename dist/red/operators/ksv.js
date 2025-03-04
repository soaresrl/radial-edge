"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msv_1 = require("./msv");
const operator_1 = require("./operator");
class KSV extends operator_1.default {
    constructor(owning_region, new_shell, new_vertex) {
        super();
        this.region = owning_region;
        this.shell = new_shell;
        this.vertex = new_vertex;
    }
    execute() {
        // this.vertex.vertexuse!.next = undefined;
        // this.vertex.vertexuse!.last = undefined;
        this.vertex.vertexuse = null;
        this.shell.vertexuse = null;
        this.shell.desc_type = null;
        if (this.shell.next === this.shell) {
            this.region.shell = null;
            return;
        }
        // TODO: fix this
        if (this.region.shell === this.shell) {
            // this.region.shell = this.shell.next;
            // this.region.shell!.last = this.shell.last;
            this.shell.next.last = this.shell.last;
            this.shell.last.next = this.shell.next;
            this.region.shell = this.shell.next;
        }
        else {
            this.shell.next.last = this.shell.last;
            this.shell.last.next = this.shell.next;
        }
    }
    unexecute() {
        const msv = new msv_1.default(this.region, this.shell, this.vertex);
        msv.execute();
    }
}
exports.default = KSV;
//# sourceMappingURL=ksv.js.map