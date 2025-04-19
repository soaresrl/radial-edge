import { DescType, Direction, Orientation } from "../definitions";
import Edge from "../edge";
import EdgeUse from "../edgeuse";
import Face from "../face";
import FaceUse from "../faceuse";
import Loop from "../loop";
import LoopUse from "../loopuse";
import Shell from "../shell";
import { IsEdgeOnFaceResult } from "../sup";
import { for_all_eu_in_lu, link_vu, link_wing } from "../utils";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";

export default class MME extends Operator {
    private v1: Vertex;
    private e1: Edge;
    private dir1: Direction;
    private e2: Edge;
    private v2: Vertex;
    private dir2: Direction;
    private f: Face;
    private orient: Orientation;
    private newEdge: Edge;
    private newFace: Face;
    private newLoop: Loop;
    
    constructor(v1: Vertex, e1: Edge, dir1: Direction, v2: Vertex, e2: Edge, dir2: Direction, f: Face, orient: Orientation, newEdge: Edge, newFace: Face, newLoop: Loop) {
        super();

        this.v1 = v1;
        this.e1 = e1;
        this.dir1 = dir1;
        this.v2 = v2;
        this.e2 = e2;
        this.dir2 = dir2;
        this.f = f;
        this.orient = orient;
        this.newEdge = newEdge;
        this.newFace = newFace;
        this.newLoop = newLoop;
    }

