

//Initializing & pushing 
class Array {
    //Array starts with length & pointer of 0 blocks of memory 
    constructor() {
        this.length = 0; 
        this.ptr = memory.allocate(this.length)
    }

    push(value) {
        //resize the array so there's space for the new item 
        this._resize(this.length + 1);
        memory.set(this.ptr + this.length, value);
        this.length++; 
    }

    _resize(size) {
        const oldPtr = this.ptr; 
        this.ptr = memory.allocate(size)
        if (this.ptr === null) {
            throw new Error('Out of memory')
        }
        memory.copy(this.ptr, oldPtr, this.length);
        memory.free(oldPtr);
    }
}

Array.SIZE_RATIO = 3; 