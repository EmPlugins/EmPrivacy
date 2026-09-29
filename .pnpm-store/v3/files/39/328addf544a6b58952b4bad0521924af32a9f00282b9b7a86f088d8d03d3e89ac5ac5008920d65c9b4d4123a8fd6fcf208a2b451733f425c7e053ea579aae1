import type { CidLink } from '@atcute/cid';
import type { NodeStore } from './node-store.ts';
/** Error thrown when validating a proof fails */
export declare class InvalidProofError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
/** Error thrown when constructing a proof fails */
export declare class ProofError extends Error {
    constructor(message: string);
}
/**
 * Finds a record path and builds a proof (works for both inclusion and exclusion proofs)
 *
 * @param ns the node store
 * @param rootCid the MST root CID
 * @param rpath the record path to find
 * @returns tuple of [value CID or null, set of proof node CIDs]
 */
export declare const findRpathAndBuildProof: (ns: NodeStore, rootCid: string, rpath: string) => Promise<[CidLink | null, Set<string>]>;
/**
 * Builds an exclusion proof for a record that should not exist
 *
 * @param ns the node store
 * @param rootCid the MST root CID
 * @param rpath the record path
 * @returns set of MST node CIDs needed for the exclusion proof
 * @throws {ProofError} if the record exists
 */
export declare const buildExclusionProof: (ns: NodeStore, rootCid: string, rpath: string) => Promise<Set<string>>;
/**
 * Builds an inclusion proof for a record that should exist
 *
 * @param ns the node store
 * @param rootCid the MST root CID
 * @param rpath the record path
 * @returns set of MST node CIDs needed for the inclusion proof
 * @throws {ProofError} if the record doesn't exist
 */
export declare const buildInclusionProof: (ns: NodeStore, rootCid: string, rpath: string) => Promise<Set<string>>;
/**
 * verifies that a record path exists in the MST
 *
 * checks node CIDs, but not record contents or root authenticity. the store may contain extra blocks.
 *
 * @param ns the node store
 * @param rootCid the MST root CID
 * @param rpath the record path
 * @throws {InvalidProofError} if the proof is invalid or the record doesn't exist
 */
export declare const verifyInclusion: (ns: NodeStore, rootCid: string, rpath: string) => Promise<void>;
/**
 * verifies that a record path does not exist in the MST
 *
 * checks node CIDs, but not root authenticity. the store may contain extra blocks.
 *
 * @param ns the node store
 * @param rootCid the MST root CID
 * @param rpath the record path
 * @throws {InvalidProofError} if the proof is invalid or the record exists
 */
export declare const verifyExclusion: (ns: NodeStore, rootCid: string, rpath: string) => Promise<void>;
