//#region src/object-cache/memory.ts
const STORE_KEY = Symbol.for("emdash:object-cache:memory");
const g = globalThis;
function getStore(maxEntries) {
	const existing = g[STORE_KEY];
	if (existing) return existing;
	const store = {
		map: /* @__PURE__ */ new Map(),
		maxEntries
	};
	g[STORE_KEY] = store;
	return store;
}
/**
* Create the in-isolate memory backend.
*
* Config keys (all optional):
* - `maxEntries` — soft cap on stored keys; oldest insertions are evicted
*   first when exceeded (FIFO, cheap and good enough for a backstop). Default
*   1000.
*/
const createObjectCache = (config) => {
	const store = getStore(typeof config.maxEntries === "number" ? config.maxEntries : 1e3);
	return {
		get(key) {
			const entry = store.map.get(key);
			if (!entry) return Promise.resolve(null);
			if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
				store.map.delete(key);
				return Promise.resolve(null);
			}
			return Promise.resolve(entry.value);
		},
		set(key, value, ttlSeconds) {
			store.map.delete(key);
			store.map.set(key, {
				value,
				expiresAt: ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1e3 : null
			});
			while (store.map.size > store.maxEntries) {
				const oldest = store.map.keys().next().value;
				if (oldest === void 0) break;
				store.map.delete(oldest);
			}
			return Promise.resolve();
		},
		delete(key) {
			store.map.delete(key);
			return Promise.resolve();
		}
	};
};

//#endregion
export { createObjectCache };
//# sourceMappingURL=memory.mjs.map