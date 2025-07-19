import { Attribute } from "./definitions";
import LoopUse from "./loopuse";
import { CircularDoublyLinkedListItem } from "./utils";
export default class Loop extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    loopuse: LoopUse | null;
    attribute?: Attribute;
    constructor();
}
