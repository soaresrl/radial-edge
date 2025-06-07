import { DescType, Orientation } from "../definitions";
import Edge from "../edge";
import EdgeUse from "../edgeuse";
import FaceUse from "../faceuse";
import Region from "../region";
import { CircularDoublyLinkedListItem, for_all_eu_in_s, for_all_fu_in_s, link_vu } from "../utils";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";

export default class ME extends Operator {
    public v1: Vertex;
    public v2: Vertex;
    public region: Region;
    public new_edge: Edge;
    
    constructor(v1: Vertex, v2: Vertex, region: Region, new_edge: Edge) {
        super();

        this.v1 = v1;
        this.v2 = v2;
        this.region = region;
        this.new_edge = new_edge;
    }

    execute(): void {
        let neweu1: EdgeUse = new EdgeUse();
        let neweu2: EdgeUse = new EdgeUse();
        let newvu1: VertexUse;
        let newvu2: VertexUse;

        let {
            vu: vu_v1,
            eu: eu_v1,
            lu: lu_v1,
            fu: fu_v1,
            s: s_v1,
            result: result1
        } = this.v1.hasUseInRegion(this.region);

        if (!result1) {
            return;
        }

        let {
            vu: vu_v2,
            eu: eu_v2,
            lu: lu_v2,
            fu: fu_v2,
            s: s_v2,
            result: result2
        } = this.v1.hasUseInRegion(this.region);

        if (!result2) {
            return;
        }

        

        if (vu_v1.up == DescType.SHELL) {
            newvu2 = vu_v1;
        } else {
            newvu1 = new VertexUse();

            link_vu(newvu1, this.v1, DescType.EDGEUSE, this.new_edge, null);
        }

        if(this.v1 != this.v2 && vu_v2.up == DescType.SHELL) {
            newvu2 = vu_v2;
        } else {
            newvu2 = new VertexUse();

            link_vu(newvu2, this.v2, DescType.EDGEUSE, this.new_edge, null);
        }

        this.new_edge.edgeuse = neweu1;

        if (s_v1 == s_v2) { // ME
            if (this.v1 == this.v2 && vu_v1.up == DescType.SHELL) {
                s_v1.desc_type = DescType.EDGEUSE;
                // todo: s_v1.vertexuse = null; remove this comment since it is garbage collected
            }

            newvu1.fill_vu_edgeuse(this.v1, neweu1);
            newvu2.fill_vu_edgeuse(this.v2, neweu2);

            neweu1.fill_eu_shell(newvu1, neweu2, this.new_edge, s_v1, Orientation.SAME);
            neweu2.fill_eu_shell(newvu2, neweu1, this.new_edge, s_v1, Orientation.OPPOSITE);

            if (s_v1.edgeuse == null) {
                s_v1.edgeuse = CircularDoublyLinkedListItem.first(neweu1);
                
                s_v1.edgeuse = s_v1.edgeuse.link(neweu2);
            } else {
                s_v1.edgeuse = s_v1.edgeuse.link(neweu1);
                s_v1.edgeuse = s_v1.edgeuse.link(neweu2);
            }
        } else { // MEKS
            newvu1.fill_vu_edgeuse(this.v1, neweu1);
            newvu2.fill_vu_edgeuse(this.v2, neweu2);

            neweu1.fill_eu_shell(newvu1, neweu2, this.new_edge, s_v1, Orientation.SAME);
            neweu2.fill_eu_shell(newvu2, neweu1, this.new_edge, s_v2, Orientation.OPPOSITE);

            if (s_v1.edgeuse == null) {
                s_v1.edgeuse = CircularDoublyLinkedListItem.first(neweu1);
                
                s_v1.edgeuse = s_v1.edgeuse.link(neweu2);
            } else {
                s_v1.edgeuse = s_v1.edgeuse.link(neweu1);
                s_v1.edgeuse = s_v1.edgeuse.link(neweu2);
            }

            if(s_v2.edgeuse != null) {
                let eu_head1: EdgeUse, eu_head2: EdgeUse;
                let s_v2_seu_last: EdgeUse;

                for_all_eu_in_s(s_v2.edgeuse, (eu: EdgeUse) => eu.shell = s_v1);

                eu_head1 = s_v1.edgeuse;
                eu_head2 = s_v2.edgeuse;
                s_v2_seu_last = s_v2.edgeuse.last;

                eu_head2.last.next = eu_head1;
                eu_head2.last = eu_head1.last;
                eu_head1.last.next = eu_head2;
                eu_head1.last = s_v2_seu_last;
            }

            if (s_v2.desc_type == DescType.FACEUSE) {
                for_all_fu_in_s(s_v2.faceuse, (fu: FaceUse) => fu.owningShell = s_v1);

                if (s_v1.desc_type != DescType.FACEUSE) {
                    s_v1.faceuse = s_v2.faceuse;                    
                } else {
                    let fu_head1: FaceUse, fu_head2: FaceUse;
                    let s_v2_fu_last: FaceUse;

                    fu_head1 = s_v1.faceuse;
                    fu_head2 = s_v2.faceuse;

                    s_v2_fu_last = s_v2.faceuse.last;

                    fu_head2.last.next = fu_head1;
                    fu_head2.last = fu_head1.last;
                    fu_head1.last.next = fu_head2;
                    fu_head1.last = s_v2_fu_last;
                }
            }

            if(s_v1.desc_type == DescType.VERTEXUSE) {
                if (s_v2.desc_type != DescType.FACEUSE) {
                    s_v1.desc_type = DescType.EDGEUSE;
                } else {
                    s_v1.desc_type = DescType.FACEUSE;
                }
            } else if (s_v1.desc_type == DescType.EDGEUSE) {
                if (s_v2.desc_type == DescType.FACEUSE) {
                    s_v1.desc_type = DescType.FACEUSE;
                }
            }

            // s_v2.unlink(this.region.shell)
            this.region.shell = this.region.shell.unlink(s_v2);
        }
        // TODO: verify all requirements to delete s_v2 as it is garbage collected
    }

    unexecute(): void {
        
    }
}