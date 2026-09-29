import type { CidLink } from '@atcute/cid';
import { type CarEntry, type CarHeader } from './types.ts';
export interface SyncCarReader {
    readonly header: CarHeader;
    readonly roots: CidLink[];
    [Symbol.iterator](): IterableIterator<CarEntry>;
}
export declare const fromUint8Array: (buffer: Uint8Array) => SyncCarReader;
