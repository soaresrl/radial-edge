import Edge from "../edge";
import Region from "../region";
import Vertex from "../vertex";
import Operator from "./operator";
export default class ME extends Operator {
    v1: Vertex;
    v2: Vertex;
    region: Region;
    new_edge: Edge;
    constructor(v1: Vertex, v2: Vertex, region: Region, new_edge: Edge);
    execute(): void;
    unexecute(): void;
}
