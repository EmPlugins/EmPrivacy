import type { PublicKey } from '@atcute/crypto';
import type { AtprotoDid } from '@atcute/lexicons/syntax';
export interface VerifiedRecord {
    /** CID of the record */
    cid: string;
    /** decoded record data */
    record: unknown;
}
export interface VerifyRecordOptions {
    did?: AtprotoDid;
    collection: string;
    rkey: string;
    publicKey?: PublicKey;
    carBytes: Uint8Array;
}
/**
 * verifies that a record is committed at `collection/rkey` in a repository CAR, and returns it.
 *
 * the CAR may be a full repository export or a compact inclusion proof (as returned by
 * `com.atproto.sync.getRecord`). authenticity rests on three things: every block read is checked against its
 * CID, the commit is signed (when a public key is given), and the walk descends only by CIDs reachable from
 * the signed commit. it does not validate the overall tree shape (depth layering, sibling ordering) — that is
 * a separate, whole-repo concern and is not required to prove a single record's inclusion.
 *
 * @param options.did expected repository DID; rejected if the commit's DID differs
 * @param options.collection collection of the target record
 * @param options.rkey record key of the target record
 * @param options.publicKey signing key to verify the commit signature against; skipped if omitted
 * @param options.carBytes the CAR archive bytes
 * @returns the target record's CID and decoded data
 * @throws if the CAR is malformed, a block does not match its CID, the DID or signature is invalid, or the
 *   record cannot be found
 */
export declare const verifyRecord: ({ did, collection, rkey, publicKey, carBytes, }: VerifyRecordOptions) => Promise<VerifiedRecord>;
