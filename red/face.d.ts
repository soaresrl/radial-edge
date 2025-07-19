import GeoObject from "../geo/object";
import Point from "../geo/point";
import BoundingBox from "../utils/bbox";
import { Attribute } from "./definitions";
import FaceUse from "./faceuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";
export default class Face extends CircularDoublyLinkedListItem implements GeoObject {
    static counter: number;
    id: number;
    faceuse: FaceUse | null;
    attribute?: Attribute;
    constructor();
    computeBoundingBox(): BoundingBox;
    intersectBBox(box: BoundingBox): boolean;
    triBoxOverlap(box: BoundingBox): boolean;
    enclose(s: Shell, pflag: boolean): boolean;
    getFaceOuterVertices(): Point[];
}
