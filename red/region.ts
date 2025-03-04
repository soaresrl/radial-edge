import { Attribute } from "./definitions";
import Model from "./model";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";

export default class Region extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public model: Model | null = null;
    public shell: Shell | null = null;
    public attr?: Attribute;

    public num_shells: number = 0;

    constructor(){
        super();
        
        Region.counter++;
        this.id = Region.counter;
    }
}