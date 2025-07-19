import Region from "../region";
import Shell from "../shell";
import Vertex from "../vertex";
import Operator from "./operator";
export default class MSV extends Operator {
    private region;
    private shell;
    private vertex;
    constructor(owning_region: Region, new_shell: Shell, new_vertex: Vertex);
    execute(): void;
    unexecute(): void;
}
