declare class ItemNode<T> {
    data: T;
    next: ItemNode<T> | null;
    previous: ItemNode<T> | null;
    constructor(data: T);
}
declare class DoublyLinkedList<T> {
    head: ItemNode<T> | null;
    last: ItemNode<T> | null;
    next: ItemNode<T> | null;
    add(data: T): void;
    remove(item: ItemNode<T>): void;
    print(): void;
}
export default DoublyLinkedList;
