import { Direction, Orientation } from "../definitions";
import Edge from "../edge";
import Face from "../face";
import Loop from "../loop";
import Vertex from "../vertex";
import Operator from "./operator";
export default class MME extends Operator {
    private v1;
    private e1;
    private dir1;
    private e2;
    private v2;
    private dir2;
    private f;
    private orient;
    private newEdge;
    private newFace;
    private newLoop;
    constructor(v1: Vertex, e1: Edge, dir1: Direction, v2: Vertex, e2: Edge, dir2: Direction, f: Face, orient: Orientation, newEdge: Edge, newFace: Face, newLoop: Loop);
    execute(): void;
    unexecute(): void;
}
