/** thrown when an MST key is invalid or malformed */
export class InvalidMstKeyError extends Error {
    key;
    constructor(key) {
        super(`invalid mst key; key=${key}`);
        this.key = key;
    }
}
/** thrown when a referenced block cannot be found in the store */
export class MissingBlockError extends Error {
    cid;
    def;
    constructor(cid, def) {
        super(`missing block in store; cid=${cid}` + (def ? `; type=${def}` : ``));
        this.cid = cid;
        this.def = def;
    }
}
/** thrown when a block's bytes do not hash to the CID it was fetched under */
export class BlockMismatchError extends Error {
    cid;
    actual;
    constructor(cid, actual) {
        super(`block does not match its cid; expected=${cid}; actual=${actual}`);
        this.cid = cid;
        this.actual = actual;
    }
}
