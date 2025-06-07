import { Attribute, DescType } from "./definitions";
import FaceUse from "./faceuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";

export default class Face extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public faceuse: FaceUse | null = null;

    public attribute?: Attribute;

    constructor(){
        super();
        
        Face.counter++;
        this.id = Face.counter;
    }

    enclose(s: Shell, pflag: boolean) {
        let fut: FaceUse;
        let fu_first: FaceUse;
        let flag: boolean = false;
        let ecls: boolean = false;
        let mark_flag: boolean = false;

        this.faceuse.traverse_from_shell(null, mark_flag, pflag);

        if(this.faceuse.mate.cnt > 0) {
            ecls = true;
        } else {
            this.faceuse.cnt = -this.faceuse.cnt;
            this.faceuse.mate.cnt = -this.faceuse.mate.cnt;

            if(s.desc_type == DescType.FACEUSE && s.faceuse != null) {
                s.for_all_faceuses(fut, fu_first, flag, () => {if(fut.cnt < 0) fut.cnt = -fut.cnt});
            }
        }

        return ecls;
    }
}