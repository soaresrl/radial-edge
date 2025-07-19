import BoundingBox from "../utils/bbox";

// export default abstract class GeoObject {
//     abstract computeBoundingBox(): BoundingBox;
//     abstract intersectBBox(box: BoundingBox): boolean;
//     abstract triBoxOverlap(box: BoundingBox): boolean;
// }

export default interface GeoObject {
    computeBoundingBox(): BoundingBox;
    intersectBBox(box: BoundingBox): boolean;
    triBoxOverlap(box: BoundingBox): boolean;
}