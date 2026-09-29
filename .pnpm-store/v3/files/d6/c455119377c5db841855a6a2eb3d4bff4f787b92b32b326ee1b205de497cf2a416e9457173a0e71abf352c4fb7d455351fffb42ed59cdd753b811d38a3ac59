import type { DidKeyString, PrivateKey, PrivateKeyExportable, PublicKey, VerifyOptions } from '../types.ts';
export declare const P256_PUBLIC_PREFIX: Uint8Array<ArrayBuffer>;
export declare const P256_PRIVATE_PREFIX: Uint8Array<ArrayBuffer>;
export declare class P256PublicKey implements PublicKey {
    readonly type = "p256";
    readonly jwtAlg = "ES256";
    static importRaw(publicKeyBytes: Uint8Array): Promise<P256PublicKey>;
    static importCryptoKey(publicKey: CryptoKey): Promise<P256PublicKey>;
    verify(sig: Uint8Array, data: Uint8Array, options?: VerifyOptions): Promise<boolean>;
    exportPublicKey(format: 'did'): Promise<DidKeyString>;
    exportPublicKey(format: 'jwk'): Promise<JsonWebKey>;
    exportPublicKey(format: 'multikey'): Promise<string>;
    exportPublicKey(format: 'raw'): Promise<Uint8Array<ArrayBuffer>>;
    exportPublicKey(format: 'rawHex'): Promise<string>;
}
export declare class P256PrivateKey extends P256PublicKey implements PrivateKey {
    static importRaw(privateKeyBytes: Uint8Array, publicKeyBytes?: Uint8Array): Promise<P256PrivateKey>;
    static importCryptoKey(privateKey: CryptoKey, publicKey?: CryptoKey): Promise<P256PrivateKey>;
    static importCryptoKeyPair(keypair: CryptoKeyPair): Promise<P256PrivateKey>;
    sign(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>>;
}
export declare class P256PrivateKeyExportable extends P256PrivateKey implements PrivateKeyExportable {
    static createKeypair(): Promise<P256PrivateKeyExportable>;
    static importRaw(privateKeyBytes: Uint8Array, publicKeyBytes?: Uint8Array): Promise<P256PrivateKeyExportable>;
    static importCryptoKey(privateKey: CryptoKey, publicKey?: CryptoKey): Promise<P256PrivateKeyExportable>;
    static importCryptoKeyPair(keypair: CryptoKeyPair): Promise<P256PrivateKeyExportable>;
    exportPrivateKey(format: 'jwk'): Promise<JsonWebKey>;
    exportPrivateKey(format: 'multikey'): Promise<string>;
    exportPrivateKey(format: 'raw'): Promise<Uint8Array<ArrayBuffer>>;
    exportPrivateKey(format: 'rawHex'): Promise<string>;
}
