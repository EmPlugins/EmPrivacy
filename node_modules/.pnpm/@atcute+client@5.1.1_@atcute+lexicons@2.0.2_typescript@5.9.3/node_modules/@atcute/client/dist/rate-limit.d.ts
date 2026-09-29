import { type FetchHandler, type FetchHandlerObject } from './fetch-handler.ts';
/** rate-limit information parsed from a response's `RateLimit-*` headers */
export interface RateLimitInfo {
    /** maximum number of points permitted within the window */
    limit: number;
    /** points remaining before the limit is reached */
    remaining: number;
    /** time at which the window resets */
    reset: Date;
    /** raw policy descriptor, e.g. `3000;w=300` */
    policy: string | null;
}
/**
 * parses the IETF draft `RateLimit-*` header fields off a response.
 *
 * note that these headers are only readable where the server exposes them via CORS; the Bluesky PDS does not,
 * so this returns `null` for cross-origin browser requests even when the server enforces a limit.
 *
 * @param headers the response headers to read from
 * @returns the parsed rate-limit information, or `null` if the headers are absent or malformed
 */
export declare const parseRateLimitHeaders: (headers: Headers) => RateLimitInfo | null;
/** options for {@link retryFetchHandler} */
export interface RetryFetchHandlerOptions {
    /** the underlying fetch handler to wrap */
    handler: FetchHandler | FetchHandlerObject;
    /**
     * maximum number of retry attempts before returning the last response
     *
     * @default 3
     */
    maxRetries?: number;
    /**
     * upper bound on how long to wait before a retry, in milliseconds. when an authoritative `Retry-After` or
     * `RateLimit-Reset` header asks to wait longer than this, the handler gives up and returns the response
     * rather than retrying early into a window that has not reset yet.
     *
     * @default 60_000
     */
    maxDelay?: number;
    /**
     * base delay, in milliseconds, used for exponential backoff when the response carries no timing signal
     * (`Retry-After` or `RateLimit-Reset`) — the usual case for cross-origin browser requests, since those
     * headers are hidden by CORS.
     *
     * set to `null` to skip retrying when there is no timing signal, returning the response as-is; useful
     * because atproto rate-limit windows span minutes, so a blind backoff often expires its attempts long
     * before the window resets.
     *
     * @default 1_000
     */
    fallbackDelay?: number | null;
    /**
     * decides whether a response should be retried. defaults to retrying on HTTP 429.
     *
     * @param response the response to inspect
     * @param attempt zero-based index of the attempt that produced this response
     */
    shouldRetry?: (response: Response, attempt: number) => boolean;
    /**
     * called immediately before sleeping for a retry.
     *
     * @param response the response that triggered the retry
     * @param attempt zero-based index of the attempt that produced this response
     * @param delay the delay, in milliseconds, before the next attempt
     */
    onRetry?: (response: Response, attempt: number, delay: number) => void;
}
/**
 * wraps a fetch handler so that rate-limited responses are retried automatically.
 *
 * the retry delay is derived, in order of preference, from the `Retry-After` header, the `RateLimit-Reset`
 * header, then exponential backoff with full jitter (see {@link RetryFetchHandlerOptions.fallbackDelay}). it
 * works across origins because it keys off the status code rather than the (often CORS-hidden) `RateLimit-*`
 * headers.
 *
 * requests with a {@link ReadableStream} body are never retried, since the body cannot be replayed.
 *
 * @param options handler options
 * @returns a fetch handler that retries according to `options`
 */
export declare const retryFetchHandler: ({ handler, maxRetries, maxDelay, fallbackDelay, shouldRetry, onRetry, }: RetryFetchHandlerOptions) => FetchHandler;
