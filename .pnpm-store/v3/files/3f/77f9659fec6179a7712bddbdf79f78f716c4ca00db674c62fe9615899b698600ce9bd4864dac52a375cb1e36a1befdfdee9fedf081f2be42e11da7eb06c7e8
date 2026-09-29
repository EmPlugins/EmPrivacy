import type { PrivateKey } from './types.ts';
export declare const isSignatureNormalized: (sig: Uint8Array, curveOrder: bigint) => boolean;
export declare const normalizeSignature: (sig: Uint8Array<ArrayBuffer>, curveOrder: bigint) => Uint8Array<ArrayBuffer>;
export declare const isCompressedPoint: (coords: Uint8Array) => boolean;
export declare const isUncompressedPoint: (coords: Uint8Array) => boolean;
export declare const compressPoint: (coords: Uint8Array) => Uint8Array<ArrayBuffer>;
export declare const deriveEcPublicKeyFromPrivateKey: (privateKey: CryptoKey, usages: KeyUsage[]) => Promise<CryptoKey>;
/**
 * Extracts the private scalar out of a PKCS#8-wrapped EC private key.
 *
 * ```text
 * PrivateKeyInfo ::= SEQUENCE { version INTEGER, algorithm AlgorithmIdentifier, privateKey OCTET STRING }
 * ECPrivateKey   ::= SEQUENCE { version INTEGER, privateKey OCTET STRING, [0] parameters?, [1] publicKey? }
 * ```
 *
 * Must not be pointed at untrusted bytes.
 *
 * @param pkcs8 DER-encoded PKCS#8 private key
 * @param size Expected scalar length, in bytes
 * @returns A view aliasing `pkcs8`, so that wiping it also wipes the scalar
 * @throws {SyntaxError} If the scalar isn't `size` bytes long
 */
export declare const extractEcPrivateScalar: (pkcs8: Uint8Array<ArrayBuffer>, size: number) => Uint8Array<ArrayBuffer>;
export declare const checkKeypairRelationship: (keypair: PrivateKey) => Promise<void>;
export declare const toMultikey: (prefix: Uint8Array, keyBytes: Uint8Array) => string;
type CheckFn = (condition: boolean, message: string) => asserts condition;
export declare const assertType: CheckFn;
export declare const assertSyntax: CheckFn;
export declare const assertUnreachable: (_: never, message: string) => never;
export {};
