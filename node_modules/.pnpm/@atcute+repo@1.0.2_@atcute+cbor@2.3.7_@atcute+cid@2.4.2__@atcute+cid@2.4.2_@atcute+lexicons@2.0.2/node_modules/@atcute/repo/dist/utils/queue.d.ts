/** a queue data structure (fifo) */
declare class Queue<T> implements Iterable<T> {
    #private;
    /** size of the queue */
    get size(): number;
    /** clear the queue */
    clear(): void;
    /**
     * adds a value to the end of the queue
     *
     * @param value value to add
     * @returns the queue instance
     */
    enqueue(value: T): this;
    /**
     * adds a value to the front of the queue
     *
     * @param value value to add
     * @returns the queue instance
     */
    enqueueFront(value: T): this;
    /**
     * removes the first value from the queue
     *
     * @returns first queued value, or undefined if empty
     */
    dequeue(): T | undefined;
    /**
     * get the first value without removing from queue
     *
     * @returns first queued value, or undefined if empty
     */
    peek(): T | undefined;
    /** returns an iterator that drains all values from the queue */
    drain(): IterableIterator<T, undefined, undefined>;
    /** iterates over the queue without draining */
    [Symbol.iterator](): Iterator<T, undefined, undefined>;
}
export default Queue;
