import { DescType, Direction, QueryType } from "./definitions";
import Edge from "./edge";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Loop from "./loop";
import LoopUse from "./loopuse";
import Vertex from "./vertex";
import VertexUse from "./vertexuse";
declare abstract class CircularDoublyLinkedListItem {
    last: this;
    next: this;
    constructor();
    static first<T extends CircularDoublyLinkedListItem>(new_elem: T): T;
    link(new_elem: this): this;
    unlink(elem: this): this;
    query(ptr: this, query: QueryType): this;
}
declare function for_all_eu_in_lu(head: EdgeUse, operation: (eu: EdgeUse) => void): void;
declare function for_all_eu_in_s(head: EdgeUse, operation: (eu: EdgeUse) => void): void;
declare function for_all_fu_in_s(head: FaceUse, operation: (fu: FaceUse) => void): void;
declare function link_vu(new_vu: VertexUse, v_parent: Vertex, vu_type: DescType, e_parent: Edge | null, loop_parent: Loop | null): void;
declare function link_wing(v: Vertex, e: Edge, dir: Direction, lu: LoopUse, eu1: EdgeUse, eu2: EdgeUse, eu3: EdgeUse, eu4: EdgeUse, m_ev: boolean): void;
export { CircularDoublyLinkedListItem, for_all_eu_in_lu, for_all_eu_in_s, for_all_fu_in_s, link_vu, link_wing };
