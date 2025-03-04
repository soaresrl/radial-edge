"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
const utils_1 = require("./utils");
class Edge extends utils_1.CircularDoublyLinkedListItem {
    constructor() {
        super();
        this.id = 0;
        this.edgeuse = null;
        Edge.counter++;
        this.id = Edge.counter;
    }
    liesOnFace(f) {
        let eu_t;
        let eu_first;
        let flag = 'MATE';
        eu_t = this.edgeuse;
        eu_first = this.edgeuse;
        const result = {
            eu: null,
            lu: null,
            fu: null,
            result: false,
        };
        do {
            switch (eu_t.up) {
                case definitions_1.DescType.SHELL:
                    return result;
                case definitions_1.DescType.LOOPUSE:
                    result.eu = eu_t;
                    result.lu = result.eu.loopuse;
                    result.fu = result.lu.faceuse;
                    if (result.fu.face == f)
                        return { ...result, result: true };
                    break;
                default:
                    break;
            }
            if (flag == 'MATE') {
                eu_t = eu_t.mate;
                flag = 'RADIAL';
            }
            else {
                eu_t = eu_t.radial;
                flag = 'MATE';
            }
        } while (eu_t != eu_first);
        return result;
    }
}
Edge.counter = 0;
exports.default = Edge;
//# sourceMappingURL=edge.js.map