import { Attribute, DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
import Vertex from "./vertex";
import { CircularDoublyLinkedListItem } from "./utils";
export default class VertexUse extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    vertex: Vertex | null;
    attribute?: Attribute;
    up?: DescType;
    shell: Shell | null;
    loopuse: LoopUse | null;
    edgeuse: EdgeUse | null;
    constructor();
}
