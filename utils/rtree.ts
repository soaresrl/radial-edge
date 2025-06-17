import GeoObject from "../geo/object";
import Point from "../geo/point";
import BoundingBox from "./bbox";

export class Node {
    public isLeaf: boolean;
    public children: (GeoObject | Node)[] = [];
    public bbox: BoundingBox;
    public parent: Node = null;
    
    constructor(isLeaf: boolean) {
        this.isLeaf = isLeaf;

        this.bbox = new BoundingBox(new Point(Infinity, Infinity, Infinity), new Point(-Infinity, -Infinity, -Infinity));
    }

    updateBoundingBox(){
        this.bbox.clear();
        
        if (this.isLeaf) {
            for (const p of this.children as GeoObject[]) {
                const box = p.computeBoundingBox();
                this.bbox.expandToInclude(box);
            }
        } else {
            for (const child of this.children as Node[]) {
                this.bbox.expandToInclude(child.bbox);
            }
        }
    }
}

export default class RTree {
    private maxEntries: number;
    public root: Node;
    public leaves: Node[] = [];

    constructor(maxEntries: number = 3) {
        this.maxEntries = maxEntries;
        this.root = new Node(true);
        this.leaves.push(this.root);
    }

    insert(obj: GeoObject) {
        const leaf = this.chooseLeaf(this.root, obj);
        
        leaf.children.push(obj);
        leaf.updateBoundingBox();

        if (leaf.children.length > this.maxEntries) {
            this.splitNode(leaf);
        }

        // TODO: verificar guardar ponteiro para o parent para evitar buscar toda vez
        let parent = this.findParent(this.root, leaf);

        while (parent != null) {
            parent.updateBoundingBox();

            parent = this.findParent(this.root, parent);
        }
    }

    chooseLeaf(node: Node, obj: GeoObject): Node {
        if (node.isLeaf) {
            return node;
        }

        let bestChild: Node | null = null;
        let minEnlargement = Infinity;

        const objBox = obj.computeBoundingBox();

        for (const child of node.children as Node[]) {
            const currentBox = child.bbox;
            const enlargedBox = new BoundingBox(
                new Point(
                    Math.min(currentBox.min.x, objBox.min.x),
                    Math.min(currentBox.min.y, objBox.min.y),
                    Math.min(currentBox.min.z, objBox.min.z),
                ),
                new Point(
                    Math.max(currentBox.max.x, objBox.max.x),
                    Math.max(currentBox.max.y, objBox.max.y),
                    Math.max(currentBox.max.z, objBox.max.z),
                )
            );

            const enlargement =
                (enlargedBox.max.x - enlargedBox.min.x) *
                (enlargedBox.max.y - enlargedBox.min.y) *
                (enlargedBox.max.z - enlargedBox.min.z) -
                (currentBox.max.x - currentBox.min.x) *
                (currentBox.max.y - currentBox.min.y) *
                (currentBox.max.z - currentBox.min.z);

            if (enlargement < minEnlargement) {
                minEnlargement = enlargement;
                bestChild = child;
            }
        }

        return this.chooseLeaf(bestChild!, obj);
    }

    splitNode(node: Node) {
        const parent = this.findParent(this.root, node);
        // const parent = node.parent;

        const newNode = new Node(node.isLeaf);

        if (node.isLeaf) this.leaves.push(newNode);

        const allItems = node.children;
        node.children = [];
        newNode.children = [];

        const half = Math.ceil(allItems.length / 2);
        node.children = allItems.slice(0, half);
        newNode.children = allItems.slice(half);

        node.updateBoundingBox();
        newNode.updateBoundingBox();

        if (parent == null) {
            const newRoot = new Node(false);
            newRoot.children.push(node);
            newRoot.children.push(newNode);
            newRoot.updateBoundingBox();
            this.root = newRoot;

            node.parent = newRoot;
            newNode.parent = newRoot;
        } else {
            parent.children.push(newNode);
            parent.updateBoundingBox();

            newNode.parent = parent;

            if (parent.children.length > this.maxEntries) {
                this.splitNode(parent);
            }
        }
    }

    findParent(current: Node, target: Node): Node | null {
        if (current.isLeaf) return null;

        for (const child of current.children as Node[]) {
            if (child === target) {
                return current;
            }
            if (!child.isLeaf) {
                const result = this.findParent(child, target);
                if (result) return result;
            }
        }
        return null;
    }

    traverse(callback: (node: Node) => void) {
        const traverseNode = (node: Node) => {
            callback(node);
            if (!node.isLeaf) {
                for (const child of node.children as Node[]) {
                    traverseNode(child);
                }
            }
        };
        traverseNode(this.root);
    }

    intersect(obj: GeoObject, callback: (node: Node) => void, render: (bbox: BoundingBox, isLeaf: boolean) => void) {
        const stack =  [this.root];
        let lastNode = this.root;
        let leavesIntersected = 0;
        while (stack.length > 0) {
            const node = stack.pop()!;
            
            if (!obj.computeBoundingBox().intersects(node.bbox)) {
                lastNode = node;
                continue;
            } 

            if (node.isLeaf) {
                leavesIntersected++;
                lastNode = node;

                render(node.bbox, node.isLeaf);
                callback(node);
            } else {
                for (const child of node.children as Node[]) {
                    stack.push(child);
                }
            }
        }
        // console.log(leavesIntersected);
        render(lastNode.bbox, lastNode.isLeaf);
        // const intersectNode = (node: Node) => {
        //     if (!obj.intersectBBox(node.bbox)) return;

        //     if (node.isLeaf) {
        //         callback(node);
        //     } else {
        //         for (const child of node.children as Node[]) {
        //             intersectNode(child);
        //         }
        //     }
        // };
        // intersectNode(this.root);
    }
}