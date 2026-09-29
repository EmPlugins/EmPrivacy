import type { CidLink } from '@atcute/cid';
/**
 * represents a node in a Merkle Search Tree (MST) stores sorted keys, their associated values (CIDs), and
 * subtree pointers
 */
export declare class MSTNode {
    /** sorted array of keys stored in this node */
    readonly keys: readonly string[];
    /** array of value CIDs corresponding to each key */
    readonly values: readonly CidLink[];
    /** array of subtree CIDs (length is keys.length + 1) */
    readonly subtrees: readonly (CidLink | null)[];
    protected constructor(keys: readonly string[], values: readonly CidLink[], subtrees: readonly (CidLink | null)[]);
    /**
     * creates a new MST node with validation
     *
     * @param keys sorted array of keys
     * @param values array of value CIDs corresponding to keys
     * @param subtrees array of subtree CIDs (length must be keys.length + 1)
     * @returns a new validated MST node
     * @throws {TypeError} if node structure is invalid or keys have inconsistent heights
     */
    static create(keys: readonly string[], values: readonly CidLink[], subtrees: readonly (CidLink | null)[]): Promise<MSTNode>;
    /**
     * creates an empty MST node
     *
     * @returns a new empty node
     */
    static empty(): MSTNode;
    /**
     * deserializes an MST node from CBOR-encoded bytes
     *
     * @param bytes the CBOR-encoded node data
     * @returns the deserialized MST node
     * @throws {TypeError} if the bytes don't represent a valid MST node
     */
    static deserialize(bytes: Uint8Array): Promise<MSTNode>;
    /**
     * serializes the node to CBOR-encoded bytes with prefix compression
     *
     * @returns the CBOR-encoded node data
     */
    serialize(): Promise<Uint8Array<ArrayBuffer>>;
    /** whether the node is empty (no keys or values) */
    get isEmpty(): boolean;
    /**
     * computes the CID for this node
     *
     * @returns the CID link for this node
     */
    cid(): Promise<CidLink>;
    /**
     * computes the height of this node in the MST
     *
     * @returns the height, or null if indeterminate (empty intermediate node)
     */
    height(): Promise<number | null>;
    /**
     * gets the node height, throwing if indeterminate
     *
     * @returns the height
     * @throws {Error} if height cannot be determined
     */
    requireHeight(): Promise<number>;
    /**
     * finds the index of the first key >= the given key
     *
     * @param key the key to search for
     * @returns the index of the lower bound
     */
    lowerBound(key: string): number;
}
/**
 * computes the MST height for a given key by counting leading zeros in its hash
 *
 * @param key the key to compute height for
 * @returns the height (number of leading zero bits in 2-bit chunks)
 */
export declare const getKeyHeight: (key: string) => Promise<number>;
