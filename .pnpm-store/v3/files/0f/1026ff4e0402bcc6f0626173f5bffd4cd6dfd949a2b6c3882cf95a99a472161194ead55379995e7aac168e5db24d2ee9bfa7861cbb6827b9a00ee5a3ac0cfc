import { toBase32 } from '@atcute/multibase';
import { decode, fromString } from './codec.js';
const CID_LINK_SYMBOL = Symbol.for('@atcute/cid-link-wrapper');
export class CidLinkWrapper {
    /** @internal */
    [CID_LINK_SYMBOL] = true;
    bytes;
    constructor(bytes) {
        this.bytes = bytes;
    }
    get $link() {
        const link = `b${toBase32(this.bytes)}`;
        Object.defineProperty(this, '$link', {
            value: link,
            enumerable: true,
        });
        return link;
    }
    toJSON() {
        return { $link: this.$link };
    }
}
export const isCidLink = (value) => {
    // oxlint-disable-next-line typescript/no-explicit-any
    const val = value;
    return (val instanceof CidLinkWrapper ||
        (val !== null && typeof val === 'object' && typeof val.$link === 'string'));
};
export const toCidLink = (cid) => {
    return new CidLinkWrapper(cid.bytes);
};
export const fromCidLink = (link) => {
    if (link instanceof CidLinkWrapper) {
        return decode(link.bytes);
    }
    return fromString(link.$link);
};
