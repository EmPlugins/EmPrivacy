// SPDX-License-Identifier: MIT

/** Public npm package page for this plugin. */
export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@emplugins/emprivacy";

/** npm registry metadata for the `latest` dist-tag. */
export const NPM_REGISTRY_LATEST_URL = "https://registry.npmjs.org/@emplugins/emprivacy/latest";

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const SUCCESS_CACHE_MS = 10 * 60 * 1000;
const FAILURE_CACHE_MS = 60 * 1000;
const FETCH_TIMEOUT_MS = 2500;

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

type CacheEntry = { value: string | null; expiresAt: number };

let cache: CacheEntry | null = null;

export function resetLatestNpmVersionCache(): void {
	cache = null;
}

/** Accept only a well-formed semver from untrusted registry JSON. */
export function parseNpmLatestVersion(data: unknown): string | null {
	if (!data || typeof data !== "object") return null;
	const version = (data as { version?: unknown }).version;
	if (typeof version !== "string") return null;
	const trimmed = version.trim();
	return SEMVER.test(trimmed) ? trimmed : null;
}

function parseCore(version: string): [number, number, number] | null {
	const m = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
	if (!m) return null;
	return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** True when `latest` is a higher MAJOR.MINOR.PATCH than `installed`. */
export function isNewerPublished(latest: string, installed: string): boolean {
	const a = parseCore(latest);
	const b = parseCore(installed);
	if (!a || !b) return latest !== installed;
	if (a[0] !== b[0]) return a[0] > b[0];
	if (a[1] !== b[1]) return a[1] > b[1];
	return a[2] > b[2];
}

export function pluginVersionFields(
	installed: string,
	latest: string | null,
): Array<{ label: string; value: string }> {
	return [
		{ label: "Installed version", value: installed },
		{
			label: "Latest on npm",
			value: latest ?? "Could not reach npm",
		},
	];
}

export function pluginVersionNote(installed: string, latest: string | null): string {
	if (latest && isNewerPublished(latest, installed)) {
		return `A newer version is published. Update @emplugins/emprivacy to get it. ${NPM_PACKAGE_URL}`;
	}
	return `Published package: ${NPM_PACKAGE_URL}`;
}

/**
 * Read the published `latest` version from the npm registry.
 * Results are cached briefly so admin save/reload does not hit npm every time.
 * Failures return null and never throw — the settings page must still load.
 */
export async function fetchLatestPublishedVersion(options?: {
	fetch?: FetchLike;
	now?: number;
	timeoutMs?: number;
}): Promise<string | null> {
	const now = options?.now ?? Date.now();
	if (cache && now < cache.expiresAt) return cache.value;

	const doFetch = options?.fetch ?? globalThis.fetch;
	const timeoutMs = options?.timeoutMs ?? FETCH_TIMEOUT_MS;

	try {
		const response = await doFetch(NPM_REGISTRY_LATEST_URL, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"User-Agent": "EmPrivacy (https://github.com/EmPlugins/EmPrivacy)",
			},
			signal: AbortSignal.timeout(timeoutMs),
		});
		if (!response.ok) {
			cache = { value: null, expiresAt: now + FAILURE_CACHE_MS };
			return null;
		}
		const data: unknown = await response.json();
		const version = parseNpmLatestVersion(data);
		cache = {
			value: version,
			expiresAt: now + (version ? SUCCESS_CACHE_MS : FAILURE_CACHE_MS),
		};
		return version;
	} catch {
		cache = { value: null, expiresAt: now + FAILURE_CACHE_MS };
		return null;
	}
}
