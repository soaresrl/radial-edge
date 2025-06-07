import { link } from "fs";
import { DescType, Orientation } from "../definitions";
import Edge from "../edge";
import EdgeUse from "../edgeuse";
import Face from "../face";
import FaceUse from "../faceuse";
import Loop from "../loop";
import LoopUse from "../loopuse";
import Region from "../region";
import Shell from "../shell";
import { red_i_eufu } from "../sup";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";
import { CircularDoublyLinkedListItem, link_vu } from "../utils";
import Model from "../model";

export default class MF extends Operator {
    public edge_list: Array<Edge>;
    public face_list: Array<Face>;
    public f_orients: Array<Orientation>;
    public e_orients: Array<Orientation>;
    public newf_orient: Orientation;
    public new_face: Face;
    public new_loop: Loop;
    public new_region: Region;
    public new_shell: Shell;

    constructor(edge_list: Array<Edge>, face_list: Array<Face>, f_orients: Array<Orientation>, e_orients: Array<Orientation>, newf_orient: Orientation, new_face: Face, new_loop: Loop, new_region: Region, new_shell: Shell) {
        super();

        this.edge_list = edge_list;
        this.face_list = face_list;
        this.f_orients = f_orients;
        this.e_orients = e_orients;
        this.newf_orient = newf_orient;
        this.new_face = new_face;
        this.new_loop = new_loop;
        this.new_region = new_region;
        this.new_shell = new_shell;
    }

