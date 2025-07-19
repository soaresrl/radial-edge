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

    fill_vu_loopuse(v: Vertex, lu: LoopUse){
        this.vertex = v;
        this.up = DescType.LOOPUSE;
        this.loopuse = lu;
    }

    fill_vu_edgeuse(vertex: Vertex, eu: EdgeUse) {
        this.vertex = vertex;
        this.up = DescType.EDGEUSE;
        this.edgeuse = eu;
    }

    fill_vu_shell(vertex: Vertex, shell: Shell) {
        this.vertex = vertex;
        this.up = DescType.SHELL;
        this.shell = shell;
    }
}