import type { Did } from '@atcute/lexicons/syntax';
/** checks if input is a did:plc identifier */
export declare const isPlcDid: (input: unknown) => input is Did<'plc'>;
