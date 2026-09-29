import type { CidLink } from '@atcute/cid';
import { type CarEntry, type CarHeader } from './types.ts';
export interface StreamedCarReader {
    header(): Promise<CarHeader>;
    roots(): Promise<CidLink[]>;
    dispose(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.asyncIterator](): AsyncIterator<CarEntry>;
}
export declare const carEntryTransform: () => ReadableWritablePair<CarEntry, Uint8Array>;
export declare const fromStream: (stream: ReadableStream<Uint8Array>) => StreamedCarReader;
