import { DescType, Orientation } from "../definitions";
import Face from "../face";
import FaceUse from "../faceuse";
import Loop from "../loop";
import LoopUse from "../loopuse";
import Region from "../region";
import Shell from "../shell";
import { fill_fu, fill_lu_vertexuse, fill_s_faceuse, fill_vu_loopuse, link_vu } from "../utils";
import Vertex from "../vertex";
import VertexUse from "../vertexuse";
import Operator from "./operator";

export default class MRSFL extends Operator {
    public vertex: Vertex;
    public region: Region;
    public newRegion: Region
    public newShell: Shell;
    public newFace: Face;
    public newLoop: Loop;

    constructor(v: Vertex, owning_region: Region, newR: Region, newS: Shell, newF: Face, newL: Loop){
        super();

        this.vertex = v
        this.region = owning_region;
        this.newRegion = newR;
        this.newShell = newS;
        this.newFace = newF;
        this.newLoop = newL;
    }

    execute(): void {
        const vertexHasUseInRegion = this.vertex.hasUseInRegion(this.region);

        if (!vertexHasUseInRegion.result) {
            return;
        }

        // create necessary descriptors for the new entities;
        const newfu1 = new FaceUse();
        const newfu2 = new FaceUse();
        const newlu1 = new LoopUse();
        const newlu2 = new LoopUse();
        const newvu1 = new VertexUse();
        const newvu2 = new VertexUse();

        // Update doubly linked list of models' regions
        this.newRegion.next = this.region.model!.region!;
        this.newRegion.last = this.region.model!.region!.last;
        this.region.model!.region!.last!.next = this.newRegion;
        this.region.model!.region!.last = this.newRegion;
        this.region.model!.region = this.newRegion;

        // set the owning model and the shell list ptr for the new region
        this.newRegion.model = this.region.model;
        this.newRegion.shell = this.newShell;

        fill_s_faceuse(this.newShell, this.newRegion, newfu1);

        this.newFace.faceuse = newfu1;
        this.newLoop.loopuse = newlu1;

        newfu1.next = newfu1;
        newfu1.last = newfu1;

        fill_fu(newfu1, this.newShell, newfu2, newlu1, Orientation.INSIDE, this.newFace);

        newlu1.next = newlu1;
        newlu1.last = newlu1;

        fill_lu_vertexuse(newlu1, newfu1, newlu2, this.newLoop, newvu1);

        fill_vu_loopuse(newvu1, this.vertex, newlu1);
        
        if (vertexHasUseInRegion.vu!.up == DescType.SHELL) {
            /*	first the case where this vertex was the only thing
                on the existing shell				*/
            /*	we put the existing vertex use on the outside loop	*/

            newfu2.next = newfu2;
            newfu2.last = newfu2;

            fill_fu(newfu2, vertexHasUseInRegion.s!, newfu1, newlu2, Orientation.OUTSIDE, this.newFace);

            newlu2.next = newlu2;
            newlu2.last = newlu2;

            fill_lu_vertexuse(newlu2, newfu2, newlu1, this.newLoop, vertexHasUseInRegion.vu!);

            // now update existing structures
            vertexHasUseInRegion.s!.desc_type = DescType.FACEUSE;
            vertexHasUseInRegion.s!.faceuse = newfu2;

            // TODO: Decide if is necessary to remove the vertex use as the desctype is now faceuse
            // vertexHasUseInRegion.s!.vertexuse = null;

            vertexHasUseInRegion.vu!.up = DescType.LOOPUSE;
            vertexHasUseInRegion.vu!.loopuse = newlu2;

            // TODO: Decide if is necessary to remove the shell pointer as the up ptr type is now loopuse


            // now add the new vertexuse to the list of uses of the vertex
            
            link_vu(newvu1, this.vertex, DescType.LOOPUSE, null, this.newLoop)
        } else {
            newlu2.next = newlu2;
            newlu2.last = newlu2;

            fill_lu_vertexuse(newlu2, newfu2,newlu1, this.newLoop, newvu2);

            fill_fu(newfu2, vertexHasUseInRegion.s!, newfu1, newlu2, Orientation.OUTSIDE, this.newFace);
            if (!vertexHasUseInRegion.s!.faceuse) {
                vertexHasUseInRegion.s!.faceuse = newfu2;
            } else {
                vertexHasUseInRegion.s!.faceuse = vertexHasUseInRegion.s!.faceuse.link(newfu2);
            }

            fill_vu_loopuse(newvu2, this.vertex, newlu2);

            link_vu(newvu1, this.vertex, DescType.LOOPUSE, null, this.newLoop);
            link_vu(newvu2, this.vertex, DescType.LOOPUSE, null, this.newLoop);
        }
        
        vertexHasUseInRegion.s!.desc_type = DescType.FACEUSE;
    }

    unexecute(): void {
        
    }
}