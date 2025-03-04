"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("../definitions");
const edgeuse_1 = require("../edgeuse");
const faceuse_1 = require("../faceuse");
const loopuse_1 = require("../loopuse");
const utils_1 = require("../utils");
const vertexuse_1 = require("../vertexuse");
const operator_1 = require("./operator");
class MME extends operator_1.default {
    constructor(v1, e1, dir1, v2, e2, dir2, f, orient, newEdge, newFace, newLoop) {
        super();
        this.v1 = v1;
        this.e1 = e1;
        this.dir1 = dir1;
        this.v2 = v2;
        this.e2 = e2;
        this.dir2 = dir2;
        this.f = f;
        this.orient = orient;
        this.newEdge = newEdge;
        this.newFace = newFace;
        this.newLoop = newLoop;
    }
    execute() {
        let newvu1, newvu2, newvu3, newvu4;
        let neweu1, neweu2, neweu3, neweu4;
        // found vertex uses
        let { eu: eu_v1, vu: vu_v1, lu: lu_v1, fu: fu_v1, result } = this.v1.liesOnFace(this.f);
        if (!result) {
            return;
        }
        let { eu: eu_v2, vu: vu_v2, lu: lu_v2, fu: fu_v2, result: result2 } = this.v2.liesOnFace(this.f);
        if (!result2) {
            return;
        }
        const { result: result_e1 } = (() => {
            if (this.e1 && ((this.dir1 == definitions_1.Direction.CW) || (this.dir1 == definitions_1.Direction.CCW))) {
                return this.e1.liesOnFace(this.f);
            }
            return {
                eu: null,
                lu: null,
                fu: null,
                result: false
            };
        })();
        if (!result_e1) {
            return;
        }
        const { result: result_e2 } = (() => {
            if (this.e2 && ((this.dir2 == definitions_1.Direction.CW) || (this.dir2 == definitions_1.Direction.CCW))) {
                return this.e2.liesOnFace(this.f);
            }
            return {
                eu: null,
                lu: null,
                fu: null,
                result: false
            };
        })();
        if (!result_e2) {
            return;
        }
        neweu1 = new edgeuse_1.default();
        neweu2 = new edgeuse_1.default();
        neweu3 = new edgeuse_1.default();
        neweu4 = new edgeuse_1.default();
        if (this.orient != definitions_1.Orientation.UNSPECIFIED) {
            if (fu_v1.orientation != this.orient) {
                lu_v1 = lu_v1.mate;
                fu_v1 = fu_v1.mate;
                if (eu_v1) {
                    eu_v1 = eu_v1.mate;
                }
            }
            if (fu_v2.orientation != this.orient) {
                lu_v2 = lu_v2.mate;
                fu_v2 = fu_v2.mate;
                if (eu_v2) {
                    eu_v2 = eu_v2.mate;
                }
            }
        }
        this.newEdge.edgeuse = neweu1;
        if (lu_v1.loop == lu_v2.loop) {
            // MEFL
            let newfu1 = new faceuse_1.default();
            let newfu2 = new faceuse_1.default();
            // newfu1 = new FaceUse();
            // newfu2 = new FaceUse();
            let newlu1 = new loopuse_1.default();
            let newlu2 = new loopuse_1.default();
            let s1, s2;
            lu_v2 = lu_v1.mate;
            // fill the new face and faceuses
            // make newfu1 the same shell as the found faceuse
            this.newFace.faceuse = newfu1;
            s1 = fu_v1.owningShell;
            s2 = (fu_v1.mate).owningShell;
            s1.faceuse = s1.faceuse.link(newfu1);
            s2.faceuse = s2.faceuse.link(newfu2);
            // s1.faceuse!.link(newfu1)
            // s2.faceuse!.link(newfu2);
            (0, utils_1.fill_fu)(newfu1, s1, newfu2, newlu1, fu_v1.orientation, this.newFace);
            (0, utils_1.fill_fu)(newfu2, s2, newfu1, newlu2, fu_v1.mate.orientation, this.newFace);
            this.newLoop.loopuse = newlu1;
            newlu1.next = newlu1;
            newlu1.last = newlu1;
            newlu2.next = newlu2;
            newlu2.last = newlu2;
            if (this.v1 == this.v2) {
                // check whether the given vertex is a loop vertex
                if (!eu_v1) {
                    // the given vertex is a loop vertex
                    newvu1 = lu_v1.vertexuse;
                    newvu2 = lu_v2.vertexuse;
                    // reset loopuse down pointers
                    lu_v1.down = definitions_1.DescType.EDGEUSE;
                    lu_v2.down = definitions_1.DescType.EDGEUSE;
                }
                else {
                    newvu1 = new vertexuse_1.default();
                    newvu2 = new vertexuse_1.default();
                }
                newvu3 = new vertexuse_1.default();
                newvu4 = new vertexuse_1.default();
                (0, utils_1.fill_lu_edgeuse)(newlu1, newfu1, newlu2, this.newLoop, neweu1);
                (0, utils_1.fill_lu_edgeuse)(newlu2, newfu2, newlu1, this.newLoop, neweu4);
                (0, utils_1.fill_eu_loopuse)(neweu1, newvu1, neweu4, this.newEdge, newlu1, null, null, neweu2, definitions_1.Orientation.SAME);
                (0, utils_1.fill_eu_loopuse)(neweu2, newvu3, neweu3, this.newEdge, lu_v1, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
                (0, utils_1.fill_eu_loopuse)(neweu3, newvu2, neweu2, this.newEdge, lu_v2, null, null, neweu4, definitions_1.Orientation.SAME);
                (0, utils_1.fill_eu_loopuse)(neweu4, newvu4, neweu1, this.newEdge, newlu2, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
                (0, utils_1.fill_vu_edgeuse)(newvu1, this.v1, neweu1);
                (0, utils_1.fill_vu_edgeuse)(newvu2, this.v1, neweu3);
                (0, utils_1.fill_vu_edgeuse)(newvu3, this.v1, neweu2);
                (0, utils_1.fill_vu_edgeuse)(newvu4, this.v1, neweu4);
                if (eu_v1) {
                    (0, utils_1.link_vu)(newvu1, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                    (0, utils_1.link_vu)(newvu2, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                }
                (0, utils_1.link_vu)(newvu3, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu4, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                // now the cw and ccw fields for the new edgeuses
                if (!eu_v1) {
                    neweu1.clockwiseEdgeUse = neweu1;
                    neweu1.counterClockwiseEdgeUse = neweu1;
                    neweu2.clockwiseEdgeUse = neweu2;
                    neweu2.counterClockwiseEdgeUse = neweu2;
                    neweu3.clockwiseEdgeUse = neweu3;
                    neweu3.counterClockwiseEdgeUse = neweu3;
                    neweu4.clockwiseEdgeUse = neweu4;
                    neweu4.counterClockwiseEdgeUse = neweu4;
                }
                else {
                    (0, utils_1.link_wing)(this.v1, this.e1, this.dir1, lu_v1, neweu2, neweu1, neweu4, neweu3, true);
                    (0, utils_1.link_wing)(this.v1, this.e2, this.dir2, lu_v1, neweu1, neweu2, neweu3, neweu4, false);
                }
                // set the edge loop pointers in the edges of the new loopuses
                (0, utils_1.for_all_eu_in_lu)(newlu1.edgeuse, (eu) => { eu.loopuse = newlu1; });
                (0, utils_1.for_all_eu_in_lu)(newlu2.edgeuse, (eu) => { eu.loopuse = newlu2; });
                lu_v1.edgeuse = neweu2;
                lu_v2.edgeuse = neweu3;
            }
            else {
                // the two given vertex are not the same
                // in this case, since we have only one loop, the two distinct vertices cannot be loop vertices
                // so we create four new vertexuses, two for each vertex
                // create the new vertex use
                newvu1 = new vertexuse_1.default();
                newvu2 = new vertexuse_1.default();
                newvu3 = new vertexuse_1.default();
                newvu4 = new vertexuse_1.default();
                if (this.dir1 == definitions_1.Direction.CW) {
                    (0, utils_1.fill_lu_edgeuse)(newlu1, newfu1, newlu2, this.newLoop, neweu2);
                    (0, utils_1.fill_lu_edgeuse)(newlu2, newfu2, newlu1, this.newLoop, neweu3);
                    (0, utils_1.fill_eu_loopuse)(neweu1, newvu1, neweu4, this.newEdge, lu_v1, null, null, neweu2, definitions_1.Orientation.SAME);
                    (0, utils_1.fill_eu_loopuse)(neweu2, newvu3, neweu3, this.newEdge, newlu1, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
                    (0, utils_1.fill_eu_loopuse)(neweu3, newvu2, neweu2, this.newEdge, newlu2, null, null, neweu4, definitions_1.Orientation.SAME);
                    (0, utils_1.fill_eu_loopuse)(neweu4, newvu4, neweu1, this.newEdge, lu_v2, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
                }
                else {
                    (0, utils_1.fill_lu_edgeuse)(newlu1, newfu1, newlu2, this.newLoop, neweu1);
                    (0, utils_1.fill_lu_edgeuse)(newlu2, newfu2, newlu1, this.newLoop, neweu4);
                    (0, utils_1.fill_eu_loopuse)(neweu1, newvu1, neweu4, this.newEdge, newlu1, null, null, neweu2, definitions_1.Orientation.SAME);
                    (0, utils_1.fill_eu_loopuse)(neweu2, newvu3, neweu3, this.newEdge, lu_v1, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
                    (0, utils_1.fill_eu_loopuse)(neweu3, newvu2, neweu2, this.newEdge, lu_v2, null, null, neweu4, definitions_1.Orientation.SAME);
                    (0, utils_1.fill_eu_loopuse)(neweu4, newvu4, neweu1, this.newEdge, newlu2, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
                }
                (0, utils_1.fill_vu_edgeuse)(newvu1, this.v1, neweu1);
                (0, utils_1.fill_vu_edgeuse)(newvu2, this.v1, neweu3);
                (0, utils_1.fill_vu_edgeuse)(newvu3, this.v2, neweu2);
                (0, utils_1.fill_vu_edgeuse)(newvu4, this.v2, neweu4);
                (0, utils_1.link_vu)(newvu1, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu2, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu3, this.v2, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu4, this.v2, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_wing)(this.v1, this.e1, this.dir1, lu_v1, neweu1, neweu2, neweu3, neweu4, true);
                (0, utils_1.link_wing)(this.v2, this.e2, this.dir2, lu_v1, neweu2, neweu1, neweu4, neweu3, false);
                (0, utils_1.for_all_eu_in_lu)(newlu1.edgeuse, (eu) => { eu.loopuse = newlu1; });
                (0, utils_1.for_all_eu_in_lu)(newlu2.edgeuse, (eu) => { eu.loopuse = newlu2; });
                if (this.dir1 == definitions_1.Direction.CW) {
                    lu_v1.edgeuse = neweu1;
                    lu_v2.edgeuse = neweu4;
                }
                else {
                    lu_v1.edgeuse = neweu2;
                    lu_v2.edgeuse = neweu3;
                }
            }
        }
        else {
            // MEKL
            // Check whether one or both the given vertices are loop vertices
            // In that case we use the corresponding vertexuses for the corresponding new edgeuses
            // Otherwise we create new vertexuses and add them to the list of vertexuses of the corresponding vertex
            if (!eu_v1) {
                newvu1 = lu_v1.vertexuse;
                newvu2 = lu_v1.mate.vertexuse;
                // reset values in the loop and vertex uses
                newvu1.up = definitions_1.DescType.EDGEUSE;
                newvu1.edgeuse = neweu1;
                newvu2.up = definitions_1.DescType.EDGEUSE;
                newvu2.edgeuse = neweu3;
                lu_v1.down = definitions_1.DescType.EDGEUSE;
                lu_v1.mate.down = definitions_1.DescType.EDGEUSE;
                // now the new edgeuses that depend on these vertexuses
                (0, utils_1.fill_eu_loopuse)(neweu1, newvu1, neweu4, this.newEdge, lu_v1, null, null, neweu2, definitions_1.Orientation.SAME);
                (0, utils_1.fill_eu_loopuse)(neweu3, newvu2, neweu2, this.newEdge, lu_v1.mate, null, null, neweu4, definitions_1.Orientation.SAME);
            }
            else {
                newvu1 = new vertexuse_1.default();
                newvu2 = new vertexuse_1.default();
                (0, utils_1.fill_vu_edgeuse)(newvu1, this.v1, neweu1);
                (0, utils_1.fill_vu_edgeuse)(newvu2, this.v1, neweu3);
                (0, utils_1.fill_eu_loopuse)(neweu1, newvu1, neweu4, this.newEdge, lu_v1, null, null, neweu2, definitions_1.Orientation.SAME);
                (0, utils_1.fill_eu_loopuse)(neweu3, newvu2, neweu2, this.newEdge, lu_v1.mate, null, null, neweu4, definitions_1.Orientation.SAME);
                (0, utils_1.link_vu)(newvu1, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu2, this.v1, definitions_1.DescType.EDGEUSE, this.newEdge, null);
            }
            if (!eu_v2) {
                // the second vertex is a loop vertex
                newvu3 = lu_v2.vertexuse;
                newvu4 = lu_v2.mate.vertexuse;
                // reset values in the loop and vertex uses
                newvu3.up = definitions_1.DescType.EDGEUSE;
                newvu3.edgeuse = neweu2;
                newvu4.up = definitions_1.DescType.EDGEUSE;
                newvu4.edgeuse = neweu4;
                // just temporarely
                lu_v2.down = definitions_1.DescType.EDGEUSE;
                lu_v2.mate.down = definitions_1.DescType.EDGEUSE;
                (0, utils_1.fill_eu_loopuse)(neweu2, newvu3, neweu3, this.newEdge, lu_v1, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
                (0, utils_1.fill_eu_loopuse)(neweu4, newvu4, neweu1, this.newEdge, lu_v1.mate, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
            }
            else {
                // the second vertex is not a loop vertex
                // we create new vertexuses for the existing vertex
                newvu3 = new vertexuse_1.default();
                newvu4 = new vertexuse_1.default();
                (0, utils_1.fill_vu_edgeuse)(newvu3, this.v2, neweu2);
                (0, utils_1.fill_vu_edgeuse)(newvu4, this.v2, neweu4);
                (0, utils_1.fill_eu_loopuse)(neweu2, newvu3, neweu3, this.newEdge, lu_v1, null, null, neweu1, definitions_1.Orientation.OPPOSITE);
                (0, utils_1.fill_eu_loopuse)(neweu4, newvu4, neweu1, this.newEdge, lu_v1.mate, null, null, neweu3, definitions_1.Orientation.OPPOSITE);
                (0, utils_1.link_vu)(newvu3, this.v2, definitions_1.DescType.EDGEUSE, this.newEdge, null);
                (0, utils_1.link_vu)(newvu4, this.v2, definitions_1.DescType.EDGEUSE, this.newEdge, null);
            }
            // now at each end of the new edge we set the wing edgeuse fields, i.e the cw and the ccw fields
            if (!eu_v1) {
                neweu1.counterClockwiseEdgeUse = neweu2;
                neweu2.clockwiseEdgeUse = neweu1;
                neweu3.counterClockwiseEdgeUse = neweu4;
                neweu4.clockwiseEdgeUse = neweu3;
            }
            else {
                (0, utils_1.link_wing)(this.v1, this.e1, this.dir1, lu_v1, neweu1, neweu2, neweu3, neweu4, false);
            }
            if (!eu_v2) {
                neweu1.clockwiseEdgeUse = neweu2;
                neweu2.counterClockwiseEdgeUse = neweu1;
                neweu3.clockwiseEdgeUse = neweu4;
                neweu4.counterClockwiseEdgeUse = neweu3;
            }
            else {
                (0, utils_1.link_wing)(this.v2, this.e2, this.dir2, lu_v2, neweu2, neweu1, neweu4, neweu3, false);
            }
            // now set the existing loopuses to point to new edgeuses
            lu_v1.edgeuse = neweu1;
            lu_v1.mate.edgeuse = neweu4;
            lu_v2.unlink(fu_v1.loopuse);
            lu_v2.mate.unlink(fu_v1.mate.loopuse);
            /*  kill the loop and loopuses that were associated to v2	*/
            // red_kill(LOOP,lu_v2->lul_ptr);
            // red_kill(LOOPUSE,lu_v2->lulu_mate_ptr);
            // red_kill(LOOPUSE,lu_v2);
            // set all the edge_loop pointers in the edge uses of the kept loop uses
            (0, utils_1.for_all_eu_in_lu)(lu_v1.edgeuse, (eu) => { eu.loopuse = lu_v1; });
            lu_v1 = lu_v1.mate;
            (0, utils_1.for_all_eu_in_lu)(lu_v1.edgeuse, (eu) => { eu.loopuse = lu_v1; });
            /*  finally return NILL values for "newf" and "newl"		*/
            // *newf = 0;
            // *newl = 0;
        }
    }
    unexecute() {
    }
}
exports.default = MME;
//# sourceMappingURL=mme.js.map