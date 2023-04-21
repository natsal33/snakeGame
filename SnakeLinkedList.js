class SnakeLinkedList {
  constructor(head = null) {
    this.head = head;
  }

  //insert first
  insertFirst(inX, inY) {
    let newNode = new SnakeNode(inX, inY, this.head);
    this.head.parent = newNode;
    this.head = newNode;
    this.size++;
  }

  //insert last
  insertLast(inX, inY) {
    let newNode = new SnakeNode(inX, inY);
    let current;

    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }

      newNode.parent = current;
      current.next = newNode;
    }

    this.size++;
  }

  clearList() {
    this.head = null;
    this.size = 0;
  }
}
