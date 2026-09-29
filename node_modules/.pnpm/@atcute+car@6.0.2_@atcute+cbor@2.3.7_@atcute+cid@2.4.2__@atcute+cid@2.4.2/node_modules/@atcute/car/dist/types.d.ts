import { type Cid, type CidLink } from '@atcute/cid';
export interface CarV1Header {
    version: 1;
    roots: CidLink[];
}
export declare const isCarV1Header: (value: unknown) => value is CarV1Header;
export interface CarHeader {
    headerStart: number;
    headerEnd: number;
    data: CarV1Header;
    dataStart: number;
    dataEnd: number;
}
export interface CarEntry {
    entryStart: number;
    entryEnd: number;
    cid: Cid;
    cidStart: number;
    cidEnd: number;
    bytes: Uint8Array;
    bytesStart: number;
    bytesEnd: number;
}
/** represents a block to be written to a CAR file */
export interface CarBlock {
    /** the CID of the block (as bytes) */
    cid: Uint8Array;
    /** the block data */
    data: Uint8Array;
}
