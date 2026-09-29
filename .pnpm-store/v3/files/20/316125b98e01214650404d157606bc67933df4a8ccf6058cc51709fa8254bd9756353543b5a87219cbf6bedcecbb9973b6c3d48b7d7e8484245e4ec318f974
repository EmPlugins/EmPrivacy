import { RepoEntry } from './types.ts';
export type MissingBlockEntry = {
    cid: string;
    type: 'record';
    key: string;
} | {
    cid: string;
    type: 'mst-node';
} | {
    cid: string;
    type: 'commit';
};
export interface StreamedRepoReader {
    /** list of blocks that were referenced but not found in the repository */
    readonly missingBlocks: readonly MissingBlockEntry[];
    dispose(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
    [Symbol.asyncIterator](): AsyncIterator<RepoEntry>;
}
export declare const repoEntryTransform: () => ReadableWritablePair<RepoEntry, Uint8Array>;
export declare const fromStream: (stream: ReadableStream<Uint8Array>) => StreamedRepoReader;
