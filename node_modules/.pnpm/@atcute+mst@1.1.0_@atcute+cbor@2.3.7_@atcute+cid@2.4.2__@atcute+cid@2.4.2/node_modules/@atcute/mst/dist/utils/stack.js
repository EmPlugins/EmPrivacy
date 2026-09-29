/** a stack data structure (lifo) */
class Stack {
    #head;
    #tail;
    #size = 0;
    /** size of the stack */
    get size() {
        return this.#size;
    }
    /** clear the stack */
    clear() {
        this.#head = undefined;
        this.#tail = undefined;
        this.#size = 0;
    }
    /**
     * adds a value to the top of the stack
     *
     * @param value value to add
     * @returns the stack instance
     */
    push(value) {
        const node = { value, next: this.#head };
        if (this.#head === undefined) {
            this.#tail = node;
        }
        this.#head = node;
        this.#size++;
        return this;
    }
    /**
     * removes the top value from the stack
     *
     * @returns last added value, or undefined if empty
     */
    pop() {
        const head = this.#head;
        if (head === undefined) {
            return;
        }
        this.#head = head.next;
        this.#size--;
        if (this.#head === undefined) {
            this.#tail = undefined;
        }
        return head.value;
    }
    /**
     * get the top value without removing from stack
     *
     * @returns last added value, or undefined if empty
     */
    peek() {
        return this.#head?.value;
    }
    /**
     * get the bottom value without removing from stack
     *
     * @returns first added value, or undefined if empty
     */
    peekBottom() {
        return this.#tail?.value;
    }
    /** returns an iterator that drains all the values from stack */
    drain() {
        // oxlint-disable-next-line no-this-alias
        const self = this;
        return {
            next() {
                const head = self.#head;
                if (head === undefined) {
                    return { done: true, value: undefined };
                }
                self.#head = head.next;
                self.#size--;
                if (self.#head === undefined) {
                    self.#tail = undefined;
                }
                return { done: false, value: head.value };
            },
            [Symbol.iterator]() {
                return this;
            },
        };
    }
    /** iterates over the stack without draining */
    [Symbol.iterator]() {
        let current = this.#head;
        return {
            next() {
                if (current === undefined) {
                    return { done: true, value: undefined };
                }
                const value = current.value;
                current = current.next;
                return { done: false, value: value };
            },
        };
    }
}
export default Stack;
