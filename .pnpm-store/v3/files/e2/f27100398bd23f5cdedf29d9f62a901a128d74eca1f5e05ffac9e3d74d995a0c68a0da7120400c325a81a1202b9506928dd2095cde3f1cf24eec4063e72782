import { buildFetchHandler } from './fetch-handler.js';
/**
 * parses the IETF draft `RateLimit-*` header fields off a response.
 *
 * note that these headers are only readable where the server exposes them via CORS; the Bluesky PDS does not,
 * so this returns `null` for cross-origin browser requests even when the server enforces a limit.
 *
 * @param headers the response headers to read from
 * @returns the parsed rate-limit information, or `null` if the headers are absent or malformed
 */
export const parseRateLimitHeaders = (headers) => {
    const limit = _parseInteger(headers.get('ratelimit-limit'));
    const remaining = _parseInteger(headers.get('ratelimit-remaining'));
    const reset = _parseInteger(headers.get('ratelimit-reset'));
    if (limit === null || remaining === null || reset === null) {
        return null;
    }
    return {
        limit: limit,
        remaining: remaining,
        reset: new Date(reset * 1000),
        policy: headers.get('ratelimit-policy'),
    };
};
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_MAX_DELAY = 60_000;
const DEFAULT_FALLBACK = 1_000;
const _retryOn429 = (response) => response.status === 429;
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
export const retryFetchHandler = ({ handler, maxRetries = DEFAULT_MAX_RETRIES, maxDelay = DEFAULT_MAX_DELAY, fallbackDelay = DEFAULT_FALLBACK, shouldRetry = _retryOn429, onRetry, }) => {
    const next = buildFetchHandler(handler);
    return async (pathname, init) => {
        // a streamed body is consumed on the first send and cannot be replayed
        const canRetry = !(init.body instanceof ReadableStream);
        let attempt = 0;
        while (true) {
            const response = await next(pathname, init);
            if (!canRetry || attempt >= maxRetries || !shouldRetry(response, attempt)) {
                return response;
            }
            const delay = _getRetryDelay(response, attempt, fallbackDelay, maxDelay);
            if (delay === null) {
                // no usable delay: blind backoff is disabled, or an authoritative delay exceeds maxDelay
                return response;
            }
            onRetry?.(response, attempt, delay);
            // release the connection so it can be reused for the retry
            await response.body?.cancel();
            await _sleep(delay, init.signal);
            attempt++;
        }
    };
};
// #endregion
// #region Utility functions
const _parseInteger = (value) => {
    if (value === null) {
        return null;
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
};
const _parseRetryAfter = (value) => {
    const seconds = Number(value);
    if (Number.isFinite(seconds)) {
        return seconds * 1000;
    }
    const date = Date.parse(value);
    if (!Number.isNaN(date)) {
        return date - Date.now();
    }
    return null;
};
const _getRetryDelay = (response, attempt, fallbackDelay, maxDelay) => {
    const headers = response.headers;
    {
        const retryAfter = headers.get('retry-after');
        if (retryAfter !== null) {
            const delay = _parseRetryAfter(retryAfter);
            if (delay !== null && delay >= 0) {
                // an authoritative delay beyond the cap means retrying sooner would just fail again
                return delay <= maxDelay ? delay : null;
            }
        }
    }
    {
        const info = parseRateLimitHeaders(headers);
        if (info !== null) {
            const delay = info.reset.getTime() - Date.now();
            if (delay >= 0) {
                return delay <= maxDelay ? delay : null;
            }
        }
    }
    if (fallbackDelay === null) {
        return null;
    }
    // exponential backoff with full jitter, capped at maxDelay
    const backoff = Math.min(fallbackDelay * 2 ** attempt, maxDelay);
    return Math.random() * backoff;
};
const _sleep = (ms, signal) => {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(signal.reason);
        }
        const onAbort = () => {
            clearTimeout(timer);
            reject(signal.reason);
        };
        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        signal?.addEventListener('abort', onAbort, { once: true });
    });
};
// #endregion
