import { type Cid } from './codec.ts';
export interface CidLink {
    $link: string;
}
export declare class CidLinkWrapper implements CidLink {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    get $link(): string;
    toJSON(): CidLink;
}
export declare const isCidLink: (value: unknown) => value is CidLink;
export declare const toCidLink: (cid: Cid) => CidLink;
export declare const fromCidLink: (link: CidLink) => Cid;
