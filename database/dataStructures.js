class Queue {
  constructor() {
    this.queue = [];
    this.offset = 0;
  }

  enqueue(x) { // add to end
    this.queue.push(x);
  }
  dequeue() { // remove from beginning
    return this.size() > 0 ? this.queue[this.offset++] : undefined;
  }
  first() { // get from beginning without removing
    return this.size() > 0 ? this.queue[this.offset] : undefined;
  }
  size() { // equivalent of array.prototype.length
    return this.queue.length - this.offset;
  }
};


module.exports = {};
module.exports.Queue = Queue;

// // testing
// const x = new Queue();
// console.log(x.dequeue());
// x.enqueue(1);
// console.log(x.size());
// x.enqueue(2);
// x.enqueue(3);
// x.enqueue(4);
// console.log(x.dequeue());
// console.log(x.dequeue());
// console.log(x.size());
// x.enqueue(5);
// console.log(x.size());
// console.log(x.dequeue());
// console.log(x.dequeue());
// console.log(x.dequeue());
// console.log(x.dequeue());
