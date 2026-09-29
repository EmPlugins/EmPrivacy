export type FoundPrivateKey = {
    type: 'p256';
    privateKeyBytes: Uint8Array<ArrayBuffer>;
} | {
    type: 'secp256k1';
    privateKeyBytes: Uint8Array<ArrayBuffer>;
};
export type FoundPublicKey = {
    type: 'p256';
    jwtAlg: 'ES256';
    publicKeyBytes: Uint8Array<ArrayBuffer>;
} | {
    type: 'secp256k1';
    jwtAlg: 'ES256K';
    publicKeyBytes: Uint8Array<ArrayBuffer>;
};
export declare const parseDidKey: (key: string) => FoundPublicKey;
export declare const parsePublicMultikey: (key: string) => FoundPublicKey;
export declare const getPublicKeyFromDidController: (controller: {
    type: string;
    publicKeyMultibase: string;
}) => FoundPublicKey;
export declare const parsePrivateMultikey: (key: string) => FoundPrivateKey;
