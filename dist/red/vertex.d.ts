import Point from "../geo/point";
import { Attribute } from "./definitions";
import Face from "./face";
import Region from "./region";
import { IsVertexOnFaceResult, VertexHasUseInRegion } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
export default class Vertex extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    vertexuse: VertexUse | null;
    attribute?: Attribute;
    point: Point | null;
    constructor(p?: Point | null);
    hasUseInRegion(r: Region): VertexHasUseInRegion;
    liesOnFace(f: Face): IsVertexOnFaceResult;
}
