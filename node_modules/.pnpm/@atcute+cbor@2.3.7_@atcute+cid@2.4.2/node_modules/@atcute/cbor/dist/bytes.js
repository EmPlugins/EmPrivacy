import { fromBase64, fromBase64Pad, toBase64 } from '@atcute/multibase';
const BYTES_SYMBOL = Symbol.for('@atcute/bytes-wrapper');
export class BytesWrapper {
    /** @internal */
    [BYTES_SYMBOL] = true;
    buf;
    constructor(buf) {
        this.buf = buf;
    }
    get $bytes() {
        return toBase64(this.buf);
    }
    toJSON() {
        return { $bytes: this.$bytes };
    }
}
export const isBytes = (value) => {
    // oxlint-disable-next-line typescript/no-explicit-any
    const val = value;
    return (val instanceof BytesWrapper || (val !== null && typeof val === 'object' && typeof val.$bytes === 'string'));
};
export const toBytes = (buf) => {
    return new BytesWrapper(buf);
};
export const fromBytes = (bytes) => {
    if (bytes instanceof BytesWrapper) {
        return bytes.buf;
    }
    // atproto emits unpadded base64 but the data-model permits optional padding on `$bytes`; accept
    // both while keeping the generic codecs strict.
    const $bytes = bytes.$bytes;
    return $bytes.charCodeAt($bytes.length - 1) === 0x3d ? fromBase64Pad($bytes) : fromBase64($bytes);
};
