import { DEV } from 'esm-env';
// oxlint-disable-next-line typescript/no-explicit-any
export const assert = (condition, message) => {
    if (!condition) {
        if (DEV) {
            throw new Error(`Assertion failed` + (message ? `: ${message}` : ``));
        }
        throw new Error(`Assertion failed`);
    }
};
export const assertNever = (_, message) => {
    assert(false, message);
};
