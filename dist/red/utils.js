"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularDoublyLinkedListItem = void 0;
exports.fill_s_faceuse = fill_s_faceuse;
exports.fill_fu = fill_fu;
exports.fill_lu_vertexuse = fill_lu_vertexuse;
exports.fill_lu_edgeuse = fill_lu_edgeuse;
exports.fill_vu_loopuse = fill_vu_loopuse;
exports.fill_vu_edgeuse = fill_vu_edgeuse;
exports.fill_vu_shell = fill_vu_shell;
exports.fill_eu_shell = fill_eu_shell;
exports.fill_eu_loopuse = fill_eu_loopuse;
exports.for_all_eu_in_lu = for_all_eu_in_lu;
exports.link_vu = link_vu;
exports.link_wing = link_wing;
const definitions_1 = require("./definitions");
class CircularDoublyLinkedListItem {
    constructor() {
        this.last = this;
        this.next = this;
    }
    static first(new_elem) {
        new_elem.next = new_elem;
        new_elem.last = new_elem;
        return new_elem;
    }
    link(new_elem) {
        const head = this;
        new_elem.next = head;
        new_elem.last = head.last;
        head.last.next = new_elem;
        head.last = new_elem;
        return new_elem;
    }
    unlink(elem) {
        let head = this;
        if (head == elem) {
            if (head != elem.next) {
                head = elem.next;
            }
            else {
                head = null;
            }
        }
        elem.next.last = elem.last;
        elem.last.next = elem.next;
        return head;
    }
}
exports.CircularDoublyLinkedListItem = CircularDoublyLinkedListItem;
function fill_s_faceuse(shell, region, shell_faceuse) {
    shell.region = region;
    shell.desc_type = definitions_1.DescType.FACEUSE;
    shell.faceuse = shell_faceuse;
}
function fill_fu(fu, shell, mate, lu, orient, face) {
    fu.owningShell = shell;
    fu.mate = mate;
    fu.loopuse = lu;
    fu.orientation = orient;
    fu.face = face;
}
function fill_lu_vertexuse(lu, fu, mate, loop, vu) {
    lu.faceuse = fu;
    lu.mate = mate;
    lu.loop = loop;
    lu.down = definitions_1.DescType.VERTEXUSE;
    lu.vertexuse = vu;
}
function fill_lu_edgeuse(lu, fu, mate, loop, eu) {
    lu.faceuse = fu;
    lu.mate = mate;
    lu.loop = loop;
    lu.down = definitions_1.DescType.EDGEUSE;
    lu.edgeuse = eu;
}
function fill_vu_loopuse(vu, v, lu) {
    vu.vertex = v;
    vu.up = definitions_1.DescType.LOOPUSE;
    vu.loopuse = lu;
}
function fill_vu_edgeuse(vu, vertex, eu) {
    vu.vertex = vertex;
    vu.up = definitions_1.DescType.EDGEUSE;
    vu.edgeuse = eu;
}
function fill_vu_shell(vu, vertex, shell) {
    vu.vertex = vertex;
    vu.up = definitions_1.DescType.SHELL;
    vu.shell = shell;
}
function fill_eu_shell(eu, vu, mate, edge, shell, orient) {
    eu.vertexUse = vu;
    eu.mate = mate;
    eu.edge = edge;
    eu.orientation = orient;
    eu.up = definitions_1.DescType.SHELL;
    eu.shell = shell;
}
function fill_eu_loopuse(eu, vu, mate, edge, lu, cw, ccw, radial, orient) {
    eu.vertexUse = vu;
    eu.mate = mate;
    eu.edge = edge;
    eu.orientation = orient;
    eu.up = definitions_1.DescType.LOOPUSE;
    eu.loopuse = lu;
    eu.clockwiseEdgeUse = cw;
    eu.counterClockwiseEdgeUse = ccw;
    eu.radial = radial;
}
function for_all_eu_in_lu(head, operation) {
    let eu, eu_first;
    if (head.up == definitions_1.DescType.LOOPUSE) {
        eu = head;
        eu_first = head;
        do {
            operation(eu);
            eu = eu.clockwiseEdgeUse;
        } while (eu != eu_first);
    }
}
function link_vu(new_vu, v_parent, vu_type, e_parent, loop_parent) {
    let vu_t;
    let first_vu;
    let next_vu;
    let found;
    if (!v_parent.vertexuse) {
        new_vu.next = new_vu;
        new_vu.last = new_vu;
        v_parent.vertexuse = new_vu;
        return;
    }
    // now check whether we have a shell vertex.
    // if we have, just link the new vertexuse and return.
    if (v_parent.vertexuse.up == definitions_1.DescType.SHELL) {
        v_parent.vertexuse.next = new_vu;
        v_parent.vertexuse.last = new_vu;
        new_vu.next = v_parent.vertexuse;
        new_vu.last = v_parent.vertexuse;
        return;
    }
    // get the first vertexuse on the list
    first_vu = v_parent.vertexuse;
    // check to see whether there is already a vertex use with 
    // the same parent edge or loop, whichever is the case.
    found = false;
    vu_t = first_vu;
    do {
        // while we haven't found a vertexuse with the same parent edge or loop
        // or until we run out of vu
        if (vu_type == definitions_1.DescType.EDGEUSE) {
            if (vu_t.up == definitions_1.DescType.EDGEUSE) {
                if (vu_t.edgeuse.edge == e_parent) {
                    found = true;
                    break;
                }
            }
        }
        else {
            if (vu_t.up == definitions_1.DescType.LOOPUSE) {
                if (vu_t.loopuse.loop == loop_parent) {
                    found = true;
                    break;
                }
            }
        }
        vu_t = vu_t.next;
    } while (vu_t != first_vu);
    if (found) {
        if (vu_type == definitions_1.DescType.EDGEUSE) {
            first_vu = vu_t.next;
            next_vu = vu_t.next;
            if (next_vu.up == definitions_1.DescType.EDGEUSE) {
                while (next_vu.edgeuse.edge == e_parent && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next;
                    if (next_vu.up != definitions_1.DescType.EDGEUSE)
                        break;
                }
            }
        }
        else {
            first_vu = vu_t;
            next_vu = vu_t.next;
            if (next_vu.up == definitions_1.DescType.LOOPUSE) {
                while (next_vu.loopuse?.loop == loop_parent && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next;
                    if (next_vu.up != definitions_1.DescType.LOOPUSE)
                        break;
                }
            }
        }
    }
    else {
        // if we did not find, loop until the next vertexuse points to a parent
        // edge or loop which is different than the current one
        let e_curr;
        let l_curr;
        if (vu_t.up == definitions_1.DescType.EDGEUSE) {
            e_curr = vu_t.edgeuse.edge;
            first_vu = vu_t;
            next_vu = vu_t.next;
            if (next_vu.up == definitions_1.DescType.EDGEUSE) {
                while (next_vu.edgeuse.edge == e_curr && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next;
                    if (next_vu.up != definitions_1.DescType.EDGEUSE)
                        break;
                }
            }
        }
        else {
            l_curr = vu_t.loopuse.loop;
            first_vu = vu_t;
            next_vu = vu_t.next;
            if (next_vu.up == definitions_1.DescType.LOOPUSE) {
                while (next_vu.loopuse.loop == l_curr && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next;
                    if (next_vu.up != definitions_1.DescType.LOOPUSE)
                        break;
                }
            }
        }
    }
    vu_t.next = new_vu;
    new_vu.last = vu_t;
    new_vu.next = next_vu;
    next_vu.last = new_vu;
    v_parent.vertexuse = next_vu;
}
function link_wing(v, e, dir, lu, eu1, eu2, eu3, eu4, m_ev) {
    let eu_t;
    let eu_first;
    eu_t = lu.edgeuse;
    eu_first = lu.edgeuse;
    do {
        if ((eu_t.vertexUse.vertex == v) && ((dir == definitions_1.Direction.CW && eu_t.edge == e) || (dir != definitions_1.Direction.CW && eu_t.counterClockwiseEdgeUse.edge == e))) {
            eu_t.counterClockwiseEdgeUse.clockwiseEdgeUse = eu1;
            eu1.counterClockwiseEdgeUse = eu_t.counterClockwiseEdgeUse;
            eu_t.counterClockwiseEdgeUse = eu2;
            eu2.clockwiseEdgeUse = eu_t;
            if (m_ev) {
                eu1.clockwiseEdgeUse = eu2;
                eu2.counterClockwiseEdgeUse = eu1;
            }
            eu_t = eu_t.mate;
            eu_t.clockwiseEdgeUse.counterClockwiseEdgeUse = eu4;
            eu4.clockwiseEdgeUse = eu_t.clockwiseEdgeUse;
            eu_t.clockwiseEdgeUse = eu3;
            eu3.counterClockwiseEdgeUse = eu_t;
            if (m_ev) {
                eu3.clockwiseEdgeUse = eu4;
                eu4.counterClockwiseEdgeUse = eu3;
            }
            return;
        }
        eu_t = eu_t.clockwiseEdgeUse;
    } while (eu_t != eu_first);
    console.error("Not found the given EDGE on the given LOOP");
}
//# sourceMappingURL=utils.js.map