import type { BlockMap } from '../blockmap.ts';
type BlockEntry = [cid: string, bytes: Uint8Array<ArrayBuffer>];
/**
 * encodes data as CBOR, computes its CID, and adds it to the map
 *
 * @param map the block map to add to
 * @param data the data to encode and add
 */
export declare const add: (map: BlockMap, data: unknown) => Promise<void>;
/**
 * copies multiple blocks from an iterable into the map
 *
 * @param map the block map to add to
 * @param entries the block entries to add
 */
export declare const setMany: (map: BlockMap, entries: Iterable<Readonly<BlockEntry>>) => void;
/**
 * removes multiple blocks from the map by their CIDs
 *
 * @param map the block map to remove from
 * @param cids the CID strings to remove
 */
export declare const deleteMany: (map: BlockMap, cids: Iterable<string>) => void;
export {};
