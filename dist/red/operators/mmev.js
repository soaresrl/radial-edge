"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const edgeuse_1 = require("../edgeuse");
const utils_1 = require("../utils");
const vertexuse_1 = require("../vertexuse");
const operator_1 = require("./operator");
class MMEV extends operator_1.default {
    constructor(v, e, direction, face, orient, new_edge, new_vertex) {
        super();
        this.existing_edge = null;
        this.existing_vertex = v;
        this.existing_edge = e;
        this.direction = direction;
        this.face = face;
        this.new_edge = new_edge;
        this.new_vertex = new_vertex;
        this.orient = orient;
    }
    execute() {
        let { eu: eu_v, vu: vu_v, lu: lu_v, fu: fu_v, result } = this.existing_vertex.liesOnFace(this.face);
        if (!result) {
            return;
        }
        if (this.existing_edge) {
            const { result: result_e } = (() => {
                if (this.direction == definitions_1.Direction.CW || this.direction == definitions_1.Direction.CCW) {
                    return this.existing_edge.liesOnFace(this.face);
                }
                return {
                    eu: null,
                    lu: null,
                    fu: null,
                    result: false
                };
            })();
            if (!result_e) {
                return;
            }
        }
        if (this.orient != definitions_1.Orientation.UNSPECIFIED && fu_v.orientation != this.orient) {
            lu_v = lu_v.mate;
            fu_v = fu_v.mate;
            if (eu_v) {
                eu_v = eu_v.mate;
            }
        }
        let neweu1 = new edgeuse_1.default();
        let neweu2 = new edgeuse_1.default();
        let neweu3 = new edgeuse_1.default();
        let neweu4 = new edgeuse_1.default();
        let newvu1 = new vertexuse_1.default();
        let newvu2 = new vertexuse_1.default();
        this.new_edge.edgeuse = neweu1;
        this.new_vertex.vertexuse = newvu2;
        newvu1.next = newvu2;
        newvu1.last = newvu2;
        (0, utils_1.fill_vu_edgeuse)(newvu1, this.new_vertex, neweu2);
        newvu2.next = newvu1;
        newvu2.last = newvu1;
        (0, utils_1.fill_vu_edgeuse)(newvu2, this.new_vertex, neweu4);
        if (!eu_v) {
            let vu3;
            let vu4;
            vu3 = lu_v.vertexuse;
            vu4 = lu_v.mate.vertexuse;
            (0, utils_1.fill_eu_loopuse)(neweu1, vu3, neweu4, this.new_edge, lu_v, neweu2, neweu2, neweu2, definitions_1.Orientation.SAME);
            (0, utils_1.fill_eu_loopuse)(neweu2, newvu1, neweu3, this.new_edge, lu_v, neweu1, neweu1, neweu1, definitions_1.Orientation.OPPOSITE);
            (0, utils_1.fill_eu_loopuse)(neweu3, vu4, neweu2, this.new_edge, lu_v.mate, neweu4, neweu4, neweu4, definitions_1.Orientation.SAME);
            (0, utils_1.fill_eu_loopuse)(neweu4, newvu2, neweu1, this.new_edge, lu_v.mate, neweu3, neweu3, neweu3, definitions_1.Orientation.OPPOSITE);
            vu3.up = definitions_1.DescType.EDGEUSE;
            vu3.edgeuse = neweu1;
            vu4.up = definitions_1.DescType.EDGEUSE;
            vu4.edgeuse = neweu3;
            // TODO: Decide to remove previous loopuse as down ptr type is now edgeuse
            // vu3!.loopuse = null; 
            lu_v.down = definitions_1.DescType.EDGEUSE;
            lu_v.edgeuse = neweu1;
            lu_v.mate.down = definitions_1.DescType.EDGEUSE;
            lu_v.mate.edgeuse = neweu3;
            // TODO: Decide to remove previous vertex use as down ptr type is now edgeuse
            // lu_v!.vertexuse = null; 
        }
        else {
            let newvu3 = new vertexuse_1.default();
            let newvu4 = new vertexuse_1.default();
            (0, utils_1.fill_eu_loopuse)(neweu1, newvu3, neweu4, this.new_edge, lu_v, null, null, neweu2, definitions_1.Orientation.SAME);
            (0, utils_1.fill_eu_loopuse)(neweu2, newvu1, neweu3, this.new_edge, lu_v, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
            (0, utils_1.fill_eu_loopuse)(neweu3, newvu4, neweu2, this.new_edge, lu_v.mate, null, null, neweu4, definitions_1.Orientation.SAME);
            (0, utils_1.fill_eu_loopuse)(neweu4, newvu2, neweu1, this.new_edge, lu_v.mate, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
            (0, utils_1.fill_vu_edgeuse)(newvu3, this.existing_vertex, neweu1);
            (0, utils_1.fill_vu_edgeuse)(newvu4, this.existing_vertex, neweu3);
            (0, utils_1.link_vu)(newvu3, this.existing_vertex, definitions_1.DescType.EDGEUSE, this.new_edge, null);
            (0, utils_1.link_vu)(newvu4, this.existing_vertex, definitions_1.DescType.EDGEUSE, this.new_edge, null);
            (0, utils_1.link_wing)(this.existing_vertex, this.existing_edge, this.direction, lu_v, neweu1, neweu2, neweu3, neweu4, true);
        }
    }
    unexecute() {
    }
}
exports.default = MMEV;
//# sourceMappingURL=mmev.js.map