import DoublyLinkedList from "../../crdt/modelingops";
import Point from "../../geo/point";
import { DescType, Orientation } from "../definitions";
import Edge from "../edge";
import EdgeUse from "../edgeuse";
import FaceUse from "../faceuse";
import LoopUse from "../loopuse";
import Region from "../region";
import Shell from "../shell";
import { CircularDoublyLinkedListItem, fill_eu_shell, fill_vu_edgeuse, link_vu } from "../utils";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";

export class MEV extends Operator {
    public vertex_begin: Vertex;
    public region: Region;
    public new_edge: Edge;
    public new_vertex: Vertex;

    constructor(vertex_begin: Vertex, region: Region /*, point: Point*/) {
        super();    

        this.vertex_begin = vertex_begin;
        this.region = region;

        this.new_edge = new Edge();
        // TODO: add Point on vertex constructor
        this.new_vertex = new Vertex();
    }

    execute(): void {
        let neweu1: EdgeUse = new EdgeUse();
        let neweu2: EdgeUse = new EdgeUse();

        let newvu1: VertexUse = new VertexUse();
        let newvu2: VertexUse;

        // temp topological entities
        let vu_v: VertexUse | null;
        let eu_v: EdgeUse | null;
        let lu_v: LoopUse | null;
        let fu_v: FaceUse | null;
        let s_v: Shell | null; // Shell on region that contain vertex_begin

        const vertexHasUseInRegion = this.vertex_begin.hasUseInRegion(this.region);

        if (!vertexHasUseInRegion.result) {
            return;
        }

        vu_v = vertexHasUseInRegion.vu!;
        eu_v = vertexHasUseInRegion.eu!;
        lu_v = vertexHasUseInRegion.lu!;
        fu_v = vertexHasUseInRegion.fu!;
        s_v = vertexHasUseInRegion.s!;

        if (vu_v!.up == DescType.SHELL) {
            newvu2 = vu_v;

            s_v.vertexuse = null;
            s_v.desc_type = DescType.EDGEUSE;
        } else {
            newvu2 = new VertexUse();
            
            link_vu(newvu2, this.vertex_begin, DescType.EDGEUSE, this.new_edge, null)
        }

        this.new_edge.edgeuse = neweu1;
        this.new_vertex.vertexuse = newvu1;

        fill_vu_edgeuse(newvu2, this.vertex_begin, neweu1);

        newvu1.next = newvu1;
        newvu1.last = newvu1;
        fill_vu_edgeuse(newvu1, this.new_vertex, neweu2);

        fill_eu_shell(neweu1, newvu2, neweu2, this.new_edge, s_v, Orientation.SAME);
        fill_eu_shell(neweu2, newvu1, neweu1, this.new_edge, s_v, Orientation.OPPOSITE);

        if (!s_v.edgeuse) {
            s_v.edgeuse = CircularDoublyLinkedListItem.first(neweu1);

            s_v.edgeuse = s_v.edgeuse.link(neweu2);
        } else {
            s_v.edgeuse = s_v.edgeuse.link(neweu1);
            s_v.edgeuse = s_v.edgeuse.link(neweu2);
        }
    }

    unexecute(): void {
        throw new Error("Method not implemented.");
    }
}