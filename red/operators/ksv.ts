import Region from "../region";
import Shell from "../shell";
import Vertex from "../vertex";
import MSV from "./msv";
import Operator from "./operator";

export default class KSV extends Operator {
    private region: Region;
    private shell: Shell;
    private vertex: Vertex;

    constructor(owning_region: Region, new_shell: Shell, new_vertex: Vertex){
        super();
        
        this.region = owning_region;
        this.shell = new_shell;
        this.vertex = new_vertex;
    }

    public execute(){
        // this.vertex.vertexuse!.next = undefined;
        // this.vertex.vertexuse!.last = undefined;
        
        this.vertex.vertexuse = null;

        this.shell.vertexuse = null;
        this.shell.desc_type = null;

        if (this.shell.next === this.shell){
            this.region.shell = null;
            return;
        }

        // TODO: fix this
        if (this.region.shell === this.shell){
            // this.region.shell = this.shell.next;
            // this.region.shell!.last = this.shell.last;
            this.shell.next!.last = this.shell.last;
            this.shell.last!.next = this.shell.next;

            this.region.shell = this.shell.next;
        } else {
            this.shell.next!.last = this.shell.last;
            this.shell.last!.next = this.shell.next;
        }
    }

    public unexecute(){
        const msv = new MSV(this.region, this.shell, this.vertex);

        msv.execute();
    }
}