import { DescType, Direction, Orientation } from "../definitions";
import Edge from "../edge";
import EdgeUse from "../edgeuse";
import Face from "../face";
import { IsEdgeOnFaceResult } from "../sup";
import { fill_eu_loopuse, fill_vu_edgeuse, link_vu, link_wing } from "../utils";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";

export default class MMEV extends Operator {
    public new_edge: Edge;
    public new_vertex: Vertex;
    public face: Face;
    public existing_edge: Edge | null = null;
    public existing_vertex: Vertex;
    public direction: Direction;
    public orient: Orientation;

    constructor(v: Vertex, e: Edge | null, direction: Direction, face: Face, orient: Orientation, new_edge: Edge, new_vertex: Vertex){
        super();

        this.existing_vertex = v;
        this.existing_edge = e;
        this.direction = direction;
        this.face = face;
        this.new_edge = new_edge;
        this.new_vertex = new_vertex;
        this.orient = orient;
    }

    execute(): void {
        let {
            eu: eu_v,
            vu: vu_v,
            lu: lu_v,
            fu: fu_v,
            result
        } = this.existing_vertex!.liesOnFace(this.face);

        if (!result) {
            return;
        }

        if (this.existing_edge) {
            const {
                result: result_e
            } = ((): IsEdgeOnFaceResult => {
                if (this.direction == Direction.CW || this.direction == Direction.CCW) {
                    return this.existing_edge!.liesOnFace(this.face);
                }
    
                return {
                    eu: null,
                    lu: null,
                    fu: null,
                    result: false
                }
            })();
    
            if(!result_e) {
                return;
            }
        }
        
        if (this.orient != Orientation.UNSPECIFIED && fu_v!.orientation != this.orient) {
            lu_v = lu_v!.mate;
            fu_v = fu_v!.mate;

            if (eu_v) {
                eu_v = eu_v.mate;
            }
        }

        let neweu1 = new EdgeUse();
        let neweu2 = new EdgeUse();
        let neweu3 = new EdgeUse();
        let neweu4 = new EdgeUse();
        let newvu1 = new VertexUse();
        let newvu2 = new VertexUse();

        this.new_edge.edgeuse = neweu1;
        this.new_vertex.vertexuse = newvu2;

        newvu1.next = newvu2;
        newvu1.last = newvu2;

        fill_vu_edgeuse(newvu1, this.new_vertex, neweu2);

        newvu2.next = newvu1;
        newvu2.last = newvu1;

        fill_vu_edgeuse(newvu2, this.new_vertex, neweu4);

        if (!eu_v) {
            let vu3: VertexUse;
            let vu4: VertexUse;

            vu3 = lu_v!.vertexuse!;
            vu4 = lu_v!.mate!.vertexuse!;

            fill_eu_loopuse(neweu1, vu3, neweu4, this.new_edge, lu_v!, neweu2, neweu2, neweu2, Orientation.SAME);
            fill_eu_loopuse(neweu2, newvu1, neweu3, this.new_edge, lu_v!, neweu1, neweu1, neweu1, Orientation.OPPOSITE);

            fill_eu_loopuse(neweu3, vu4, neweu2, this.new_edge, lu_v!.mate!, neweu4,neweu4, neweu4, Orientation.SAME);
            fill_eu_loopuse(neweu4, newvu2, neweu1, this.new_edge, lu_v!.mate!, neweu3, neweu3, neweu3, Orientation.OPPOSITE);

            vu3.up = DescType.EDGEUSE;
            vu3.edgeuse = neweu1;
            vu4.up = DescType.EDGEUSE;
            vu4.edgeuse = neweu3;
            // TODO: Decide to remove previous loopuse as down ptr type is now edgeuse
            // vu3!.loopuse = null; 

            lu_v!.down = DescType.EDGEUSE;
            lu_v!.edgeuse = neweu1;
            lu_v!.mate!.down = DescType.EDGEUSE;
            lu_v!.mate!.edgeuse = neweu3;

            // TODO: Decide to remove previous vertex use as down ptr type is now edgeuse
            // lu_v!.vertexuse = null; 
        } else {
            let newvu3 = new VertexUse();
            let newvu4 = new VertexUse();

            fill_eu_loopuse(neweu1, newvu3, neweu4, this.new_edge, lu_v!, null, null, neweu2, Orientation.SAME);
            fill_eu_loopuse(neweu2, newvu1, neweu3, this.new_edge, lu_v!, null, null, neweu1, Orientation.OPPOSITE);
            fill_eu_loopuse(neweu3, newvu4, neweu2, this.new_edge, lu_v!.mate!, null, null, neweu4, Orientation.SAME);
            fill_eu_loopuse(neweu4, newvu2, neweu1, this.new_edge, lu_v!.mate!, null, null, neweu3, Orientation.OPPOSITE);

            fill_vu_edgeuse(newvu3, this.existing_vertex, neweu1);
            fill_vu_edgeuse(newvu4, this.existing_vertex, neweu3);

            link_vu(newvu3, this.existing_vertex, DescType.EDGEUSE, this.new_edge, null);
            link_vu(newvu4, this.existing_vertex, DescType.EDGEUSE, this.new_edge, null);

            link_wing(this.existing_vertex, this.existing_edge!, this.direction, lu_v!, neweu1, neweu2, neweu3, neweu4, true);
        }
    }

    unexecute(): void {
        
    }
}