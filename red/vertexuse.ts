import { Attribute, DescType } from "./definitions";

import EdgeUse from "./edgeuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
import Vertex from "./vertex";

import { CircularDoublyLinkedListItem } from "./utils";

export default class VertexUse extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public vertex: Vertex | null = null;

    public attribute?: Attribute;

    public up?: DescType;

    public shell: Shell | null = null;
    public loopuse: LoopUse | null = null;
    public edgeuse: EdgeUse | null = null;

    constructor(){
        super();
        
        VertexUse.counter++;
        this.id = VertexUse.counter;
    }
}