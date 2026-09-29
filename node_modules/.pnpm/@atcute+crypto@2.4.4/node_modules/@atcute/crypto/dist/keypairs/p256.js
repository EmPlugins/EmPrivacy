// oxlint-disable typescript/no-explicit-any
// oxlint-disable no-useless-spread
import { toBase16 } from '@atcute/multibase';
import { concat } from '@atcute/uint8array';
import { P256_N, uncompressP256Point } from '../utils-p256.js';
import { assertType, assertUnreachable, checkKeypairRelationship, compressPoint, deriveEcPublicKeyFromPrivateKey, extractEcPrivateScalar, isSignatureNormalized, isUncompressedPoint, normalizeSignature, toMultikey, } from '../utils.js';
// Reference: https://atproto.com/specs/cryptography#public-key-encoding
export const P256_PUBLIC_PREFIX = Uint8Array.from([0x80, 0x24]);
export const P256_PRIVATE_PREFIX = Uint8Array.from([0x86, 0x26]);
const ECDSA_ALG = {
    name: 'ECDSA',
    namedCurve: 'P-256',
    hash: 'SHA-256',
};
// importing raw compressed EC points is supported on Node, Bun, Deno, Chrome,
// and Firefox 132+. WebKit does not support it (as of 2026-03-18).
// `undefined` means we haven't probed yet — the first import will try compressed
// and set this based on whether it succeeds.
let IS_COMPRESSED_POINT_SUPPORTED;
const importPublicKey = async (publicKeyBytes, extractable, usages) => {
    if (IS_COMPRESSED_POINT_SUPPORTED === true || isUncompressedPoint(publicKeyBytes)) {
        return crypto.subtle.importKey('raw', publicKeyBytes, ECDSA_ALG, extractable, usages);
    }
    if (IS_COMPRESSED_POINT_SUPPORTED === false) {
        return crypto.subtle.importKey('raw', uncompressP256Point(publicKeyBytes), ECDSA_ALG, extractable, usages);
    }
    try {
        const key = await crypto.subtle.importKey('raw', publicKeyBytes, ECDSA_ALG, extractable, usages);
        IS_COMPRESSED_POINT_SUPPORTED = true;
        return key;
    }
    catch {
        const key = await crypto.subtle.importKey('raw', uncompressP256Point(publicKeyBytes), ECDSA_ALG, extractable, usages);
        IS_COMPRESSED_POINT_SUPPORTED = false;
        return key;
    }
};
const ASN1_ALGORITHM_IDENTIFIER = Uint8Array.from([
    ...[/* SEQ */ 0x30, /* len */ 0x13], // AlgorithmIdentifier
    /**/ ...[/* OID */ 0x06, /* len */ 0x07], // {iso(1) member-body(2) us(840) ansi-x962(10045) keyType(2) ecPublicKey(1)} -- https://datatracker.ietf.org/doc/html/rfc5753#section-7.1.2
    /******/ ...[/* 1.2.840.10045.2.1 (ecPublicKey) */ 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01],
    /**/ ...[/* OID */ 0x06, /* len */ 0x08], // {iso(1) member-body(2) us(840) ansi-x962(10045) curves(3) prime(1) prime256v1(7)} -- https://datatracker.ietf.org/doc/html/rfc5480#section-2.1.1.1
    /******/ ...[/* 1.2.840.10045.3.1.7 (prime256v1) */ 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07],
]);
// This is a hack, to convert a raw private key to a PKCS#8 wrapped key.
// Reference: [1] RFC 5958 Asymmetric Key Packages, § 2. Asymmetric Key Package CMS Content Type https://datatracker.ietf.org/doc/html/rfc5958#section-2
// A raw private key can trivially be wrapped in a dummy PKCS#8 container (aka OneAsymmetricKey) without any extra information.
// The algorithm identifier has been hardcoded to Elliptic Curve Cryptography, ECC curve name prime256v1.
// See also: https://lapo.it/asn1js/#MEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCAf4zlQxfRhEkrpksK9_fHHOxYV9XG9Vn5g0Zqh9IzfQg
//
// FYI: has been written like this for readability, minified properly by esbuild.
// https://esbuild.github.io/try/#dAAwLjI0LjIALS1taW5pZnkAY29uc3QgdGVzdCA9IG5ldyBVaW50OEFycmF5KFsgLi4uWzAsIDFdLCAuLi5bMiwgM11dKQ
const PKCS8_PRIVATE_KEY_PREFIX = Uint8Array.from([
    ...[/* SEQ */ 0x30, /* len */ 0x41], // PrivateKeyInfo
    /**/ ...[/* INT */ 0x02, /* len */ 0x01, /* 0 */ 0x00], // Version
    /**/ ...ASN1_ALGORITHM_IDENTIFIER, // AlgorithmIdentifier
    /**/ ...[/* OCT_STR */ 0x04, /* len */ 0x27], // PrivateKey
    /******/ ...[/* SEQ */ 0x30, /* len */ 0x25],
    /**********/ ...[/* INT */ 0x02, /* len */ 0x01, /* 1 */ 0x01],
    /**********/ ...[/* OCT_STR */ 0x04, /* len: 32 */ 0x20 /* ... */],
]);
export class P256PublicKey {
    type = 'p256';
    jwtAlg = 'ES256';
    /** @internal */
    _publicKey;
    /** @internal */
    constructor(publicKey) {
        this._publicKey = publicKey;
    }
    static async importRaw(publicKeyBytes) {
        const imported = await importPublicKey(publicKeyBytes, true, ['verify']);
        return new P256PublicKey(imported);
    }
    static async importCryptoKey(publicKey) {
        // Type cast to make resulting code smaller
        assertType(publicKey.algorithm.namedCurve === 'P-256', 'not an ECDSA P-256 key');
        assertType(publicKey.type === 'public', 'not a public key');
        assertType(publicKey.extractable, 'key must be extractable');
        return new P256PublicKey(publicKey);
    }
    async verify(sig, data, options) {
        if (sig.length !== 64) {
            // Invalid signature: must be exactly 64 bits
            return false;
        }
        if (!options?.allowMalleableSig && !isSignatureNormalized(sig, P256_N)) {
            // Invalid signature: not low-S normalized
            return false;
        }
        return await crypto.subtle.verify(ECDSA_ALG, this._publicKey, sig, data);
    }
    async exportPublicKey(format) {
        if (format === 'jwk') {
            return await crypto.subtle.exportKey('jwk', this._publicKey);
        }
        const buffer = await crypto.subtle.exportKey('raw', this._publicKey);
        // WebCrypto spits out the uncompressed EC point: https://www.w3.org/TR/WebCryptoAPI/#ecdsa-operations:~:text=using%20the%20uncompressed%20format
        // We need to compress it according to the ATProto Cryptography specification.
        // https://atproto.com/specs/cryptography#public-key-encoding, 1st point.
        const publicKeyBytes = compressPoint(new Uint8Array(buffer));
        switch (format) {
            case 'did': {
                return `did:key:${toMultikey(P256_PUBLIC_PREFIX, publicKeyBytes)}`;
            }
            case 'multikey': {
                return toMultikey(P256_PUBLIC_PREFIX, publicKeyBytes);
            }
            case 'raw': {
                return publicKeyBytes;
            }
            case 'rawHex': {
                return toBase16(publicKeyBytes);
            }
        }
        assertUnreachable(format, `unknown "${format}" export format`);
    }
}
export class P256PrivateKey extends P256PublicKey {
    /** @internal */
    _privateKey;
    /** @internal */
    constructor(privateKey, publicKey) {
        super(publicKey);
        this._privateKey = privateKey;
    }
    static async importRaw(privateKeyBytes, publicKeyBytes) {
        const pkcs8 = concat([PKCS8_PRIVATE_KEY_PREFIX, privateKeyBytes]);
        const privateKey = await crypto.subtle.importKey('pkcs8', pkcs8, ECDSA_ALG, !publicKeyBytes, ['sign']);
        let publicKey;
        if (publicKeyBytes) {
            publicKey = await importPublicKey(publicKeyBytes, true, ['verify']);
        }
        else {
            publicKey = await deriveEcPublicKeyFromPrivateKey(privateKey, ['verify']);
        }
        const keypair = new P256PrivateKey(privateKey, publicKey);
        if (publicKeyBytes) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    static async importCryptoKey(privateKey, publicKey) {
        // Type cast to make resulting code smaller
        assertType(privateKey.algorithm.namedCurve === 'P-256', '1st key is not an ECDSA P-256 key');
        assertType(privateKey.type === 'private', '1st key is not a private key');
        if (publicKey) {
            assertType(publicKey.algorithm.namedCurve === 'P-256', '2nd key is not an ECDSA P-256 key');
            assertType(publicKey.type === 'public', '2nd key is not a public key');
            assertType(publicKey.extractable, 'public key must be extractable');
        }
        else {
            assertType(privateKey.extractable, 'private key must be extractable if no public key is provided');
        }
        const keypair = new P256PrivateKey(privateKey, publicKey ?? (await deriveEcPublicKeyFromPrivateKey(privateKey, ['verify'])));
        if (publicKey) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    // convenience shortcut
    static async importCryptoKeyPair(keypair) {
        return await this.importCryptoKey(keypair.privateKey, keypair.publicKey);
    }
    async sign(data) {
        const sig = await crypto.subtle.sign(ECDSA_ALG, this._privateKey, data);
        return normalizeSignature(new Uint8Array(sig), P256_N);
    }
}
export class P256PrivateKeyExportable extends P256PrivateKey {
    static async createKeypair() {
        const keypair = await crypto.subtle.generateKey(ECDSA_ALG, true, ['sign', 'verify']);
        return new P256PrivateKeyExportable(keypair.privateKey, keypair.publicKey);
    }
    static async importRaw(privateKeyBytes, publicKeyBytes) {
        const pkcs8 = concat([PKCS8_PRIVATE_KEY_PREFIX, privateKeyBytes]);
        // always import as extractable for exportable keys
        const privateKey = await crypto.subtle.importKey('pkcs8', pkcs8, ECDSA_ALG, true, ['sign']);
        let publicKey;
        if (publicKeyBytes) {
            publicKey = await importPublicKey(publicKeyBytes, true, ['verify']);
        }
        else {
            publicKey = await deriveEcPublicKeyFromPrivateKey(privateKey, ['verify']);
        }
        const keypair = new P256PrivateKeyExportable(privateKey, publicKey);
        if (publicKeyBytes) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    static async importCryptoKey(privateKey, publicKey) {
        assertType(privateKey.algorithm.namedCurve === 'P-256', '1st key is not an ECDSA P-256 key');
        assertType(privateKey.type === 'private', '1st key is not a private key');
        assertType(privateKey.extractable, 'private key must be extractable');
        if (publicKey) {
            assertType(publicKey.algorithm.namedCurve === 'P-256', '2nd key is not an ECDSA P-256 key');
            assertType(publicKey.type === 'public', '2nd key is not a public key');
            assertType(publicKey.extractable, 'public key must be extractable');
        }
        const keypair = new P256PrivateKeyExportable(privateKey, publicKey ?? (await deriveEcPublicKeyFromPrivateKey(privateKey, ['verify'])));
        if (publicKey) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    static async importCryptoKeyPair(keypair) {
        return await this.importCryptoKey(keypair.privateKey, keypair.publicKey);
    }
    async exportPrivateKey(format) {
        if (format === 'jwk') {
            return await crypto.subtle.exportKey('jwk', this._privateKey);
        }
        const privateKeyPkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', this._privateKey));
        const privateKeyBytes = extractEcPrivateScalar(privateKeyPkcs8, 32);
        switch (format) {
            case 'multikey': {
                return toMultikey(P256_PRIVATE_PREFIX, privateKeyBytes);
            }
            case 'raw': {
                return privateKeyBytes;
            }
            case 'rawHex': {
                return toBase16(privateKeyBytes);
            }
        }
        assertUnreachable(format, `unknown "${format}" export format`);
    }
}
