import GeoObject from "../geo/object";
import Point from "../geo/point";
import BoundingBox from "../utils/bbox";
import { Attribute, DescType } from "./definitions";
import FaceUse from "./faceuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";

export default class Face extends CircularDoublyLinkedListItem implements GeoObject {
    public static counter: number = 0;
    public id: number;

    public faceuse: FaceUse | null = null;

    public attribute?: Attribute;

    constructor(){
        super();
        
        Face.counter++;
        this.id = Face.counter;
    }
    
    computeBoundingBox(): BoundingBox {
        const points: Point[] = [];

        let eu_t = this.faceuse.loopuse.edgeuse;
        const first_eu = this.faceuse.loopuse.edgeuse;

        do {
            points.push(eu_t.vertexUse.vertex.point);

            eu_t = eu_t.counterClockwiseEdgeUse;
        } while (first_eu != eu_t);

        return BoundingBox.computeBoundingBox(points);
    }

    intersectBBox(box: BoundingBox): boolean {
        throw new Error("Method not implemented.");
    }

    triBoxOverlap(box: BoundingBox): boolean {
        throw new Error("Method not implemented.");
    }

    enclose(s: Shell, pflag: boolean) {
        let fut: FaceUse;
        let fu_first: FaceUse;
        let flag: boolean = false;
        let ecls: boolean = false;
        let mark_flag: boolean = false;

        this.faceuse.traverse_from_shell(null, mark_flag, pflag);

        if(this.faceuse.mate.cnt > 0) {
            ecls = true;
        } else {
            this.faceuse.cnt = -this.faceuse.cnt;
            this.faceuse.mate.cnt = -this.faceuse.mate.cnt;

            if(s.desc_type == DescType.FACEUSE && s.faceuse != null) {
                s.for_all_faceuses(fut, fu_first, flag, () => {if(fut.cnt < 0) fut.cnt = -fut.cnt});
            }
        }

        return ecls;
    }

    getFaceOuterVertices(){
        const first_eu = this.faceuse.loopuse.edgeuse;
        let eu_t = this.faceuse.loopuse.edgeuse;
        
        const points: Point[] = [];
        do {
            const p = eu_t.vertexUse.vertex.point;
            
            points.push(p)
            eu_t = eu_t.counterClockwiseEdgeUse;
        } while (eu_t !== first_eu);

        return points;
    }
}