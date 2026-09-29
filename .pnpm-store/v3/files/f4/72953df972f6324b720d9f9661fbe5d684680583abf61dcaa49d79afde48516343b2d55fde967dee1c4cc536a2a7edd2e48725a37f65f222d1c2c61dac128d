import { MSTNode } from './node.ts';
import type { BlockStore } from './stores.ts';
import LRUCache from './utils/lru.ts';
/** manages caching and storage of MST nodes with LRU eviction */
export declare class NodeStore {
    /** underlying block store for persistent storage */
    store: BlockStore;
    /** LRU cache for recently accessed nodes */
    cache: LRUCache<string | null, MSTNode>;
    constructor(store: BlockStore);
    /**
     * retrieves an MST node by its CID, using cache when available
     *
     * @param cid the CID of the node to retrieve, or null for empty node
     * @returns the MST node
     * @throws {MissingBlockError} if the node cannot be found in the store
     * @throws {BlockMismatchError} if the stored bytes do not hash to `cid`
     */
    get(cid: string | null): Promise<MSTNode>;
    /**
     * stores an MST node in both the cache and the underlying block store
     *
     * @param node the node to store
     * @returns the same node that was passed in
     */
    put(node: MSTNode): Promise<MSTNode>;
}
