import type { AtprotoAudience, AtprotoDid, Did } from '@atcute/lexicons/syntax';
/** checks if it's a DID identifier that is supported by atproto */
export declare const isAtprotoDid: (input: unknown) => input is AtprotoDid;
export declare const isAtprotoAudience: (input: unknown) => input is AtprotoAudience;
/** returns the DID's method */
export declare const extractDidMethod: <M extends string>(did: Did<M>) => M;
