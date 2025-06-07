import BoundingBox from "../utils/bbox";

export default abstract class GeoObject {
    abstract computeBoundingBox(): BoundingBox;
    abstract intersectBBox(box: BoundingBox): boolean;
    abstract triBoxOverlap(box: BoundingBox): boolean;
}