"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
const utils_1 = require("./utils");
class Vertex extends utils_1.CircularDoublyLinkedListItem {
    constructor(p = null) {
        super();
        this.vertexuse = null;
        this.point = null;
        this.point = p;
        Vertex.counter++;
        this.id = Vertex.counter;
    }
    hasUseInRegion(r) {
        const v = this;
        let vut;
        let vu_first;
        const hasUseResult = {
            result: false,
            vu: null,
            eu: null,
            lu: null,
            fu: null,
            s: null
        };
        vut = v.vertexuse;
        vu_first = v.vertexuse;
        do {
            hasUseResult.vu = vut;
            switch (vut.up) {
                case definitions_1.DescType.SHELL:
                    hasUseResult.eu = null;
                    hasUseResult.lu = null;
                    hasUseResult.fu = null;
                    hasUseResult.s = vut.shell;
                    if (hasUseResult.s.region = r) {
                        hasUseResult.result = true;
                        return hasUseResult;
                    }
                    break;
                case definitions_1.DescType.LOOPUSE:
                    hasUseResult.eu = null;
                    hasUseResult.lu = vut.loopuse;
                    hasUseResult.fu = hasUseResult.lu.faceuse;
                    hasUseResult.s = hasUseResult.fu.owningShell;
                    if (hasUseResult.s.region = r) {
                        hasUseResult.result = true;
                        return hasUseResult;
                    }
                    break;
                case definitions_1.DescType.EDGEUSE:
                    hasUseResult.eu = vut.edgeuse;
                    if (hasUseResult.eu.up == definitions_1.DescType.LOOPUSE) {
                        hasUseResult.lu = hasUseResult.eu.loopuse;
                        hasUseResult.fu = hasUseResult.lu.faceuse;
                        hasUseResult.s = hasUseResult.fu.owningShell;
                        if (hasUseResult.s.region = r) {
                            hasUseResult.result = true;
                            return hasUseResult;
                        }
                    }
                    else if (hasUseResult.eu.up == definitions_1.DescType.SHELL) {
                        hasUseResult.lu = null;
                        hasUseResult.fu = null;
                        hasUseResult.s = hasUseResult.eu.shell;
                        if (hasUseResult.s.region = r) {
                            hasUseResult.result = true;
                            return hasUseResult;
                        }
                    }
                    break;
                default:
                    break;
            }
        } while (vut != vu_first);
        vut = vut.next;
        hasUseResult.result = false;
        return hasUseResult;
    }
    liesOnFace(f) {
        let vu_t;
        let vu_first;
        vu_t = this.vertexuse;
        vu_first = this.vertexuse;
        const result = {
            eu: null,
            vu: null,
            lu: null,
            fu: null,
            result: false,
        };
        do {
            result.vu = vu_t;
            switch (vu_t.up) {
                case definitions_1.DescType.SHELL:
                    return result;
                case definitions_1.DescType.LOOPUSE:
                    result.eu = null;
                    result.lu = result.vu.loopuse;
                    result.fu = result.lu.faceuse;
                    if (result.fu.face == f)
                        return { ...result, result: true };
                    break;
                case definitions_1.DescType.EDGEUSE:
                    if (vu_t.edgeuse.up == definitions_1.DescType.LOOPUSE) {
                        result.eu = result.vu.edgeuse;
                        result.lu = result.eu.loopuse;
                        result.fu = result.lu.faceuse;
                        if (result.fu.face == f)
                            return { ...result, result: true };
                    }
                    break;
                default:
                    break;
            }
            vu_t = vu_t.next;
        } while (vu_t != vu_first);
        return result;
    }
}
Vertex.counter = 0;
exports.default = Vertex;
//# sourceMappingURL=vertex.js.map