    execute(): void {
        let newvu1: VertexUse, newvu2: VertexUse, newvu3: VertexUse, newvu4: VertexUse;
        let neweu1: EdgeUse, neweu2: EdgeUse, neweu3: EdgeUse, neweu4: EdgeUse;

        // found vertex uses
        let {
            eu: eu_v1,
            vu: vu_v1,
            lu: lu_v1,
            fu: fu_v1,
            result
        } = this.v1!.liesOnFace(this.f);

        if (!result) {
            return;
        }

        let {
            eu: eu_v2,
            vu: vu_v2,
            lu: lu_v2,
            fu: fu_v2,
            result: result2
        } = this.v2!.liesOnFace(this.f);

        if (!result2) {
            return;
        }

        const {
            result: result_e1
        } = ((): IsEdgeOnFaceResult => {
            if (this.e1 && ((this.dir1 == Direction.CW) || (this.dir1 == Direction.CCW))) {
                return this.e1!.liesOnFace(this.f);
            }

            return {
                eu: null,
                lu: null,
                fu: null,
                result: false
            }
        })();

        if (!result_e1) {
            return;
        }

        const {
            result: result_e2
        } = ((): IsEdgeOnFaceResult => {
            if (this.e2 && ((this.dir2 == Direction.CW) || (this.dir2 == Direction.CCW))) {
                return this.e2!.liesOnFace(this.f);
            }

            return {
                eu: null,
                lu: null,
                fu: null,
                result: false
            }
        })();

        if (!result_e2) {
            return;
        }

        neweu1 = new EdgeUse();
        neweu2 = new EdgeUse();
        neweu3 = new EdgeUse();
        neweu4 = new EdgeUse();

        if (this.orient != Orientation.UNSPECIFIED) {
            if(fu_v1!.orientation != this.orient) {
                lu_v1 = lu_v1!.mate;
                fu_v1 = fu_v1!.mate;

                if (eu_v1) {
                    eu_v1 = eu_v1!.mate;
                }
            }

            if(fu_v2!.orientation != this.orient) {
                lu_v2 = lu_v2!.mate;
                fu_v2 = fu_v2!.mate;

                if (eu_v2) {
                    eu_v2 = eu_v2!.mate;
                }
            }
        }

        this.newEdge.edgeuse = neweu1;

        if (lu_v1!.loop == lu_v2!.loop) {
            // MEFL
            let newfu1 = new FaceUse();
            let newfu2 = new FaceUse();

            // newfu1 = new FaceUse();
            // newfu2 = new FaceUse();
            let newlu1 = new LoopUse();
            let newlu2 = new LoopUse();

            let s1: Shell, s2: Shell;

            lu_v2 = lu_v1!.mate;

            // fill the new face and faceuses
            // make newfu1 the same shell as the found faceuse

            this.newFace.faceuse = newfu1;

            s1 = fu_v1!.owningShell!;
            s2 = (fu_v1!.mate)!.owningShell!

            s1.faceuse = s1.faceuse!.link(newfu1);
            s2.faceuse = s2.faceuse!.link(newfu2);
            // s1.faceuse!.link(newfu1)
            // s2.faceuse!.link(newfu2);

            newfu1.fill_fu(s1, newfu2, newlu1, fu_v1!.orientation, this.newFace);
            newfu2.fill_fu(s2, newfu1, newlu2, fu_v1!.mate!.orientation, this.newFace);
    
            this.newLoop.loopuse = newlu1;

            newlu1.next = newlu1;
            newlu1.last = newlu1;

            newlu2.next = newlu2;
            newlu2.last = newlu2;

            if (this.v1 == this.v2) {
                // check whether the given vertex is a loop vertex
                if (!eu_v1) {
                    // the given vertex is a loop vertex
                    newvu1 = lu_v1!.vertexuse!;
                    newvu2 = lu_v2!.vertexuse!;

                    // reset loopuse down pointers

                    lu_v1!.down = DescType.EDGEUSE;
                    lu_v2!.down = DescType.EDGEUSE;
                } else {
                    newvu1 = new VertexUse();
                    newvu2 = new VertexUse();
                }

                newvu3 = new VertexUse();
                newvu4 = new VertexUse();

                newlu1.fill_lu_edgeuse(newfu1, newlu2, this.newLoop, neweu1);
                newlu2.fill_lu_edgeuse(newfu2, newlu1, this.newLoop, neweu4);
                neweu1.fill_eu_loopuse(newvu1, neweu4, this.newEdge, newlu1, null, null, neweu2, Orientation.SAME);
                neweu2.fill_eu_loopuse(newvu3, neweu3, this.newEdge, lu_v1!, null, null, neweu1, Orientation.OPPOSITE);
                neweu3.fill_eu_loopuse(newvu2, neweu2, this.newEdge, lu_v2!, null, null, neweu4, Orientation.SAME);
                neweu4.fill_eu_loopuse(newvu4, neweu1, this.newEdge, newlu2, null, null, neweu3, Orientation.OPPOSITE);

                newvu1.fill_vu_edgeuse(this.v1, neweu3);
                newvu3.fill_vu_edgeuse(this.v1, neweu2);
                newvu4.fill_vu_edgeuse(this.v1, neweu4);

                if(eu_v1) {
                    link_vu(newvu1, this.v1, DescType.EDGEUSE, this.newEdge, null);
                    link_vu(newvu2, this.v1, DescType.EDGEUSE, this.newEdge, null);
                }

                link_vu(newvu3, this.v1, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu4, this.v1, DescType.EDGEUSE, this.newEdge, null);

                // now the cw and ccw fields for the new edgeuses
                if (!eu_v1) {
                    neweu1.clockwiseEdgeUse = neweu1;
                    neweu1.counterClockwiseEdgeUse = neweu1;
                    neweu2.clockwiseEdgeUse = neweu2;
                    neweu2.counterClockwiseEdgeUse = neweu2;
                    neweu3.clockwiseEdgeUse = neweu3;
                    neweu3.counterClockwiseEdgeUse = neweu3;
                    neweu4.clockwiseEdgeUse = neweu4;
                    neweu4.counterClockwiseEdgeUse = neweu4;
                } else {
                    link_wing(this.v1, this.e1, this.dir1, lu_v1!, neweu2, neweu1, neweu4, neweu3, true);
                    link_wing(this.v1, this.e2, this.dir2, lu_v1!, neweu1, neweu2, neweu3, neweu4, false);
                }

                // set the edge loop pointers in the edges of the new loopuses
                for_all_eu_in_lu(newlu1.edgeuse!, (eu)=> {eu.loopuse = newlu1});
                for_all_eu_in_lu(newlu2.edgeuse!, (eu)=> {eu.loopuse = newlu2});

                lu_v1!.edgeuse = neweu2;
                lu_v2!.edgeuse = neweu3;
            } else {
                // the two given vertex are not the same
                // in this case, since we have only one loop, the two distinct vertices cannot be loop vertices
                // so we create four new vertexuses, two for each vertex

                // create the new vertex use
                newvu1 = new VertexUse();
                newvu2 = new VertexUse();
                newvu3 = new VertexUse();
                newvu4 = new VertexUse();

                if (this.dir1 == Direction.CW) {
                    newlu1.fill_lu_edgeuse(newfu1, newlu2, this.newLoop, neweu2);
                    newlu2.fill_lu_edgeuse(newfu2, newlu1, this.newLoop, neweu3);
                    neweu1.fill_eu_loopuse(newvu1, neweu4, this.newEdge, lu_v1!, null, null, neweu2, Orientation.SAME);
                    neweu2.fill_eu_loopuse(newvu3, neweu3, this.newEdge, newlu1, null, null, neweu1, Orientation.OPPOSITE);
                    neweu3.fill_eu_loopuse(newvu2, neweu2, this.newEdge, newlu2, null, null, neweu4, Orientation.SAME);
                    neweu4.fill_eu_loopuse(newvu4, neweu1, this.newEdge, lu_v2!, null, null, neweu3, Orientation.OPPOSITE);
                } else {
                    newlu1.fill_lu_edgeuse(newfu1, newlu2, this.newLoop, neweu1);
                    newlu2.fill_lu_edgeuse(newfu2, newlu1, this.newLoop, neweu4);
                    neweu1.fill_eu_loopuse(newvu1, neweu4, this.newEdge, newlu1, null, null, neweu2, Orientation.SAME);
                    neweu2.fill_eu_loopuse(newvu3, neweu3, this.newEdge, lu_v1!, null, null, neweu1, Orientation.OPPOSITE);
                    neweu3.fill_eu_loopuse(newvu2, neweu2, this.newEdge, lu_v2!, null, null, neweu4, Orientation.SAME);
                    neweu4.fill_eu_loopuse(newvu4, neweu1, this.newEdge, newlu2, null, null, neweu3, Orientation.OPPOSITE);
                }

                newvu1.fill_vu_edgeuse(this.v1, neweu1);
                newvu2.fill_vu_edgeuse(this.v1, neweu3);
                newvu3.fill_vu_edgeuse(this.v2, neweu2);
                newvu4.fill_vu_edgeuse(this.v2, neweu4);

                link_vu(newvu1, this.v1, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu2, this.v1, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu3, this.v2, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu4, this.v2, DescType.EDGEUSE, this.newEdge, null);

                link_wing(this.v1, this.e1, this.dir1, lu_v1!, neweu1, neweu2, neweu3, neweu4, true);
                link_wing(this.v2, this.e2, this.dir2, lu_v1!, neweu2, neweu1, neweu4, neweu3, false);

                for_all_eu_in_lu(newlu1.edgeuse!, (eu)=> {eu.loopuse = newlu1});
                for_all_eu_in_lu(newlu2.edgeuse!, (eu)=> {eu.loopuse = newlu2});

                if (this.dir1 == Direction.CW) {
                    lu_v1!.edgeuse = neweu1;
                    lu_v2!.edgeuse = neweu4;
                } else {
                    lu_v1!.edgeuse = neweu2;
                    lu_v2!.edgeuse = neweu3; 
                }
            }
        } else {
            // MEKL

            // Check whether one or both the given vertices are loop vertices
            // In that case we use the corresponding vertexuses for the corresponding new edgeuses
            // Otherwise we create new vertexuses and add them to the list of vertexuses of the corresponding vertex
            
            if (!eu_v1) {
                newvu1 = lu_v1!.vertexuse!;
                newvu2 = lu_v1!.mate!.vertexuse!;
                
                // reset values in the loop and vertex uses
                newvu1.up = DescType.EDGEUSE;
                newvu1.edgeuse = neweu1;
                newvu2.up = DescType.EDGEUSE;
                newvu2.edgeuse = neweu3;

                lu_v1!.down = DescType.EDGEUSE;
                lu_v1!.mate!.down = DescType.EDGEUSE;

                // now the new edgeuses that depend on these vertexuses
                neweu1.fill_eu_loopuse(newvu1, neweu4, this.newEdge, lu_v1!, null, null, neweu2, Orientation.SAME);
                neweu3.fill_eu_loopuse(newvu2, neweu2, this.newEdge, lu_v1!.mate!, null, null, neweu4, Orientation.SAME);
            } else {
                newvu1 = new VertexUse();
                newvu2 = new VertexUse();

                newvu1.fill_vu_edgeuse(this.v1, neweu1);
                newvu2.fill_vu_edgeuse(this.v1, neweu3);

                neweu1.fill_eu_loopuse(newvu1, neweu4, this.newEdge, lu_v1!, null, null, neweu2, Orientation.SAME);
                neweu3.fill_eu_loopuse(newvu2, neweu2, this.newEdge, lu_v1!.mate!, null, null, neweu4, Orientation.SAME);

                link_vu(newvu1, this.v1, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu2, this.v1, DescType.EDGEUSE, this.newEdge, null);
            }

            if (!eu_v2) {
                // the second vertex is a loop vertex

                newvu3 = lu_v2!.vertexuse!;
                newvu4 = lu_v2!.mate!.vertexuse!;

                // reset values in the loop and vertex uses
                newvu3.up = DescType.EDGEUSE;
                newvu3.edgeuse = neweu2;
                newvu4.up = DescType.EDGEUSE;
                newvu4.edgeuse = neweu4;

                // just temporarely
                lu_v2!.down = DescType.EDGEUSE;
                lu_v2!.mate!.down = DescType.EDGEUSE;

                neweu2.fill_eu_loopuse(newvu3, neweu3, this.newEdge, lu_v1!, null, null, neweu1, Orientation.OPPOSITE);
                neweu2.fill_eu_loopuse(newvu4, neweu1, this.newEdge, lu_v1!.mate!, null, null, neweu3, Orientation.OPPOSITE);
            } else {
                // the second vertex is not a loop vertex
                // we create new vertexuses for the existing vertex
                newvu3 = new VertexUse();
                newvu4 = new VertexUse();

                newvu3.fill_vu_edgeuse(this.v2, neweu2);
                newvu4.fill_vu_edgeuse(this.v2, neweu4);

                neweu2.fill_eu_loopuse(newvu3, neweu3, this.newEdge, lu_v1!, null, null, neweu1, Orientation.OPPOSITE);
                neweu4.fill_eu_loopuse(newvu4, neweu1, this.newEdge, lu_v1!.mate!, null, null, neweu3, Orientation.OPPOSITE);

                link_vu(newvu3, this.v2, DescType.EDGEUSE, this.newEdge, null);
                link_vu(newvu4, this.v2, DescType.EDGEUSE, this.newEdge, null);
            }

            // now at each end of the new edge we set the wing edgeuse fields, i.e the cw and the ccw fields

            if (!eu_v1) {
                neweu1.counterClockwiseEdgeUse = neweu2;
                neweu2.clockwiseEdgeUse = neweu1;
                neweu3.counterClockwiseEdgeUse = neweu4;
                neweu4.clockwiseEdgeUse = neweu3;
            } else {
                link_wing(this.v1, this.e1, this.dir1, lu_v1!, neweu1, neweu2, neweu3, neweu4, false);
            }

            if(!eu_v2){
                neweu1.clockwiseEdgeUse = neweu2;
                neweu2.counterClockwiseEdgeUse = neweu1;
                neweu3.clockwiseEdgeUse = neweu4;
                neweu4.counterClockwiseEdgeUse = neweu3;
            } else {
                link_wing(this.v2, this.e2, this.dir2, lu_v2!, neweu2, neweu1, neweu4, neweu3, false);
            }

            // now set the existing loopuses to point to new edgeuses
            lu_v1!.edgeuse = neweu1;
            lu_v1!.mate!.edgeuse = neweu4;

            lu_v2!.unlink(fu_v1!.loopuse!);
            lu_v2!.mate!.unlink(fu_v1!.mate!.loopuse!);

            /*  kill the loop and loopuses that were associated to v2	*/

            // red_kill(LOOP,lu_v2->lul_ptr);
            // red_kill(LOOPUSE,lu_v2->lulu_mate_ptr);
            // red_kill(LOOPUSE,lu_v2);

            // set all the edge_loop pointers in the edge uses of the kept loop uses
            for_all_eu_in_lu(lu_v1!.edgeuse!, (eu)=> {eu.loopuse = lu_v1!});
            lu_v1 = lu_v1!.mate;
            for_all_eu_in_lu(lu_v1!.edgeuse!, (eu)=> {eu.loopuse = lu_v1!});

            /*  finally return NILL values for "newf" and "newl"		*/

            // *newf = 0;
            // *newl = 0;
        }
    }

    unexecute(): void {
        
    }
}