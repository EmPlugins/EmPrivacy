import { type FoundPublicKey } from './multibase.ts';
import type { VerifyOptions } from './types.ts';
export declare const verifySig: (key: FoundPublicKey, sig: Uint8Array<ArrayBuffer>, data: Uint8Array<ArrayBuffer>, opts?: VerifyOptions) => Promise<boolean>;
export interface VerifyWithDidKeyOptions extends VerifyOptions {
    jwtAlg?: string;
}
export declare const verifySigWithDidKey: (didKey: string, sig: Uint8Array<ArrayBuffer>, data: Uint8Array<ArrayBuffer>, opts?: VerifyWithDidKeyOptions) => Promise<boolean>;
