import { Attribute, Orientation } from "./definitions";
import EdgeUse from "./edgeuse";
import Face from "./face";
import Shell from "./shell";
import { IsEdgeOnFaceResult } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";
import Vertex from "./vertex";
export default class Edge extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    edgeuse: EdgeUse | null;
    attribute?: Attribute;
    visited: boolean;
    constructor();
    liesOnFace(f: Face): IsEdgeOnFaceResult;
    static isInLoop(e_list: Edge[], f_list: Face[], f_orients: Orientation[], e_orients: Orientation[]): {
        v: Vertex;
        s: Shell;
        result: boolean;
    };
}
