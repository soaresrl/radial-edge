import { Attribute, DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Loop from "./loop";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
export default class LoopUse extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    faceuse: FaceUse | null;
    mate: LoopUse | null;
    loop: Loop | null;
    attribute?: Attribute;
    down?: DescType;
    edgeuse: EdgeUse | null;
    vertexuse: VertexUse | null;
    constructor();
    fill_lu_vertexuse(fu: FaceUse, mate: LoopUse, loop: Loop, vu: VertexUse): void;
    fill_lu_edgeuse(fu: FaceUse, mate: LoopUse, loop: Loop, eu: EdgeUse): void;
}
