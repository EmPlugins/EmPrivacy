import * as CBOR from '@atcute/cbor';
import { isBytes } from '@atcute/cbor';
import { isCidLink } from '@atcute/cid';
export class RepoEntry {
    /** the collection this record belongs to */
    collection;
    /** record key */
    rkey;
    /** CID of this record */
    cid;
    /** the associated CarEntry for this record */
    carEntry;
    /** @internal */
    constructor(collection, rkey, cid, carEntry) {
        this.collection = collection;
        this.rkey = rkey;
        this.cid = cid;
        this.carEntry = carEntry;
    }
    /** raw contents of this record */
    get bytes() {
        return this.carEntry.bytes;
    }
    /** decoded contents of this record */
    get record() {
        return CBOR.decode(this.bytes);
    }
}
/**
 * checks if value is a valid commit object
 *
 * @param value value to check
 * @returns true if the value is a valid commit object, false otherwise
 */
export const isCommit = (value) => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const obj = value;
    return (obj.version === 3 &&
        typeof obj.did === 'string' &&
        isCidLink(obj.data) &&
        typeof obj.rev === 'string' &&
        (obj.prev === null || isCidLink(obj.prev)) &&
        isBytes(obj.sig));
};
