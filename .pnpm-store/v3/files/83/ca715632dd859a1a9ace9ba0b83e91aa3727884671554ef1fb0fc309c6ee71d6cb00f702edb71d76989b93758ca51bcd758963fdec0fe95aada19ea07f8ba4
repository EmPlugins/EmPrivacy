import { isCid } from '../syntax/cid.js';
const CID_LINK_SYMBOL = Symbol.for('@atcute/cid-link-wrapper');
/** @internal */
export const _isCidLinkWrapper = (input) => {
    return typeof input === 'object' && input !== null && CID_LINK_SYMBOL in input;
};
export const isCidLink = (input) => {
    // oxlint-disable-next-line typescript/no-explicit-any
    const v = input;
    return typeof v === 'object' && v !== null && (CID_LINK_SYMBOL in v || isCid(v.$link));
};
