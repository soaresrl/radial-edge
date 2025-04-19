import { DescType, Direction } from "./definitions";
import Edge from "./edge";
import EdgeUse from "./edgeuse";
import Loop from "./loop";
import LoopUse from "./loopuse";
import Vertex from "./vertex";
import VertexUse from "./vertexuse";

abstract class CircularDoublyLinkedListItem {
    public last: this;
    public next: this;
    
    constructor() {
        this.last = this;
        this.next = this;
    }

    static first<T extends CircularDoublyLinkedListItem>(new_elem: T): T {
        new_elem.next = new_elem;
        new_elem.last = new_elem;

        return new_elem;
    }

    public link(new_elem: this): this {
        const head = this;

        new_elem.next = head;
        new_elem.last = head.last;
        head.last!.next = new_elem;
        head.last = new_elem;

        return new_elem;
    }

    public unlink(elem: this){
        let head: this | null = this;

        if (head == elem) {
            if(head != elem.next) {
                head = elem.next!;
            } else {
                head = null
            }
        }

        elem.next!.last = elem.last;
        elem.last!.next = elem.next;

        return head;
    }
}

function for_all_eu_in_lu(head: EdgeUse, operation: (eu: EdgeUse) => void) {
    let eu: EdgeUse, eu_first: EdgeUse;
    if (head.up == DescType.LOOPUSE) {
        eu = head;
        eu_first = head;
        do {
            operation(eu);
            eu = eu.clockwiseEdgeUse!;
        } while (eu != eu_first);
    }
}

function link_vu(new_vu: VertexUse, v_parent: Vertex, vu_type: DescType, e_parent: Edge | null, loop_parent: Loop | null){
    let vu_t: VertexUse;
    let first_vu: VertexUse;
    let next_vu: VertexUse;

    let found: boolean;

    if(!v_parent.vertexuse){
        new_vu.next = new_vu;
        new_vu.last = new_vu;

        v_parent.vertexuse = new_vu;
        
        return;
    }

    // now check whether we have a shell vertex.
    // if we have, just link the new vertexuse and return.

    if (v_parent.vertexuse.up == DescType.SHELL) {
        v_parent.vertexuse.next = new_vu;
        v_parent.vertexuse.last = new_vu;

        new_vu.next = v_parent.vertexuse;
        new_vu.last = v_parent.vertexuse;

        return;
    }

    // get the first vertexuse on the list
    first_vu = v_parent.vertexuse

    // check to see whether there is already a vertex use with 
    // the same parent edge or loop, whichever is the case.

    found = false;

    vu_t = first_vu;

    do {
        // while we haven't found a vertexuse with the same parent edge or loop
        // or until we run out of vu
        if (vu_type == DescType.EDGEUSE) {
            if (vu_t.up == DescType.EDGEUSE) {
                if (vu_t.edgeuse!.edge == e_parent) {
                    found = true;
                    break;   
                }
            }
        } else {
            if (vu_t.up == DescType.LOOPUSE) {
                if (vu_t.loopuse!.loop == loop_parent) {
                    found = true;
                    break;
                }
            }
        }

        vu_t = vu_t.next!;
    } while (vu_t != first_vu);

    if (found) {
        if (vu_type == DescType.EDGEUSE) {
            first_vu = vu_t.next!;
            next_vu = vu_t.next!;

            if (next_vu.up == DescType.EDGEUSE) {
                while (next_vu.edgeuse!.edge == e_parent && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next!;
                    if (next_vu.up != DescType.EDGEUSE) break;
                }
            }
        } else {
            first_vu = vu_t;
            next_vu = vu_t.next!;

            if (next_vu.up == DescType.LOOPUSE) {
                while (next_vu.loopuse?.loop == loop_parent && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next!;

                    if (next_vu.up != DescType.LOOPUSE) break;
                }
            }
        }
    } else {
        // if we did not find, loop until the next vertexuse points to a parent
        // edge or loop which is different than the current one

        let e_curr: Edge;
        let l_curr: Loop;

        if (vu_t.up == DescType.EDGEUSE) {
            e_curr = vu_t.edgeuse!.edge!;

            first_vu = vu_t;
            next_vu = vu_t.next!;

            if(next_vu.up == DescType.EDGEUSE) {
                while (next_vu.edgeuse!.edge == e_curr && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next!;

                    if(next_vu.up != DescType.EDGEUSE) break;
                }
            }
        } else {
            l_curr = vu_t.loopuse!.loop!;
            
            first_vu = vu_t;
            next_vu = vu_t.next!;

            if (next_vu.up == DescType.LOOPUSE) {
                while (next_vu.loopuse!.loop! == l_curr && next_vu != first_vu) {
                    vu_t = next_vu;
                    next_vu = vu_t.next!;
                    
                    if(next_vu.up != DescType.LOOPUSE) break;
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

function link_wing(v: Vertex, e: Edge, dir: Direction, lu: LoopUse, eu1: EdgeUse, eu2: EdgeUse, eu3: EdgeUse, eu4: EdgeUse, m_ev: boolean){
    let eu_t: EdgeUse;
    let eu_first: EdgeUse;

    eu_t = lu.edgeuse!;
    eu_first = lu.edgeuse!;

    do {
        if ((eu_t.vertexUse!.vertex == v) && ((dir == Direction.CW && eu_t.edge == e) || (dir != Direction.CW && eu_t.counterClockwiseEdgeUse!.edge == e))) {
            eu_t.counterClockwiseEdgeUse!.clockwiseEdgeUse = eu1;
            eu1.counterClockwiseEdgeUse = eu_t.counterClockwiseEdgeUse;
            eu_t.counterClockwiseEdgeUse = eu2;
            eu2.clockwiseEdgeUse = eu_t;
            
            if (m_ev) {
                eu1.clockwiseEdgeUse = eu2;
                eu2.counterClockwiseEdgeUse = eu1;    
            }

            eu_t = eu_t.mate!;

            eu_t.clockwiseEdgeUse!.counterClockwiseEdgeUse = eu4;
            eu4.clockwiseEdgeUse = eu_t.clockwiseEdgeUse;
            eu_t.clockwiseEdgeUse = eu3;
            eu3.counterClockwiseEdgeUse = eu_t;

            if (m_ev) {
                eu3.clockwiseEdgeUse = eu4;
                eu4.counterClockwiseEdgeUse = eu3;
            }

            return;
        }

        eu_t = eu_t.clockwiseEdgeUse!;
    } while (eu_t != eu_first);

    console.error("Not found the given EDGE on the given LOOP");
}

export {
    CircularDoublyLinkedListItem,
    for_all_eu_in_lu,
    link_vu,
    link_wing
}