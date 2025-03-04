"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEV = void 0;
const definitions_1 = require("../definitions");
const edge_1 = require("../edge");
const edgeuse_1 = require("../edgeuse");
const utils_1 = require("../utils");
const vertex_1 = require("../vertex");
const vertexuse_1 = require("../vertexuse");
const operator_1 = require("./operator");
class MEV extends operator_1.default {
    constructor(vertex_begin, region /*, point: Point*/) {
        super();
        this.vertex_begin = vertex_begin;
        this.region = region;
        this.new_edge = new edge_1.default();
        // TODO: add Point on vertex constructor
        this.new_vertex = new vertex_1.default();
    }
    execute() {
        let neweu1 = new edgeuse_1.default();
        let neweu2 = new edgeuse_1.default();
        let newvu1 = new vertexuse_1.default();
        let newvu2;
        // temp topological entities
        let vu_v;
        let eu_v;
        let lu_v;
        let fu_v;
        let s_v; // Shell on region that contain vertex_begin
        const vertexHasUseInRegion = this.vertex_begin.hasUseInRegion(this.region);
        if (!vertexHasUseInRegion.result) {
            return;
        }
        vu_v = vertexHasUseInRegion.vu;
        eu_v = vertexHasUseInRegion.eu;
        lu_v = vertexHasUseInRegion.lu;
        fu_v = vertexHasUseInRegion.fu;
        s_v = vertexHasUseInRegion.s;
        if (vu_v.up == definitions_1.DescType.SHELL) {
            newvu2 = vu_v;
            s_v.vertexuse = null;
            s_v.desc_type = definitions_1.DescType.EDGEUSE;
        }
        else {
            newvu2 = new vertexuse_1.default();
            (0, utils_1.link_vu)(newvu2, this.vertex_begin, definitions_1.DescType.EDGEUSE, this.new_edge, null);
        }
        this.new_edge.edgeuse = neweu1;
        this.new_vertex.vertexuse = newvu1;
        (0, utils_1.fill_vu_edgeuse)(newvu2, this.vertex_begin, neweu1);
        newvu1.next = newvu1;
        newvu1.last = newvu1;
        (0, utils_1.fill_vu_edgeuse)(newvu1, this.new_vertex, neweu2);
        (0, utils_1.fill_eu_shell)(neweu1, newvu2, neweu2, this.new_edge, s_v, definitions_1.Orientation.SAME);
        (0, utils_1.fill_eu_shell)(neweu2, newvu1, neweu1, this.new_edge, s_v, definitions_1.Orientation.OPPOSITE);
        if (!s_v.edgeuse) {
            s_v.edgeuse = utils_1.CircularDoublyLinkedListItem.first(neweu1);
            s_v.edgeuse = s_v.edgeuse.link(neweu2);
        }
        else {
            s_v.edgeuse = s_v.edgeuse.link(neweu1);
            s_v.edgeuse = s_v.edgeuse.link(neweu2);
        }
    }
    unexecute() {
        throw new Error("Method not implemented.");
    }
}
exports.MEV = MEV;
//# sourceMappingURL=mev.js.map