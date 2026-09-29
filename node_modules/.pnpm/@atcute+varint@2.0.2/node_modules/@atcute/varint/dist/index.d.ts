export interface DecodeResult {
    /** decoded number */
    value: number;
    /** position immediately after the varint */
    nextOffset: number;
}
/**
 * encodes a varint
 *
 * @param num Number to encode
 * @param buf Buffer to write on
 * @param offset Starting position on the buffer
 * @returns The amount of bytes written
 */
export declare const encode: (num: number, buf: Uint8Array, offset?: number) => number;
/**
 * decodes a varint and returns the value with the next byte offset
 *
 * @param buf buffer to read from
 * @param offset starting position on the buffer
 * @param length maximum bytes to consume from offset
 * @returns decoded value and the next offset
 */
export declare const decode: (buf: Uint8Array, offset?: number, length?: number) => DecodeResult;
/**
 * Returns encoding length
 *
 * @param num The number to encode
 * @returns Amount of bytes needed for encoding
 */
export declare const encodingLength: (num: number) => number;
