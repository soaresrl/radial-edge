import { Attribute } from "./definitions";
import Model from "./model";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";
export default class Region extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    model: Model | null;
    shell: Shell | null;
    attr?: Attribute;
    num_shells: number;
    constructor();
}
