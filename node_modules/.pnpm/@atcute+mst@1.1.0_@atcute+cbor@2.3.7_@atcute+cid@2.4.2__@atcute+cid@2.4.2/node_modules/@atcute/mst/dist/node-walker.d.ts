import type { CidLink } from '@atcute/cid';
import { type NodeStore } from './node-store.ts';
import { type MSTNode } from './node.ts';
import Stack from './utils/stack.ts';
/**
 * represents a single frame in the NodeWalker traversal stack tracks position within a node and the current
 * search boundaries
 */
export interface StackFrame {
    /** current MST node */
    node: MSTNode;
    /** left boundary path for this frame */
    lpath: string;
    /** right boundary path for this frame */
    rpath: string;
    /** current cursor index within the node */
    idx: number;
}
/**
 * provides a cursor-based interface for traversing MST nodes supports tree diffing and various MST query
 * operations
 *
 * a NodeWalker starts at the root of a tree and can walk along or recurse down into subtrees
 *
 * walking "off the end" of a subtree brings you back up to its next non-empty parent
 *
 * recall MSTNode layout:
 *
 *     keys: lpath(0, 1, 2, 3)(rpath);
 *     vals: (0, 1, 2, 3);
 *     subtrees: (0, 1, 2, 3, 4);
 */
export declare class NodeWalker {
    static readonly PATH_MIN = "";
    static readonly PATH_MAX = "\u00FF";
    /** node store for fetching nodes */
    readonly store: NodeStore;
    /** stack of frames representing the traversal path */
    readonly stack: Stack<StackFrame>;
    /** height of the root node */
    readonly rootHeight: number;
    /** whether to skip height validation (for trusted trees) */
    readonly trusted: boolean;
    private constructor();
    /**
     * create a new NodeWalker
     *
     * @param store NodeStore to fetch nodes from
     * @param rootCid CID of the root node to start walking from
     * @param lpath left boundary path (defaults to minimum)
     * @param rpath right boundary path (defaults to maximum)
     * @param trusted skip height validation checks if true (faster but unsafe for untrusted trees)
     * @param rootHeight pre-computed root height (optional optimization)
     * @returns a new NodeWalker instance
     */
    static create(store: NodeStore, rootCid: string | null, lpath?: string, rpath?: string, trusted?: boolean, rootHeight?: number): Promise<NodeWalker>;
    /**
     * create a new walker rooted at the current position's subtree. treats the subtree as an independent tree
     * for traversal.
     *
     * @returns a new NodeWalker instance for the subtree
     */
    createSubtreeWalker(): Promise<NodeWalker>;
    /** current stack frame */
    get frame(): StackFrame;
    /** current height in the tree (decreases as you descend) */
    get height(): number;
    /** key/path to the left of current cursor position */
    get lpath(): string;
    /** value (CID) to the left of current cursor position */
    get lval(): CidLink | null;
    /** subtree CID at current cursor position (null if no subtree) */
    get subtree(): CidLink | null;
    /** key/path to the right of current cursor position */
    get rpath(): string;
    /** value (CID) to the right of current cursor position */
    get rval(): CidLink | null;
    /** whether the walker has reached the end of the tree */
    get done(): boolean;
    /** whether the cursor can move right in current node */
    get canGoRight(): boolean;
    /**
     * move cursor right, or up if at end of current node. automatically recurses up through empty
     * intermediates.
     *
     * @throws if attempting to navigate beyond root (check done first)
     */
    rightOrUp(): void;
    /**
     * move cursor right within current node.
     *
     * @throws if already at rightmost position (check canGoRight first)
     */
    right(): void;
    /**
     * descend into the subtree at current cursor position.
     *
     * @throws if no subtree exists at current position
     */
    down(): Promise<void>;
    /**
     * advance to and return the next key-value pair in the tree. descends into all subtrees automatically.
     *
     * @returns Tuple of [key, value CID]
     */
    nextEntry(): Promise<[string, CidLink]>;
    /**
     * iterate over all key-value pairs in the tree in sorted order.
     *
     * @yields Tuples of [key, value CID]
     */
    entries(): AsyncIterableIterator<[string, CidLink]>;
    /**
     * iterate over all MST nodes from current position to the end of tree.
     *
     * @yields MSTNode instances
     */
    nodes(): AsyncIterableIterator<MSTNode>;
    /**
     * iterate over CIDs of all MST nodes from current position to end of tree.
     *
     * @yields CID links to nodes
     */
    nodeCids(): AsyncIterableIterator<CidLink>;
    /**
     * iterate over key-value pairs within a specific key range.
     *
     * @param start start key (inclusive)
     * @param end end key
     * @param endInclusive whether end key is inclusive
     * @yields tuples of [key, value CID] within range
     */
    entriesInRange(start: string, end: string, endInclusive?: boolean): AsyncIterableIterator<[string, CidLink]>;
    /**
     * search for a specific key (rpath) in the tree.
     *
     * @param rpath key to search for
     * @returns value CID if found, null otherwise
     */
    findRpath(rpath: string): Promise<CidLink | null>;
}
