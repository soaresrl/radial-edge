import BoundingBox from "../utils/bbox";
export default interface GeoObject {
    computeBoundingBox(): BoundingBox;
    intersectBBox(box: BoundingBox): boolean;
    triBoxOverlap(box: BoundingBox): boolean;
}