    execute(): void {
        let newfu1: FaceUse, newfu2: FaceUse;
        let newlu1: LoopUse, newlu2: LoopUse;
        let newvu1: VertexUse, newvu2: VertexUse;
        let neweu1: EdgeUse[] = [], neweu2: EdgeUse[] = [];
        let mate_orient: Orientation;
        let vt: Vertex;
        let vp: Vertex;
        let e_count: number = 0;
        let eut_radial: EdgeUse;
        
        let {v: v_first, s, result} = Edge.isInLoop(this.edge_list, this.face_list, this.f_orients, this.e_orients);

        if (!result) {
            return;
        }

        const n = this.edge_list.length;

        newfu1 = new FaceUse();
        newfu2 = new FaceUse();
        newlu1 = new LoopUse();
        newlu2 = new LoopUse();

        this.new_face.faceuse = newfu1;

        switch (this.newf_orient) {
            case Orientation.OUTSIDE: mate_orient = Orientation.INSIDE; break;
            case Orientation.INSIDE: mate_orient = Orientation.OUTSIDE; break;
            case Orientation.SAME: mate_orient = Orientation.OPPOSITE; break;
            case Orientation.OPPOSITE: mate_orient = Orientation.SAME; break;
            default: mate_orient = Orientation.UNSPECIFIED; this.newf_orient = Orientation.UNSPECIFIED; break;
        }

        newfu1.fill_fu(null, newfu2, newlu1, this.newf_orient, this.new_face);
        newfu2.fill_fu(null, newfu1, newlu2, mate_orient, this.new_face);

        this.new_loop.loopuse = newlu1;

        newlu1.next = newlu1;
        newlu1.last = newlu1;

        newlu2.next = newlu2;
        newlu2.last = newlu2;

        vt = v_first;

        for (let i = 0; i < n; i++) {
            vp = vt;

            if(this.edge_list[i].edgeuse.vertexUse.vertex == vt) {
                vt = this.edge_list[i].edgeuse.mate.vertexUse.vertex;
            } else {
                vt = this.edge_list[i].edgeuse.vertexUse.vertex;
            }
         
            if (this.edge_list[i].edgeuse.up == DescType.LOOPUSE) {
                neweu1.push(new EdgeUse());
                neweu2.push(new EdgeUse())
                newvu1 = new VertexUse();
                newvu2 = new VertexUse();

                let {eu: eut, fu: fut, lu: lut, result } = red_i_eufu(vt, this.edge_list[i], this.face_list[i], this.f_orients[i], this.e_orients[i]);

                // if (!result) {
                //     return;
                // }

                eut_radial = eut.radial!;

                neweu1[i].fill_eu_loopuse(newvu1, neweu2[i], this.edge_list[i], newlu1, null, null, eut, eut_radial.orientation);
                neweu2[i].fill_eu_loopuse(newvu2, neweu1[i], this.edge_list[i], newlu2, null, null, eut_radial, eut.orientation);

                eut.radial = neweu1[i];
                eut_radial.radial = neweu2[i];

                newvu1.fill_vu_edgeuse(vp, neweu1[i]);
                newvu2.fill_vu_edgeuse(vt, neweu2[i]);

                link_vu(newvu1, vp, DescType.EDGEUSE, this.edge_list[i], null);
                link_vu(newvu2, vt, DescType.EDGEUSE, this.edge_list[i], null);
            } else {
                if(this.edge_list[i].edgeuse.vertexUse.vertex == vp) {
                    neweu1.push(this.edge_list[i].edgeuse)
                    neweu2.push(this.edge_list[i].edgeuse.mate)
                } else {
                    neweu1.push(this.edge_list[i].edgeuse.mate)
                    neweu2.push(this.edge_list[i].edgeuse)
                }

                newvu1 = neweu1[i].vertexUse;
                newvu2 = neweu2[i].vertexUse;

                s.edgeuse = s.edgeuse.unlink(neweu1[i]);
                s.edgeuse = s.edgeuse.unlink(neweu2[i]);

                neweu1[i].fill_eu_loopuse(newvu1, neweu2[i], this.edge_list[i], newlu1, null, null, neweu2[i], neweu1[i].orientation);
                neweu2[i].fill_eu_loopuse(newvu2, neweu1[i], this.edge_list[i], newlu2, null, null, neweu1[i], neweu2[i].orientation);
            }
        }

        for (let i = 0; i < n; i++) {
            neweu1[i].clockwiseEdgeUse = neweu1[(i + 1) % n];
            neweu1[(i + 1) % n].counterClockwiseEdgeUse = neweu1[i];

            neweu2[i].counterClockwiseEdgeUse = neweu2[(i + 1) % n];
            neweu2[(i + 1) % n].clockwiseEdgeUse = neweu2[i];
        }

        newlu1.fill_lu_edgeuse(newfu1, newlu2, this.new_loop, neweu1[0]);
        newlu2.fill_lu_edgeuse(newfu2, newlu1, this.new_loop, neweu2[0]);

        neweu1 = null;
        neweu2 = null;

        if (this.new_face.enclose(s, false) == false) { // mfl
            let r: Region;

            r = s.region;

            if (s.desc_type != DescType.FACEUSE) {
                s.fill_s_faceuse(r, newfu1);

                s.faceuse = CircularDoublyLinkedListItem.first(newfu1);
                s.faceuse = s.faceuse.link(newfu2);
            } else {
                s.faceuse = s.faceuse.link(newfu1);
                s.faceuse = s.faceuse.link(newfu2);
            }

            newfu1.owningShell = s;
            newfu2.owningShell = s;

            this.new_region = null;
            this.new_shell = null;
        } else { //mflrs
            let m: Model;
            let r: Region;

            r = s.region;
            m = r.model;

            this.new_region.next = m.region;
            this.new_region.last = m.region.last;
            m.region.last.next = this.new_region;
            m.region.last = this.new_region;

            this.new_region.model = m;
            this.new_region.shell = this.new_shell;

            this.new_shell.next = this.new_shell;
            this.new_shell.last = this.new_shell;

            this.new_shell.fill_s_faceuse(this.new_region, newfu2);

            s.fill_s_faceuse(r, newfu1);

            s.fill_shell_fu(newfu1);
            this.new_shell.fill_shell_fu(newfu2);
        }
    }

       

    unexecute(): void {
        
    }
}
