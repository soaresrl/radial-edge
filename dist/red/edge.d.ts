import { Attribute } from "./definitions";
import EdgeUse from "./edgeuse";
import Face from "./face";
import { IsEdgeOnFaceResult } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";
export default class Edge extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    edgeuse: EdgeUse | null;
    attribute?: Attribute;
    constructor();
    liesOnFace(f: Face): IsEdgeOnFaceResult;
}
