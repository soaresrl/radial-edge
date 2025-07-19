import GeoObject from "../geo/object";
import Model from "../red/model";
import BoundingBox from "./bbox";
export declare class Node {
    isLeaf: boolean;
    children: (GeoObject | Node)[];
    bbox: BoundingBox;
    parent: Node;
    constructor(isLeaf: boolean);
    updateBoundingBox(): void;
}
export default class RTree {
    private maxEntries;
    root: Node;
    leaves: Node[];
    constructor(maxEntries?: number);
    insert(obj: GeoObject): void;
    buildFromModel(model: Model): void;
    chooseLeaf(node: Node, obj: GeoObject): Node;
    splitNode(node: Node): void;
    findParent(current: Node, target: Node): Node | null;
    traverse(callback: (node: Node) => void): void;
    intersect(obj: GeoObject, callback: (node: Node) => void, render: (bbox: BoundingBox, isLeaf: boolean) => void): void;
}
