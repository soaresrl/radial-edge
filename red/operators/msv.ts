import { DescType } from "../definitions";
import Region from "../region";
import Shell from "../shell";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import KSV from "./ksv";
import Operator from "./operator";

export default class MSV extends Operator {
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
        const new_vertexuse = new VertexUse();

        if (!this.region.shell){
           this.shell.next = this.shell;
           this.shell.last = this.shell;
           this.region.shell = this.shell;
        } else {
            this.shell.next = this.region.shell;
            this.shell.last = this.region.shell.last;
            this.region.shell.last!.next = this.shell;
            this.region.shell.last = this.shell;
            this.region.shell = this.shell;
        }

        this.shell.region = this.region;
        this.shell.desc_type = DescType.VERTEXUSE;
        this.shell.vertexuse = new_vertexuse;

        this.vertex.vertexuse = new_vertexuse;

        new_vertexuse.next = new_vertexuse;
        new_vertexuse.last = new_vertexuse;

        new_vertexuse.fill_vu_shell(this.vertex, this.shell);
    }

    public unexecute(){
        const ksv = new KSV(this.region, this.shell, this.vertex);

        ksv.execute();
    }
}