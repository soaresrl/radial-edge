import { Direction, Orientation } from "../definitions";
import Edge from "../edge";
import Face from "../face";
import Vertex from "../vertex";
import Operator from "./operator";
export default class MMEV extends Operator {
    new_edge: Edge;
    new_vertex: Vertex;
    face: Face;
    existing_edge: Edge | null;
    existing_vertex: Vertex;
    direction: Direction;
    orient: Orientation;
    constructor(v: Vertex, e: Edge | null, direction: Direction, face: Face, orient: Orientation, new_edge: Edge, new_vertex: Vertex);
    execute(): void;
    unexecute(): void;
}
