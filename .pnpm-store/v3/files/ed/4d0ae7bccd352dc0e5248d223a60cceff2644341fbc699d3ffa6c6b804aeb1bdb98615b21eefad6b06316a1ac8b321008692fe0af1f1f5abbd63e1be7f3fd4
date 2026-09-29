/** CID version, always `1` for CIDv1 */
export declare const CID_VERSION = 1;
/** multicodec for SHA-256 hash */
export declare const HASH_SHA256 = 18;
/** multicodec for raw binary data */
export declare const CODEC_RAW = 85;
/** multicodec for DAG-CBOR encoded data */
export declare const CODEC_DCBOR = 113;
/**
 * represents a Content Identifier (CID), in particular, a limited subset of CIDv1 as described by DASL
 * specifications. https://dasl.ing/cid.html
 */
export interface Cid {
    /** CID version, this is always `1` for CIDv1 */
    readonly version: number;
    /** Multicodec type for the data, can be `0x55` for raw data or `0x71` for DAG-CBOR */
    readonly codec: number;
    /** Digest contents */
    readonly digest: {
        /** Multicodec type for the digest, this is always `0x12` for SHA-256 */
        readonly codec: number;
        /** Raw hash bytes */
        readonly contents: Uint8Array;
    };
    /** Raw CID bytes */
    readonly bytes: Uint8Array;
}
/**
 * creates a CID from a pre-computed SHA-256 digest
 *
 * @param codec multicodec type for the data
 * @param digest raw SHA-256 hash bytes (must be 32 bytes)
 * @returns CID object
 */
export declare const fromDigest: (codec: 85 | 113, digest: Uint8Array) => Cid;
/**
 * creates a CID by hashing the provided data with SHA-256
 *
 * @param codec multicodec type for the data
 * @param data raw data to hash
 * @returns CID object
 */
export declare const create: (codec: 85 | 113, data: Uint8Array) => Promise<Cid>;
/**
 * decodes a CID from bytes, returning the CID and any remaining bytes
 *
 * @param bytes raw CID bytes
 * @returns tuple of decoded CID and remainder bytes
 * @throws {RangeError} if the bytes are too short or contain invalid values
 */
export declare const decodeFirst: (bytes: Uint8Array) => [decoded: Cid, remainder: Uint8Array];
/**
 * decodes a CID from bytes, expecting no remainder
 *
 * @param bytes raw CID bytes
 * @returns decoded CID
 * @throws {RangeError} if the bytes are invalid or contain extra data
 */
export declare const decode: (bytes: Uint8Array) => Cid;
/**
 * parses a CID from a multibase base32 string
 *
 * @param input base32-encoded CID string (with 'b' prefix)
 * @returns decoded CID
 * @throws {SyntaxError} if the string is not a valid multibase base32 string
 * @throws {RangeError} if the string length is invalid
 */
export declare const fromString: (input: string) => Cid;
/**
 * encodes a CID to a multibase base32 string
 *
 * @param cid CID to encode
 * @returns base32-encoded string with 'b' prefix
 */
export declare const toString: (cid: Cid) => string;
/**
 * parses a CID from binary format (with 0x00 prefix)
 *
 * @param input binary CID bytes with 0x00 prefix
 * @returns decoded CID
 * @throws {RangeError} if the byte length is invalid
 * @throws {SyntaxError} if the prefix byte is not 0x00
 */
export declare const fromBinary: (input: Uint8Array) => Cid;
/**
 * encodes a CID to binary format (with 0x00 prefix)
 *
 * @param cid CID to encode
 * @returns binary CID bytes with 0x00 prefix
 */
export declare const toBinary: (cid: Cid) => Uint8Array;
/**
 * checks if two CIDs are equal
 *
 * @param a first CID
 * @param b second CID
 * @returns true if the CIDs have identical bytes
 */
export declare const equals: (a: Cid, b: Cid) => boolean;
