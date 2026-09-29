import { CidLinkWrapper } from '@atcute/cid';
export const isCarV1Header = (value) => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const { version, roots } = value;
    return version === 1 && Array.isArray(roots) && roots.every((root) => root instanceof CidLinkWrapper);
};
