"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemNode {
    constructor(data) {
        this.next = null;
        this.previous = null;
        this.data = data;
    }
}
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.last = null;
        this.next = null;
    }
    add(data) {
        const newNode = new ItemNode(data);
        if (!this.head) {
            this.head = newNode;
            this.last = newNode;
        }
        else {
            this.last.next = newNode;
            newNode.previous = this.last;
            this.last = newNode;
        }
    }
    remove(item) {
        let current = this.head;
        while (current) {
            if (current === item) {
                if (current === this.head) {
                    this.head = current.next;
                    if (this.head) {
                        this.head.previous = null;
                    }
                }
                else if (current === this.last) {
                    this.last = current.previous;
                    if (this.last) {
                        this.last.next = null;
                    }
                }
                else {
                    current.previous.next = current.next;
                    current.next.previous = current.previous;
                }
            }
            current = current.next;
        }
    }
    print() {
        let current = this.head;
        while (current) {
            current = current.next;
        }
    }
}
exports.default = DoublyLinkedList;
//# sourceMappingURL=modelingops.js.map