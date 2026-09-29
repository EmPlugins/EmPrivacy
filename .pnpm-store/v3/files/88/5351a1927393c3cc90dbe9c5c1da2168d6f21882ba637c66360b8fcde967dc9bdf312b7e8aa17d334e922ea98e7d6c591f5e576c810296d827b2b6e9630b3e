/**
 * a least recently used (LRU) cache with fixed capacity evicts the least recently used items when capacity is
 * exceeded
 */
declare class LRUCache<K, V> {
    #private;
    /**
     * creates a new LRU cache with the specified capacity
     *
     * @param size the maximum number of items the cache can hold
     */
    constructor(size: number);
    /** maximum capacity of the cache */
    get size(): number;
    /**
     * gets a value without affecting its position in the cache
     *
     * @param key the key to look up
     * @returns the value associated with the key, or undefined if not found
     */
    peek(key: K): V | undefined;
    /**
     * gets a value and marks it as most recently used
     *
     * @param key the key to look up
     * @returns the value associated with the key, or undefined if not found
     */
    get(key: K): V | undefined;
    /**
     * stores a value for the given key, marking it as most recently used evicts the least recently used item if
     * the cache is at capacity
     *
     * @param key the key to store
     * @param value the value to associate with the key
     */
    put(key: K, value: V): void;
    /**
     * removes a key from the cache
     *
     * @param key the key to remove
     * @returns true if the key was found and removed, false otherwise
     */
    delete(key: K): boolean;
    /** removes all items from the cache */
    clear(): void;
    /**
     * checks if a key exists in the cache
     *
     * @param key the key to check
     * @returns true if the key exists, false otherwise
     */
    has(key: K): boolean;
    /**
     * iterates over the keys in LRU order (most to least recently used)
     *
     * @returns iterator of keys
     */
    keys(): IterableIterator<K>;
    /**
     * iterates over the values in LRU order (most to least recently used)
     *
     * @returns iterator of values
     */
    values(): IterableIterator<V>;
    /**
     * iterates over the key-value pairs in LRU order (most to least recently used)
     *
     * @returns iterator of [key, value] tuples
     */
    entries(): IterableIterator<[K, V]>;
}
export default LRUCache;
