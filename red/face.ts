import { Attribute } from "./definitions";
import FaceUse from "./faceuse";
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
}