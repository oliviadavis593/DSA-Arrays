//Simulates a block of memory
class Memory {
  constructor() {
    this.memory = new Float64Array(1024);
    this.head = 0;
  }

  //reserves a contiguous block of memory slots
  //you can also reserve empty (null) slots in the process
  allocate(size) {
    if (this.head + size > this.memory.length) {
      return null;
    }

    let start = this.head;

    this.head += size;
    return start;
  }

  //free slots reserved using allocate 
  free(ptr) {}

  //copy address in memory slot & can move to one pointer from another pointer
  copy(toIdx, fromIdx, size) {
    if (fromIdx === toIdx) {
      return;
    }

    if (fromIdx > toIdx) {
      // Iterate forwards
      for (let i = 0; i < size; i++) {
        this.set(toIdx + i, this.get(fromIdx + i));
      }
    } else {
      // Iterate backwards
      for (let i = size - 1; i >= 0; i--) {
        this.set(toIdx + i, this.get(fromIdx + i));
      }
    }
  }

  //return the value stored at certain memory address 
  //ptr: points to a specific memory slot 
  get(ptr) {
    return this.memory[ptr];
  }

  //set the values stored at a certain memory address
  //ex: if we want 'Apple' in slot 0 then we'd set it in address 0? 
  set(ptr, value) {
    this.memory[ptr] = value;
  }
}

module.exports = Memory;