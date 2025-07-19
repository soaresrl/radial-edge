import Edge from "../edge";
import Region from "../region";
import Vertex from "../vertex";
import Operator from "./operator";
export declare class MEV extends Operator {
    vertex_begin: Vertex;
    region: Region;
    new_edge: Edge;
    new_vertex: Vertex;
    constructor(vertex_begin: Vertex, region: Region, new_edge: Edge, new_vertex: Vertex);
    execute(): void;
    unexecute(): void;
}
