import { Attribute } from "./definitions";
import Edge from "./edge";
import Face from "./face";
import Loop from "./loop";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import Vertex from "./vertex";
export default class Model extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    region: Region | null;
    face: Face | null;
    loop: Loop | null;
    edge: Edge | null;
    vertex: Vertex | null;
    attr?: Attribute;
    constructor();
}
