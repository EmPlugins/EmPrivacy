import { toBase16, toBase64Url } from '@atcute/multibase';
import { toSha256 } from '@atcute/uint8array';
import { Point, getPublicKey, signAsync, utils, verify } from '@noble/secp256k1';
import { assertUnreachable, checkKeypairRelationship, toMultikey } from '../utils.js';
// Reference: https://atproto.com/specs/cryptography#public-key-encoding
export const SECP256K1_PUBLIC_PREFIX = Uint8Array.from([0xe7, 0x01]);
export const SECP256K1_PRIVATE_PREFIX = Uint8Array.from([0x81, 0x26]);
const toJsonWebKey = (publicKey, privateKey) => {
    // Reference: [1] RFC 7517 JSON Web Key -- https://datatracker.ietf.org/doc/html/rfc7517
    //            [2] RFC 7518 JSON Web Algorithms, § 6.2. Parameters for Elliptic Curve Keys -- https://datatracker.ietf.org/doc/html/rfc7518#section-6.2
    //            [3] RFC 8812 [...] JOSE Registrations for WebAuthn Algorithms, § 3. Using secp256k1 with JOSE and COSE -- https://datatracker.ietf.org/doc/html/rfc8812#section-3.1
    //            [4] RFC 9053 CBOR Object Signing and Encryption (COSE): Initial Algorithms, § 7.1.1. Double Coordinate Curves -- https://datatracker.ietf.org/doc/html/rfc9053#section-7.1.1
    // Decompress point so we can encode both x and y.
    // Could just make it a bool, but it's not recommended [4] and poorly supported.
    const point = Point.fromBytes(publicKey).toBytes(false);
    const key = {
        kty: 'EC', // [2]; [3] § 3.1.
        crv: 'secp256k1', // [2] § 6.2.1.1.; [3] § 3.1.
        alg: 'ES256K', // [1] § 4.4.; [3] § 3.2.
        x: toBase64Url(point.subarray(1, 33)), // [2] § 6.2.1.2.
        y: toBase64Url(point.subarray(33, 65)), // [2] § 6.2.1.3.
        key_ops: ['verify', 'sign'], // [1] § 4.3.
    };
    if (privateKey) {
        // Private parameters
        Object.assign(key, {
            d: toBase64Url(privateKey), // [2] § 6.2.2.1.
        });
    }
    return key;
};
export class Secp256k1PublicKey {
    type = 'secp256k1';
    jwtAlg = 'ES256K';
    /** @internal */
    _publicKey;
    /** @internal */
    constructor(publicKey) {
        this._publicKey = publicKey;
    }
    static async importRaw(publicKeyBytes) {
        return new Secp256k1PublicKey(publicKeyBytes);
    }
    async verify(sig, data, options) {
        if (sig.length !== 64) {
            // Invalid signature: must be exactly 64 bits
            // @noble/secp256k1 throws in this case, so we handle it gracefully here instead
            return false;
        }
        const allowMalleable = options?.allowMalleableSig ?? false;
        const hashed = await toSha256(data);
        return verify(sig, hashed, this._publicKey, { lowS: !allowMalleable, prehash: false });
    }
    async exportPublicKey(format) {
        const publicKeyBytes = this._publicKey;
        if (format === 'jwk') {
            return toJsonWebKey(publicKeyBytes);
        }
        switch (format) {
            case 'did': {
                return `did:key:${toMultikey(SECP256K1_PUBLIC_PREFIX, publicKeyBytes)}`;
            }
            case 'multikey': {
                return toMultikey(SECP256K1_PUBLIC_PREFIX, publicKeyBytes);
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
export class Secp256k1PrivateKey extends Secp256k1PublicKey {
    /** @internal */
    _privateKey;
    /** @internal */
    constructor(privateKeyBytes, publicKeyBytes) {
        super(publicKeyBytes);
        this._privateKey = privateKeyBytes;
    }
    static async importRaw(privateKeyBytes, publicKeyBytes) {
        const keypair = new Secp256k1PrivateKey(privateKeyBytes, publicKeyBytes ?? getPublicKey(privateKeyBytes));
        if (publicKeyBytes) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    async sign(data) {
        const hashed = await toSha256(data);
        const sig = await signAsync(hashed, this._privateKey, { lowS: true, prehash: false });
        return sig;
    }
}
export class Secp256k1PrivateKeyExportable extends Secp256k1PrivateKey {
    static async createKeypair() {
        const privateKeyBytes = utils.randomSecretKey();
        const publicKeyBytes = getPublicKey(privateKeyBytes);
        return new Secp256k1PrivateKeyExportable(privateKeyBytes, publicKeyBytes);
    }
    static async importRaw(privateKeyBytes, publicKeyBytes) {
        const keypair = new Secp256k1PrivateKeyExportable(privateKeyBytes, publicKeyBytes ?? getPublicKey(privateKeyBytes));
        if (publicKeyBytes) {
            await checkKeypairRelationship(keypair);
        }
        return keypair;
    }
    async exportPrivateKey(format) {
        const privateKeyBytes = this._privateKey;
        const publicKeyBytes = this._publicKey;
        if (format === 'jwk') {
            return toJsonWebKey(publicKeyBytes, privateKeyBytes);
        }
        switch (format) {
            case 'multikey': {
                return toMultikey(SECP256K1_PRIVATE_PREFIX, privateKeyBytes);
            }
            case 'raw': {
                return privateKeyBytes.slice();
            }
            case 'rawHex': {
                return toBase16(privateKeyBytes);
            }
        }
        assertUnreachable(format, `unknown "${format}" export format`);
    }
}
