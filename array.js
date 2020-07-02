const memory = require('./memory');

//building our array 
class Array {
    constructor() {
        //we start with pretty much nothing 
        this.length = 0; 
        this.ptr = memory.allocate(this.length);
    }

    //to push an element to end of an array 
    // we need to increase the amount of memory slots to invent space for new item
    //then we need to set that value of the memory slot(s) to contain the new value 
    /*Big O: 
    1. push method resizes the array 
    2. it then increases the length & sets a memory address (both O(1) operations) === push is O(n)
    3. how to make it better
        - rather than resizing => everytime you push some data - you could allocate more space than needed
        - that way you need to resize far less often:
        push(value) {
            if(this.length >= this._capacity) {
                this._resize((this.length + 1) * Array.SIZE_RATIO);
            }
            memory.set(this.ptr + this.length, value);
            this.length++
        }
        - now you length & capacity => how many items you can hold w.o needing to resize 
        - if the length is > than the capacity => you'd resize according to SIZE_RATIO
        - i.e each time you go over capacity => you triple size of memory allocated 
        - Big O best case: O(1) => you won't need to resize
        - Big O worst case: O(n) => you'd still need to resize so it remains O(n)
        - the tradeoff: 
        1. you're wasting some memory when the capacity is greater than the length 
        2. isn't really a big deal = pushing to array is incredibly common & worthwhile optimization to give O(1) performance
     */
    push(value) {
        this._resize(this.length + 1);
        //we're making sure that ptr & length are no longer 0 but are set 1 === value 
        //we're making sure that we set the value as well 
        memory.set(this.ptr + this.length, value);
        //to get the address of the nth item === add n to the memory adress of the start of the data
        this.length++
    }

    //its unlikely that you'd be able to ask for extra slots directly at the end of currently allocated space
    /*so you have to:
    1. allocate a new larger chunk of memory 
    2. copy any existing values from the old chunk to the new chunk
    3. free the old chunk 
    */
   /*Big O: 
   1. you have to copy each item of data (oldPtr) to a new box each time you resize the
   2. so n copies: your resize operation has worst, best & average case of linear (O(n))
    */
   _resize(size) {
       const oldPtr = this.ptr; 
       this.ptr = memory.allocate(size);
       if (this.ptr === null) {
           throw new Error('Out of memory')
       }
       memory.copy(this.ptr, oldPtr, this.length);
       memory.free(oldPtr)
   }

   //retrieving is straightforwards 
   //just like pushing you'd find the correct memory address by simpling adding the index to the start position
   /*Big O: 
   1. Both operations are O(1)
   2. retrieving values from any point in an array also has best, worst & average performance of O(1)
    */
   get(index) {
       if (index < 0 || index >= this.length) {
           throw new Error('Index error')
       }
       //adds an index offset 
       // gets the value stored at a memory addres
       return memory.get(this.ptr +  index);
   }

   //popping a value from the end of an array 
   //rather than resize the array => you'd just leave extra space which will be filed at the next push 
   //Big O: we're just removing something but still leaving the space empty rather than deleting it === O(1)
   pop() {
       if (this.length === 0) {
           throw new Error('Index error')
       }
       const value = memory.get(this.ptr + this.length - 1);
       this.length--; 
       return value; 
   }

   //inserting a value 
   //if we want to insert a value at any point (not just middle) 
   //we'd shift all of the values after the new value back 1 position
   //then put the new value in its correct place 
   /*Big O:
   1. Best case: you're inserting the value at the back of the array (same as pushing) === O(1)
   2. Worst case: inserting the value at the start of the array === O(n)
    - this requires every value to be shifted 1 memory address later
   3. Average case: inserting a value into the middle of array
    - you'd need to shift half of the values along === n/2
    - Answer: O(n) => you ignore the constant factor 1/2
   */
   insert(index, value) {
       if (index < 0 || index >= this.length) {
           throw new Error('Index error')
       } 
       if (this.length >= this._capacity) {
           this._resize((this.length + 1) * Array.SIZE_RATIO);
       }
       memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
       memory.set(this.ptr + index, value);
       this.length++
   }

   //removing value = similar to inserting values 
   //difference: you're copying the values backwards to fill space where you removed the value
   //rather than forwards to make space for a new value 
   /*Big O:
   1. Best case: O(1) === same as popping
   2. Average & Worst case: O(n)
   
   */

}


export default Array; 