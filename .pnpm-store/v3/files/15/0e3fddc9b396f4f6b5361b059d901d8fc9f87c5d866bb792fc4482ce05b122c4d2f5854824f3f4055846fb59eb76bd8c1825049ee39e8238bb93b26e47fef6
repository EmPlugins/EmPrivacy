/** a stack data structure (lifo) */
declare class Stack<T> implements Iterable<T> {
    #private;
    /** size of the stack */
    get size(): number;
    /** clear the stack */
    clear(): void;
    /**
     * adds a value to the top of the stack
     *
     * @param value value to add
     * @returns the stack instance
     */
    push(value: T): this;
    /**
     * removes the top value from the stack
     *
     * @returns last added value, or undefined if empty
     */
    pop(): T | undefined;
    /**
     * get the top value without removing from stack
     *
     * @returns last added value, or undefined if empty
     */
    peek(): T | undefined;
    /**
     * get the bottom value without removing from stack
     *
     * @returns first added value, or undefined if empty
     */
    peekBottom(): T | undefined;
    /** returns an iterator that drains all the values from stack */
    drain(): IterableIterator<T, undefined, undefined>;
    /** iterates over the stack without draining */
    [Symbol.iterator](): Iterator<T, undefined, undefined>;
}
export default Stack;
