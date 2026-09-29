/** thrown when an MST key is invalid or malformed */
export declare class InvalidMstKeyError extends Error {
    key: string;
    constructor(key: string);
}
/** thrown when a referenced block cannot be found in the store */
export declare class MissingBlockError extends Error {
    cid: string;
    def?: string;
    constructor(cid: string, def?: string);
}
/** thrown when a block's bytes do not hash to the CID it was fetched under */
export declare class BlockMismatchError extends Error {
    cid: string;
    actual: string;
    constructor(cid: string, actual: string);
}
