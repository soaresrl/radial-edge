import DoublyLinkedList from "../crdt/modelingops";
import { Attribute, DescType, Orientation } from "./definitions";
import EdgeUse from "./edgeuse";
import Face from "./face";
import LoopUse from "./loopuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";

export default class FaceUse extends CircularDoublyLinkedListItem {
    public owningShell: Shell | null = null;
    public face: Face | null = null;

    public mate: FaceUse | null = null;

    public loopuse: LoopUse | null = null;

    public orientation: Orientation = Orientation.UNSPECIFIED;

    public attribute?: Attribute;

    public static counter: number = 0;
    public id: number;

    public cnt: number;

    constructor(){
        super();
        
        FaceUse.counter++;

        this.id = FaceUse.counter;

        this.cnt = FaceUse.counter;
    }

    fill_fu(shell: Shell, mate: FaceUse, lu: LoopUse, orient: Orientation, face: Face){
        this.owningShell = shell;
        this.mate = mate;
        this.loopuse = lu;
        this.orientation = orient;
        this.face = face;
    }

    traverse_from_shell(s: Shell, mark_flag: boolean, pflag: boolean) {
        let adj_fu: FaceUse;
        let lut: LoopUse;
        let lu_first: LoopUse;
        let eut: EdgeUse;
        let eu_first: EdgeUse;

        // From the C code:
        // if ( pflag == 1 ) {
        //     printf("Enter:\n") ;
        //     printf("faceuse = %d with orientation = %d\n", 
        //         fu->cnt, fu->orientation ) ;
        //     printf("face = %d\n", fu->fuf_ptr->cnt ) ;
        // if ( sas_GetDSface(fu->fuf_ptr) == sMain )
        //     printf("face is sMain crack face\n" ) ;
        // else if ( sas_GetDSface(fu->fuf_ptr) == sOther )
        //     printf("face is sOther crack face\n" ) ;
        // }

        this.cnt = -(this.cnt);

        if (s != null) {
            if (s.faceuse == null) {
                s.faceuse = CircularDoublyLinkedListItem.first(this);
            } else {
                s.faceuse = s.faceuse.link(this);
            }
            this.owningShell = s;
        }

        lut = this.loopuse;
        lu_first = this.loopuse;

        do {
            if (lut.down == DescType.EDGEUSE) {
                eut = lut.edgeuse;
                eu_first = eut;
                do {
                    adj_fu = eut.radial.loopuse.faceuse;
                    // From the C code:
                    // if ( pflag == 1 ) {
                    //     printf("adj faceuse = %d with orientation = %d\n",
                    //        adj_fu->cnt, adj_fu->orientation ) ;
                    //     printf("adj face = %d\n", adj_fu->fuf_ptr->cnt ) ;
                    //    if ( sas_GetDSface(adj_fu->fuf_ptr) == sMain )
                    //    printf("adj face is sMain crack face\n" ) ;
                    //    else if ( sas_GetDSface(adj_fu->fuf_ptr) == sOther )
                    //    printf("adj face is sOther crack face\n" ) ;
                    //     printf("common edge = %d\n", eut->eue_ptr->cnt) ;
                    //    if ( sas_GetDSedge(eut->eue_ptr) == sMain )
                    //    printf("edge is sMain\n" ) ;
                    //    else if ( sas_GetDSedge(eut->eue_ptr) == sOther )
                    //    printf("edge is sOther\n" ) ;
                    // }

                    if (mark_flag) {
                        if (adj_fu.cnt > 0) {
                            adj_fu.traverse_from_shell(s, mark_flag, pflag);
                        }
                    } else {
                        if (adj_fu.cnt < 0) {
                            adj_fu.traverse_from_shell(s, mark_flag, pflag);
                        }
                    }
                    eut = eut.clockwiseEdgeUse;
                } while (eut != eu_first)
            }

            lut = lut.next;
        } while (lut != lu_first)
    }   
}