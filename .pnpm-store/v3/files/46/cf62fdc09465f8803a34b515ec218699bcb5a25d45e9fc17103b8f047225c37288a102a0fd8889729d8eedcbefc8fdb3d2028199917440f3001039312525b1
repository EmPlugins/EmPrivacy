import type { CidLink } from '@atcute/cid';
import { type NodeStore } from './node-store.ts';
/**
 * NodeWrangler is where core MST transformation ops are implemented, backed by a NodeStore
 *
 * the external APIs take a CID (the MST root) and return a CID (the new root), while storing any newly
 * created nodes in the NodeStore.
 *
 * neither method should ever fail - deleting a node that doesn't exist is a noop, and adding the same node
 * twice with the same value is also a nop. callers can detect these cases by seeing if the initial and final
 * CIDs changed.
 */
export declare class NodeWrangler {
    /** underlying node store */
    ns: NodeStore;
    constructor(ns: NodeStore);
    /**
     * inserts or updates a record in the MST
     *
     * @param rootCid CID of the root node (or null for empty tree)
     * @param key the key to insert/update
     * @param val the value CID to associate with the key
     * @returns the new root CID
     */
    putRecord(rootCid: string | null, key: string, val: CidLink): Promise<string>;
    /**
     * deletes a record from the MST
     *
     * @param rootCid CID of the root node (or null for empty tree)
     * @param key the key to delete
     * @returns the new root CID
     */
    deleteRecord(rootCid: string | null, key: string): Promise<string>;
    /**
     * inserts a key-value pair into the current node
     *
     * @param node the node to insert into
     * @param key the key to insert
     * @param val the value to insert
     * @returns the updated node
     */
    private _putHere;
    /**
     * recursively inserts a key-value pair, growing the tree if necessary
     *
     * @param node the current node
     * @param key the key to insert
     * @param val the value to insert
     * @param keyHeight the height of the key (based on hash)
     * @param treeHeight the current tree height
     * @returns the updated node
     */
    private _putRecursive;
    /**
     * splits a subtree around a key, producing left and right subtrees
     *
     * @param nodeCid the CID of the subtree to split (or null)
     * @param key the key to split around
     * @returns tuple of [left subtree CID, right subtree CID]
     */
    private _splitOnKey;
    /**
     * strips empty nodes from the top of the tree
     *
     * @param nodeCid the CID of the node to check
     * @returns the CID after removing empty top nodes
     */
    private _squashTop;
    /**
     * recursively deletes a key from the tree
     *
     * @param node the current node
     * @param key the key to delete
     * @param keyHeight the height of the key
     * @param treeHeight the current tree height
     * @returns the CID of the updated node, or null if it becomes empty
     */
    private _deleteRecursive;
    /**
     * merges two adjacent subtrees
     *
     * @param leftCid CID of the left subtree (or null)
     * @param rightCid CID of the right subtree (or null)
     * @returns the CID of the merged subtree (or null if both are null)
     */
    private _merge;
}
