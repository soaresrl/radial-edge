import { DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
export default class Shell extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    region: Region | null;
    desc_type: DescType | null;
    faceuse: FaceUse | null;
    vertexuse: VertexUse | null;
    edgeuse: EdgeUse | null;
    constructor(region: Region);
}
