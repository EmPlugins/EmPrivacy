import type { DidKeyString, PrivateKey, PrivateKeyExportable, PublicKey, VerifyOptions } from '../types.ts';
export declare const SECP256K1_PUBLIC_PREFIX: Uint8Array<ArrayBuffer>;
export declare const SECP256K1_PRIVATE_PREFIX: Uint8Array<ArrayBuffer>;
export declare class Secp256k1PublicKey implements PublicKey {
    readonly type = "secp256k1";
    readonly jwtAlg = "ES256K";
    static importRaw(publicKeyBytes: Uint8Array): Promise<Secp256k1PublicKey>;
    verify(sig: Uint8Array, data: Uint8Array, options?: VerifyOptions): Promise<boolean>;
    exportPublicKey(format: 'did'): Promise<DidKeyString>;
    exportPublicKey(format: 'jwk'): Promise<JsonWebKey>;
    exportPublicKey(format: 'multikey'): Promise<string>;
    exportPublicKey(format: 'raw'): Promise<Uint8Array<ArrayBuffer>>;
    exportPublicKey(format: 'rawHex'): Promise<string>;
}
export declare class Secp256k1PrivateKey extends Secp256k1PublicKey implements PrivateKey {
    static importRaw(privateKeyBytes: Uint8Array, publicKeyBytes?: Uint8Array): Promise<Secp256k1PrivateKey>;
    sign(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>>;
}
export declare class Secp256k1PrivateKeyExportable extends Secp256k1PrivateKey implements PrivateKeyExportable {
    static createKeypair(): Promise<Secp256k1PrivateKeyExportable>;
    static importRaw(privateKeyBytes: Uint8Array, publicKeyBytes?: Uint8Array): Promise<Secp256k1PrivateKeyExportable>;
    exportPrivateKey(format: 'jwk'): Promise<JsonWebKey>;
    exportPrivateKey(format: 'multikey'): Promise<string>;
    exportPrivateKey(format: 'raw'): Promise<Uint8Array<ArrayBuffer>>;
    exportPrivateKey(format: 'rawHex'): Promise<string>;
}
