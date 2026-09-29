import type { CarEntry } from '@atcute/car';
import { type Bytes } from '@atcute/cbor';
import { type CidLink } from '@atcute/cid';
export declare class RepoEntry {
    /** the collection this record belongs to */
    readonly collection: string;
    /** record key */
    readonly rkey: string;
    /** CID of this record */
    readonly cid: CidLink;
    /** the associated CarEntry for this record */
    readonly carEntry: CarEntry;
    /** raw contents of this record */
    get bytes(): Uint8Array;
    /** decoded contents of this record */
    get record(): unknown;
}
/** commit object */
export interface Commit {
    version: 3;
    did: string;
    data: CidLink;
    rev: string;
    sig: Bytes;
    /** backwards compatibility with v2, history bookkeeping is not required */
    prev: CidLink | null;
}
/**
 * checks if value is a valid commit object
 *
 * @param value value to check
 * @returns true if the value is a valid commit object, false otherwise
 */
export declare const isCommit: (value: unknown) => value is Commit;
