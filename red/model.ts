import { Attribute } from "./definitions";
import Edge from "./edge";
import Face from "./face";
import Loop from "./loop";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import Vertex from "./vertex";

export default class Model extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number = 0;

    public region: Region | null = null;
    public face: Face | null = null;
    public loop: Loop | null = null;
    public edge: Edge | null = null;
    public vertex: Vertex | null = null;
    public attr?: Attribute;

    constructor(){
        super();
        
        Model.counter++;
        this.id = Model.counter;
    }
}