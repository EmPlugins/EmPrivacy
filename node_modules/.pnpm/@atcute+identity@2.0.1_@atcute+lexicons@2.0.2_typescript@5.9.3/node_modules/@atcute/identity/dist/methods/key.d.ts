import type { Did } from '@atcute/lexicons';
/** checks if input is a did:key identifier */
export declare const isKeyDid: (input: unknown) => input is Did<'key'>;
