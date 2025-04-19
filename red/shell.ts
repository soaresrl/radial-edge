import { v1 } from 'uuid';

import { DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";

export default class Shell extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;
    public region: Region | null = null;

    public desc_type: DescType | null = null;

    public faceuse: FaceUse | null = null;
    public vertexuse: VertexUse | null = null;
    public edgeuse: EdgeUse | null = null;

    constructor(region: Region){
        super();
        
        this.region = region;

        Shell.counter++;
        this.id = Shell.counter;
    }

    fill_s_faceuse(region: Region, shell_faceuse: FaceUse) {
        this.region = region;
        this.desc_type = DescType.FACEUSE;
        this.faceuse = shell_faceuse;
    }
}