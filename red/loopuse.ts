import { Attribute, DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Loop from "./loop";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";

export default class LoopUse extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public faceuse: FaceUse | null = null;
    public mate: LoopUse | null = null;
    public loop: Loop | null = null;
    public attribute?: Attribute;

    public down?: DescType;
    public edgeuse: EdgeUse | null = null;
    public vertexuse: VertexUse | null = null;

    constructor(){
        super();
        
        LoopUse.counter++;
        this.id = LoopUse.counter;
    }

    fill_lu_vertexuse(fu: FaceUse, mate: LoopUse, loop: Loop, vu: VertexUse) {
        this.faceuse = fu;
        this.mate = mate;
        this.loop = loop;
        this.down = DescType.VERTEXUSE;
        this.vertexuse = vu;
    }
    
    fill_lu_edgeuse(fu: FaceUse, mate: LoopUse, loop: Loop, eu: EdgeUse) {
        this.faceuse = fu;
        this.mate = mate;
        this.loop = loop;
        this.down = DescType.EDGEUSE;
        this.edgeuse = eu;
    }
}
