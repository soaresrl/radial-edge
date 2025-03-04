import { Attribute } from "./definitions";
import FaceUse from "./faceuse";
import { CircularDoublyLinkedListItem } from "./utils";
export default class Face extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    faceuse: FaceUse | null;
    attribute?: Attribute;
    constructor();
}
