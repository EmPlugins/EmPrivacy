import {} from './blockmap.js';
import { deleteMany, setMany } from './utils/blockmap.js';
/** an in-memory read-only block store using a Map */
export class ReadonlyMemoryBlockStore {
    /** underlying map storing CID to block data */
    blocks = new Map();
    /**
     * creates a new read-only memory block store
     *
     * @param blocks optional initial blocks to populate the store with
     */
    constructor(blocks) {
        if (blocks !== undefined) {
            setMany(this.blocks, blocks);
        }
    }
    get(cid) {
        return Promise.resolve(this.blocks.get(cid) ?? null);
    }
    getMany(cids) {
        const found = new Map();
        const missing = [];
        for (const cid of cids) {
            const bytes = this.blocks.get(cid);
            if (bytes !== undefined) {
                found.set(cid, bytes);
            }
            else {
                missing.push(cid);
            }
        }
        return Promise.resolve({ found, missing });
    }
    has(cid) {
        return Promise.resolve(this.blocks.has(cid));
    }
}
/** an in-memory writable block store using a Map */
export class MemoryBlockStore extends ReadonlyMemoryBlockStore {
    put(cid, bytes) {
        this.blocks.set(cid, bytes);
        return Promise.resolve();
    }
    putMany(blocks) {
        setMany(this.blocks, blocks);
        return Promise.resolve();
    }
    delete(cid) {
        this.blocks.delete(cid);
        return Promise.resolve();
    }
    deleteMany(cids) {
        deleteMany(this.blocks, cids);
        return Promise.resolve();
    }
}
/**
 * a block store that overlays one store on top of another reads check upper first, then fall back to lower
 * all writes go to the upper store only
 */
export class OverlayBlockStore {
    /** writable upper layer store */
    upper;
    /** read-only lower layer store */
    lower;
    /**
     * creates a new overlay block store
     *
     * @param upper the writable upper layer store
     * @param lower the read-only lower layer store
     */
    constructor(upper, lower) {
        this.upper = upper;
        this.lower = lower;
    }
    async get(cid) {
        let bytes = await this.upper.get(cid);
        if (bytes === null) {
            bytes = await this.lower.get(cid);
        }
        return bytes;
    }
    async getMany(cids) {
        const upper = await this.upper.getMany(cids);
        const lower = await this.lower.getMany(upper.missing);
        const found = upper.found;
        const missing = lower.missing;
        setMany(found, lower.found);
        return { found, missing };
    }
    async has(cid) {
        let exists = await this.upper.has(cid);
        if (!exists) {
            exists = await this.lower.has(cid);
        }
        return exists;
    }
    async put(cid, bytes) {
        await this.upper.put(cid, bytes);
    }
    async putMany(blocks) {
        await this.upper.putMany(blocks);
    }
    async delete(cid) {
        await this.upper.delete(cid);
    }
    async deleteMany(cids) {
        return await this.upper.deleteMany(cids);
    }
}
/**
 * a read-only block store wrapper that tracks all get() accesses useful for collecting proof nodes during MST
 * operations
 */
export class LoggingBlockStore {
    /** block store being proxied */
    wrapped;
    /** set of CIDs that were accessed via get() or getMany() */
    accessed = new Set();
    /**
     * creates a new logging block store wrapper
     *
     * @param store the block store to wrap
     */
    constructor(store) {
        this.wrapped = store;
    }
    async get(cid) {
        this.accessed.add(cid);
        return this.wrapped.get(cid);
    }
    async getMany(cids) {
        const accessed = this.accessed;
        for (const cid of cids) {
            accessed.add(cid);
        }
        return this.wrapped.getMany(cids);
    }
    async has(cid) {
        // has() doesn't count as an access for proof purposes
        return this.wrapped.has(cid);
    }
}
