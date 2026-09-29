import { isBytes } from '@atcute/cbor';
import { isCidLink } from '@atcute/cid';
/**
 * validates that an unknown value is a valid TreeEntry
 *
 * @param value the value to check
 * @returns true if value is a TreeEntry, false otherwise
 */
export const isTreeEntry = (value) => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const obj = value;
    return (typeof obj.p === 'number' && isBytes(obj.k) && isCidLink(obj.v) && (obj.t === null || isCidLink(obj.t)));
};
/**
 * validates that an unknown value is valid NodeData
 *
 * @param value the value to check
 * @returns true if value is NodeData, false otherwise
 */
export const isNodeData = (value) => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const obj = value;
    return (obj.l === null || isCidLink(obj.l)) && Array.isArray(obj.e) && obj.e.every(isTreeEntry);
};
