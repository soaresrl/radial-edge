class ItemNode<T> {
    public data: T;
    public next: ItemNode <T> | null = null;
    public previous: ItemNode <T> | null = null;
    
    constructor(data: T){
        this.data = data;
    }
}

class DoublyLinkedList<T> {
    public head: ItemNode<T> | null = null;
    public last: ItemNode<T> | null = null;
    public next: ItemNode<T> | null = null;

    public add(data: T){
        const newNode = new ItemNode<T>(data);

        if (!this.head){
            this.head = newNode;
            this.last = newNode;
        } else {
            this.last!.next = newNode;
            newNode.previous = this.last;
            this.last = newNode;
        }
    }

    public remove(item: ItemNode<T>){
        let current = this.head;

        while (current){
            if (current === item){
                if (current === this.head){
                    this.head = current.next;
                    if (this.head){
                        this.head.previous = null;
                    }
                } else if (current === this.last){
                    this.last = current.previous;
                    if (this.last){
                        this.last.next = null;
                    }
                } else {
                    current.previous!.next = current.next;
                    current.next!.previous = current.previous;
                }
            }
            current = current.next;
        }
    }

    public print(){
        let current = this.head;

        while (current){
            current = current.next;
        }
    }
}


export default DoublyLinkedList;