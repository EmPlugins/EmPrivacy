import { type BlockMap } from './blockmap.ts';
/**
 * a read-only interface for retrieving blocks by their CID
 *
 * returned buffers may be shared and retained. neither stores nor callers may mutate them.
 */
export interface ReadonlyBlockStore {
    /**
     * retrieves a single block by its CID
     *
     * @param cid the CID of the block to retrieve
     * @returns the block data, or null if not found
     */
    get(cid: string): Promise<Uint8Array<ArrayBuffer> | null>;
    /**
     * retrieves multiple blocks by their CIDs
     *
     * @param cids array of CIDs to retrieve
     * @returns object containing found blocks and missing CIDs
     */
    getMany(cids: string[]): Promise<{
        found: BlockMap;
        missing: string[];
    }>;
    /**
     * checks if a block exists in the store
     *
     * @param cid the CID to check
     * @returns true if the block exists, false otherwise
     */
    has(cid: string): Promise<boolean>;
}
/** a writable block store supporting both read and write operations */
export interface BlockStore extends ReadonlyBlockStore {
    /**
     * stores a single block
     *
     * @param cid the CID of the block
     * @param bytes the block data to store
     */
    put(cid: string, bytes: Uint8Array<ArrayBuffer>): Promise<void>;
    /**
     * stores multiple blocks at once
     *
     * @param blocks map of CIDs to block data
     */
    putMany(blocks: BlockMap): Promise<void>;
    /**
     * removes a single block from the store
     *
     * @param cid the CID of the block to remove
     */
    delete(cid: string): Promise<void>;
    /**
     * removes multiple blocks from the store
     *
     * @param cids array of CIDs to remove
     */
    deleteMany(cids: string[]): Promise<void>;
}
/** an in-memory read-only block store using a Map */
export declare class ReadonlyMemoryBlockStore implements ReadonlyBlockStore {
    /** underlying map storing CID to block data */
    blocks: BlockMap;
    /**
     * creates a new read-only memory block store
     *
     * @param blocks optional initial blocks to populate the store with
     */
    constructor(blocks?: BlockMap);
    get(cid: string): Promise<Uint8Array<ArrayBuffer> | null>;
    getMany(cids: string[]): Promise<{
        found: BlockMap;
        missing: string[];
    }>;
    has(cid: string): Promise<boolean>;
}
/** an in-memory writable block store using a Map */
export declare class MemoryBlockStore extends ReadonlyMemoryBlockStore implements BlockStore {
    put(cid: string, bytes: Uint8Array<ArrayBuffer>): Promise<void>;
    putMany(blocks: BlockMap): Promise<void>;
    delete(cid: string): Promise<void>;
    deleteMany(cids: string[]): Promise<void>;
}
/**
 * a block store that overlays one store on top of another reads check upper first, then fall back to lower
 * all writes go to the upper store only
 */
export declare class OverlayBlockStore implements BlockStore {
    /** writable upper layer store */
    upper: BlockStore;
    /** read-only lower layer store */
    lower: ReadonlyBlockStore;
    /**
     * creates a new overlay block store
     *
     * @param upper the writable upper layer store
     * @param lower the read-only lower layer store
     */
    constructor(upper: BlockStore, lower: ReadonlyBlockStore);
    get(cid: string): Promise<Uint8Array<ArrayBuffer> | null>;
    getMany(cids: string[]): Promise<{
        found: BlockMap;
        missing: string[];
    }>;
    has(cid: string): Promise<boolean>;
    put(cid: string, bytes: Uint8Array<ArrayBuffer>): Promise<void>;
    putMany(blocks: BlockMap): Promise<void>;
    delete(cid: string): Promise<void>;
    deleteMany(cids: string[]): Promise<void>;
}
/**
 * a read-only block store wrapper that tracks all get() accesses useful for collecting proof nodes during MST
 * operations
 */
export declare class LoggingBlockStore implements ReadonlyBlockStore {
    /** block store being proxied */
    readonly wrapped: ReadonlyBlockStore;
    /** set of CIDs that were accessed via get() or getMany() */
    readonly accessed: Set<string>;
    /**
     * creates a new logging block store wrapper
     *
     * @param store the block store to wrap
     */
    constructor(store: ReadonlyBlockStore);
    get(cid: string): Promise<Uint8Array<ArrayBuffer> | null>;
    getMany(cids: string[]): Promise<{
        found: BlockMap;
        missing: string[];
    }>;
    has(cid: string): Promise<boolean>;
}
