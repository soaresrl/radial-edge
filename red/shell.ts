// import { v1 } from 'uuid';

import { DescType, QueryType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
import { red_g_fus } from './query/red_query';

export default class Shell extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;
    public region: Region | null = null;

    public desc_type: DescType | null = null;

    public faceuse: FaceUse | null = null;
    public vertexuse: VertexUse | null = null;
    public edgeuse: EdgeUse | null = null;

    constructor(region: Region){
        super();
        
        this.region = region;

        Shell.counter++;
        this.id = Shell.counter;
    }

    fill_s_faceuse(region: Region, shell_faceuse: FaceUse) {
        this.region = region;
        this.desc_type = DescType.FACEUSE;
        this.faceuse = shell_faceuse;
    }

    for_all_faceuses(fu: FaceUse, first: FaceUse, flag: boolean, operation: () => void) {
        for (flag = true, first = red_g_fus(this, QueryType.FIRST), fu = first; 
             fu != null && (flag || first != fu); 
             fu = red_g_fus(this, QueryType.NEXT)) 
        {
            operation();
        }
    }

    for_all_fu_in_s(head: FaceUse, operation: (fu: FaceUse) => void) {
        let fu: FaceUse = head;
        let fu_first: FaceUse = head;
        
        do {
            operation(fu);
            fu = fu.next;
        } while (fu != fu_first);

    }

    fill_shell_fu(fu: FaceUse) {
        let mark_flag: boolean = false;

        this.faceuse = null;

        if (fu.cnt < 0) {
            mark_flag = false;

            fu.traverse_from_shell(this, mark_flag, false);
        } else {
            mark_flag = true;
            fu.traverse_from_shell(this, mark_flag, false);

            this.for_all_fu_in_s(this.faceuse, (fu) => fu.cnt = -fu.cnt);
        }
    }
}