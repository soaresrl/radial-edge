import { Attribute, Orientation } from "./definitions";
import Face from "./face";
import LoopUse from "./loopuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";
export default class FaceUse extends CircularDoublyLinkedListItem {
    owningShell: Shell | null;
    face: Face | null;
    mate: FaceUse | null;
    loopuse: LoopUse | null;
    orientation: Orientation;
    attribute?: Attribute;
    static counter: number;
    id: number;
    constructor();
}
