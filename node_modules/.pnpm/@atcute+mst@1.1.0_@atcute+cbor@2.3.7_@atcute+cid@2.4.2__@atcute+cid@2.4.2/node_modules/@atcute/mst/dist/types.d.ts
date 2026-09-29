import { type Bytes } from '@atcute/cbor';
import { type CidLink } from '@atcute/cid';
/** represents a single entry in an MST node */
export interface TreeEntry {
    /** count of bytes shared with previous TreeEntry in this Node (if any) */
    p: number;
    /** remainder of key for this TreeEntry, after "prefixlen" have been removed */
    k: Bytes;
    /**
     * link to a sub-tree Node at a lower level which has keys sorting after this TreeEntry's key (to the
     * "right"), but before the next TreeEntry's key in this Node (if any)
     */
    v: CidLink;
    /** next subtree (to the right of leaf) */
    t: CidLink | null;
}
/**
 * validates that an unknown value is a valid TreeEntry
 *
 * @param value the value to check
 * @returns true if value is a TreeEntry, false otherwise
 */
export declare const isTreeEntry: (value: unknown) => value is TreeEntry;
/** represents the serialized data structure of an MST node */
export interface NodeData {
    /** link to sub-tree Node on a lower level and with all keys sorting before keys at this node */
    l: CidLink | null;
    /** ordered list of TreeEntry objects */
    e: TreeEntry[];
}
/**
 * validates that an unknown value is valid NodeData
 *
 * @param value the value to check
 * @returns true if value is NodeData, false otherwise
 */
export declare const isNodeData: (value: unknown) => value is NodeData;
