"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const faceuse_1 = require("../faceuse");
const loopuse_1 = require("../loopuse");
const utils_1 = require("../utils");
const vertexuse_1 = require("../vertexuse");
const operator_1 = require("./operator");
class MRSFL extends operator_1.default {
    constructor(v, owning_region, newR, newS, newF, newL) {
        super();
        this.vertex = v;
        this.region = owning_region;
        this.newRegion = newR;
        this.newShell = newS;
        this.newFace = newF;
        this.newLoop = newL;
    }
    execute() {
        const vertexHasUseInRegion = this.vertex.hasUseInRegion(this.region);
        if (!vertexHasUseInRegion.result) {
            return;
        }
        // create necessary descriptors for the new entities;
        const newfu1 = new faceuse_1.default();
        const newfu2 = new faceuse_1.default();
        const newlu1 = new loopuse_1.default();
        const newlu2 = new loopuse_1.default();
        const newvu1 = new vertexuse_1.default();
        const newvu2 = new vertexuse_1.default();
        // Update doubly linked list of models' regions
        this.newRegion.next = this.region.model.region;
        this.newRegion.last = this.region.model.region.last;
        this.region.model.region.last.next = this.newRegion;
        this.region.model.region.last = this.newRegion;
        this.region.model.region = this.newRegion;
        // set the owning model and the shell list ptr for the new region
        this.newRegion.model = this.region.model;
        this.newRegion.shell = this.newShell;
        (0, utils_1.fill_s_faceuse)(this.newShell, this.newRegion, newfu1);
        this.newFace.faceuse = newfu1;
        this.newLoop.loopuse = newlu1;
        newfu1.next = newfu1;
        newfu1.last = newfu1;
        (0, utils_1.fill_fu)(newfu1, this.newShell, newfu2, newlu1, definitions_1.Orientation.INSIDE, this.newFace);
        newlu1.next = newlu1;
        newlu1.last = newlu1;
        (0, utils_1.fill_lu_vertexuse)(newlu1, newfu1, newlu2, this.newLoop, newvu1);
        (0, utils_1.fill_vu_loopuse)(newvu1, this.vertex, newlu1);
        if (vertexHasUseInRegion.vu.up == definitions_1.DescType.SHELL) {
            /*	first the case where this vertex was the only thing
                on the existing shell				*/
            /*	we put the existing vertex use on the outside loop	*/
            newfu2.next = newfu2;
            newfu2.last = newfu2;
            (0, utils_1.fill_fu)(newfu2, vertexHasUseInRegion.s, newfu1, newlu2, definitions_1.Orientation.OUTSIDE, this.newFace);
            newlu2.next = newlu2;
            newlu2.last = newlu2;
            (0, utils_1.fill_lu_vertexuse)(newlu2, newfu2, newlu1, this.newLoop, vertexHasUseInRegion.vu);
            // now update existing structures
            vertexHasUseInRegion.s.desc_type = definitions_1.DescType.FACEUSE;
            vertexHasUseInRegion.s.faceuse = newfu2;
            // TODO: Decide if is necessary to remove the vertex use as the desctype is now faceuse
            // vertexHasUseInRegion.s!.vertexuse = null;
            vertexHasUseInRegion.vu.up = definitions_1.DescType.LOOPUSE;
            vertexHasUseInRegion.vu.loopuse = newlu2;
            // TODO: Decide if is necessary to remove the shell pointer as the up ptr type is now loopuse
            // now add the new vertexuse to the list of uses of the vertex
            (0, utils_1.link_vu)(newvu1, this.vertex, definitions_1.DescType.LOOPUSE, null, this.newLoop);
        }
        else {
            newlu2.next = newlu2;
            newlu2.last = newlu2;
            (0, utils_1.fill_lu_vertexuse)(newlu2, newfu2, newlu1, this.newLoop, newvu2);
            (0, utils_1.fill_fu)(newfu2, vertexHasUseInRegion.s, newfu1, newlu2, definitions_1.Orientation.OUTSIDE, this.newFace);
            if (!vertexHasUseInRegion.s.faceuse) {
                vertexHasUseInRegion.s.faceuse = newfu2;
            }
            else {
                vertexHasUseInRegion.s.faceuse = vertexHasUseInRegion.s.faceuse.link(newfu2);
            }
            (0, utils_1.fill_vu_loopuse)(newvu2, this.vertex, newlu2);
            (0, utils_1.link_vu)(newvu1, this.vertex, definitions_1.DescType.LOOPUSE, null, this.newLoop);
            (0, utils_1.link_vu)(newvu2, this.vertex, definitions_1.DescType.LOOPUSE, null, this.newLoop);
        }
        vertexHasUseInRegion.s.desc_type = definitions_1.DescType.FACEUSE;
    }
    unexecute() {
    }
}
exports.default = MRSFL;
//# sourceMappingURL=mrsfl.js.map