import { Logger } from "kysely";

//#region src/database/instrumentation.d.ts
declare const QUERY_LOG_ENV = "EMDASH_QUERY_LOG";
declare const QUERY_LOG_PREFIX = "[emdash-query-log]";
interface QueryEvent {
  sql: string;
  params: readonly unknown[];
  durationMs: number;
  route: string;
  method: string;
  phase: string;
}
interface QueryRecorder {
  events: QueryEvent[];
  route: string;
  method: string;
  phase: string;
  /**
   * Set once the recorder has been emitted, so a flush is idempotent.
   * Without this, a fallback flush and the stream-end flush could both
   * fire and double-emit the events.
   */
  flushed?: boolean;
  /**
   * Set when the response body is wrapped for stream-end metrics. The
   * recorder is then flushed when the body finishes streaming (so it
   * captures queries issued by components during streaming) rather than
   * when middleware returns (headers ready, body not yet streamed).
   */
  deferredFlush?: boolean;
}
declare function createRecorder(route: string, method: string, phase: string): QueryRecorder;
declare function recordEvent(rec: QueryRecorder, sql: string, params: readonly unknown[], durationMs: number): void;
/**
 * Emit all events from a recorder as prefixed NDJSON on stdout. The
 * harness pipes the child's stdout, filters lines beginning with
 * QUERY_LOG_PREFIX, and writes them to its own file. Using stdout means
 * the sink works uniformly in Node and in workerd (which has no fs).
 *
 * Idempotent: the first call emits and marks the recorder flushed, later
 * calls no-op. For streamed responses the flush is deferred to stream end
 * (see wrapBodyForStreamMetrics) so it captures queries issued while the
 * body is still rendering; bodyless responses fall back to a flush when
 * middleware returns.
 */
declare function flushRecorder(rec: QueryRecorder): void;
/**
 * Whether query instrumentation is enabled. Read at Kysely construction
 * time and middleware entry — the env var is a process-lifetime flag, not
 * per-request. Gated via `process.env` so adapters that ship env through
 * to the worker (e.g. Miniflare via wrangler.jsonc `vars` or host env
 * pass-through) can enable it at runtime.
 */
declare function isInstrumentationEnabled(): boolean;
/**
 * Returns a Kysely `log` callback. Always returns a function so per-request
 * counters (db.count, db.total, db.first, db.last) and the optional NDJSON
 * recorder both get fed. The cost over the previous "undefined when off"
 * behaviour is one `performance.now()` pair per query inside Kysely, which
 * is in the noise compared to any real query.
 */
declare function kyselyLogOption(): Logger;
/**
 * Record physical database round trips for the current request.
 *
 * Called by backends that batch (the DO SQL driver coalesces same-turn SELECTs
 * into one RPC), so we can see round-trip count separately from logical query
 * count (`dbCount`, bumped by the Kysely log hook). No-op outside a request or
 * when metrics aren't attached (e.g. migrations on the singleton).
 */
declare function recordRpc(count?: number): void;
//#endregion
export { QUERY_LOG_ENV, QUERY_LOG_PREFIX, QueryEvent, QueryRecorder, createRecorder, flushRecorder, isInstrumentationEnabled, kyselyLogOption, recordEvent, recordRpc };
//# sourceMappingURL=instrumentation.d.mts.map