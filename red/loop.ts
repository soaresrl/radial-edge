import { Attribute } from "./definitions";
import LoopUse from "./loopuse";
import { CircularDoublyLinkedListItem } from "./utils";

export default class Loop extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public loopuse: LoopUse | null = null;

    public attribute?: Attribute;

    constructor(){
        super();

        Loop.counter++;
        this.id = Loop.counter;
    }
}