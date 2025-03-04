import { Attribute, Orientation } from "./definitions";
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

    constructor(){
        super();
        
        FaceUse.counter++;

        this.id = FaceUse.counter;
    }
}