import type { CidLink } from '@atcute/cid';
import type { NodeStore } from './node-store.ts';
/** type of change to a record */
export declare const DeltaType: {
    readonly CREATED: 1;
    readonly UPDATED: 2;
    readonly DELETED: 3;
};
export type DeltaType = (typeof DeltaType)[keyof typeof DeltaType];
/** Represents a change to a single record */
export interface RecordDelta {
    /** type of change */
    deltaType: DeltaType;
    /** record path (collection/rkey) */
    path: string;
    /** CID before the change (null for creates) */
    priorValue: CidLink | null;
    /** CID after the change (null for deletes) */
    laterValue: CidLink | null;
}
/**
 * Given two sets of MST nodes, returns an iterator of record-level changes
 *
 * @param ns the node store
 * @param created set of node CIDs that were created
 * @param deleted set of node CIDs that were deleted
 * @yields record deltas describing the changes
 */
export declare function recordDiff(ns: NodeStore, created: Set<string>, deleted: Set<string>): AsyncGenerator<RecordDelta>;
/**
 * Slow but obvious MST diff implementation for testing Enumerates all nodes in both trees and compares them
 *
 * @param ns the node store
 * @param rootA CID of first MST root
 * @param rootB CID of second MST root
 * @returns tuple of [created nodes, deleted nodes]
 */
export declare const verySlowMstDiff: (ns: NodeStore, rootA: string, rootB: string) => Promise<[Set<string>, Set<string>]>;
/**
 * Efficiently computes the difference between two MSTs
 *
 * @param ns the node store
 * @param rootA CID of first MST root
 * @param rootB CID of second MST root
 * @returns tuple of [created nodes, deleted nodes]
 */
export declare const mstDiff: (ns: NodeStore, rootA: string, rootB: string) => Promise<[Set<string>, Set<string>]>;
