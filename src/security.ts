// SPDX-License-Identifier: MIT

/**
 * Shared URL / request guards used by admin validation and (via mirrored
 * logic) the public bootstrap. Keep client checks in sync with these helpers.
 */

const YT_IFRAME = /^https:\/\/(?:www\.)?youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\/?$/;
const VIMEO_IFRAME = /^https:\/\/player\.vimeo\.com\/video\/\d{6,12}\/?$/;

const LINK_HOSTS = new Set([
	"x.com",
	"www.x.com",
	"twitter.com",
	"www.twitter.com",
	"mobile.twitter.com",
	"bsky.app",
	"www.bsky.app",
	"gist.github.com",
]);

/** Hosts EmPrivacy may load as <script src> for built-in presets. */
export const PRESET_SCRIPT_HOSTS = new Set([
	"static.cloudflareinsights.com",
	"plausible.io",
	"cdn.usefathom.com",
	"scripts.simpleanalyticscdn.com",
	"www.googletagmanager.com",
	"googletagmanager.com",
]);

const HOSTNAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

export const DEFAULT_COOKIE_MAX_AGE_DAYS = 180;
export const MIN_COOKIE_MAX_AGE_DAYS = 1;
export const MAX_COOKIE_MAX_AGE_DAYS = 365;

export function normalizeCookieMaxAgeDays(n: unknown, fallback = DEFAULT_COOKIE_MAX_AGE_DAYS): number {
	if (typeof n !== "number" || !Number.isFinite(n) || n < MIN_COOKIE_MAX_AGE_DAYS) return fallback;
	return Math.min(MAX_COOKIE_MAX_AGE_DAYS, Math.max(MIN_COOKIE_MAX_AGE_DAYS, Math.round(n)));
}

export function parseCookieMaxAgeDays(s: string, fallback = DEFAULT_COOKIE_MAX_AGE_DAYS): number {
	const t = s.trim();
	if (!t) return fallback;
	if (!/^\d{1,3}$/.test(t)) {
		throw new Error(`Consent cookie lifetime must be ${MIN_COOKIE_MAX_AGE_DAYS}–${MAX_COOKIE_MAX_AGE_DAYS} days.`);
	}
	const n = Number(t);
	if (n < MIN_COOKIE_MAX_AGE_DAYS || n > MAX_COOKIE_MAX_AGE_DAYS) {
		throw new Error(`Consent cookie lifetime must be ${MIN_COOKIE_MAX_AGE_DAYS}–${MAX_COOKIE_MAX_AGE_DAYS} days.`);
	}
	return n;
}

export function cookieMaxAgeSeconds(days: number): number {
	return normalizeCookieMaxAgeDays(days) * 24 * 60 * 60;
}

function hasUnsafeUrlChars(s: string): boolean {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}

export function parseStrictHttpsUrl(raw: string): URL | null {
	const t = raw.trim();
	if (!t || t.length > 2048 || hasUnsafeUrlChars(t)) return null;
	if (/%0d|%0a|%09|%0b|%0c|%20/i.test(t)) return null;
	try {
		const u = new URL(t);
		if (u.protocol !== "https:") return null;
		if (u.username || u.password) return null;
		const host = u.hostname.toLowerCase();
		if (host === "localhost" || host.endsWith(".localhost")) return null;
		if (host === "127.0.0.1" || host === "::1" || host.endsWith(".local")) return null;
		return u;
	} catch {
		return null;
	}
}

export function isHostname(s: string): boolean {
	const t = s.trim().toLowerCase();
	if (!t || t.length > 253) return false;
	if (t === "localhost" || t.endsWith(".localhost")) return false;
	return HOSTNAME.test(t);
}

export function parseHostnameAllowlist(text: string): string[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trim().toLowerCase())
		.filter(Boolean);
	const out: string[] = [];
	for (const line of lines) {
		if (!isHostname(line)) {
			throw new Error(`Invalid script host allowlist entry "${line}". Use hostnames like cdn.example.com.`);
		}
		if (!out.includes(line)) out.push(line);
		if (out.length > 50) throw new Error("Script host allowlist is too long (max 50).");
	}
	return out;
}

/** True for YouTube nocookie / Vimeo player iframe URLs EmPrivacy constructs. */
export function isAllowedIframeSrc(raw: string): boolean {
	const t = raw.trim();
	if (!t || t.length > 2048) return false;
	return YT_IFRAME.test(t) || VIMEO_IFRAME.test(t);
}

/**
 * Client hydration for mode=link. Social/Gist/Mastodon path shapes only.
 * For `linkPreview`, pass `kind === "linkPreview"` so any strict https is allowed
 * (server already validated the OG URL when rendering the placeholder).
 */
export function isAllowedHydratedEmbedLink(raw: string, kind?: string): boolean {
	const u = parseStrictHttpsUrl(raw);
	if (!u) return false;
	const host = u.hostname.toLowerCase();
	if (LINK_HOSTS.has(host)) {
		if (host.includes("twitter") || host === "x.com" || host === "www.x.com") {
			return /\/(?:i\/web\/)?status(?:es)?\/\d{5,20}\/?$/i.test(u.pathname);
		}
		if (host.includes("bsky")) {
			return /^\/profile\/[^/]+\/post\/[^/]+\/?$/.test(u.pathname);
		}
		if (host === "gist.github.com") {
			return /^\/[A-Za-z0-9-]{1,39}\/[a-f0-9]{8,64}\/?$/i.test(u.pathname);
		}
	}
	if (/^\/@[^/]+\/\d+\/?$/.test(u.pathname) || /^\/users\/[^/]+\/statuses\/\d+\/?$/.test(u.pathname)) {
		return true;
	}
	return kind === "linkPreview";
}

export function isSafeHttpsScriptUrl(raw: string): boolean {
	const u = parseStrictHttpsUrl(raw);
	if (!u) return false;
	// Prefer .js paths but allow CDN paths without extension (e.g. /gtag/js)
	if (u.hash) return false;
	return true;
}

export function isScriptHostAllowed(
	raw: string,
	opts: { allowlist: string[]; allowPresets: boolean },
): boolean {
	const u = parseStrictHttpsUrl(raw);
	if (!u) return false;
	const host = u.hostname.toLowerCase();
	if (opts.allowPresets && PRESET_SCRIPT_HOSTS.has(host)) return true;
	if (opts.allowlist.length === 0) {
		// No custom allowlist: custom URLs still must be strict https (admin-trusted).
		return true;
	}
	return opts.allowlist.includes(host);
}

/** Optional SRI: `https://cdn.example/a.js sha384-...` or `... integrity=sha384-...`. */
export function parseScriptUrlWithIntegrity(line: string): { src: string; integrity: string | null } {
	const t = line.trim();
	if (!t) return { src: "", integrity: null };
	const integrityEq = /\sintegrity=(sha(?:256|384|512)-[A-Za-z0-9+/=]+)$/i.exec(t);
	if (integrityEq) {
		return { src: t.slice(0, integrityEq.index).trim(), integrity: integrityEq[1] ?? null };
	}
	const spaced = /^(https:\/\/\S+)\s+(sha(?:256|384|512)-[A-Za-z0-9+/=]+)$/i.exec(t);
	if (spaced) {
		return { src: spaced[1] ?? "", integrity: spaced[2] ?? null };
	}
	return { src: t, integrity: null };
}

export function isValidIntegrity(s: string | null | undefined): boolean {
	if (!s) return true;
	return /^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(s);
}

/**
 * Same-origin guard for public state-changing plugin routes.
 * Requires Origin matching the site, or Sec-Fetch-Site: same-origin.
 */
export function assertSameOriginMutation(request: Request, expectedOrigin: string): Response | null {
	const origin = request.headers.get("origin");
	if (origin) {
		if (origin !== expectedOrigin) {
			return new Response("forbidden", { status: 403 });
		}
		return null;
	}
	const site = (request.headers.get("sec-fetch-site") ?? "").toLowerCase();
	if (site === "same-origin") return null;
	// No Origin and no same-origin Sec-Fetch-Site → reject (blocks classic CSRF / curl abuse).
	return new Response("forbidden", { status: 403 });
}

/** Coarse hour bucket for rate limiting (UTC). */
export function rateHourKey(now = new Date()): string {
	const y = now.getUTCFullYear();
	const m = String(now.getUTCMonth() + 1).padStart(2, "0");
	const d = String(now.getUTCDate()).padStart(2, "0");
	const h = String(now.getUTCHours()).padStart(2, "0");
	return `${y}${m}${d}${h}`;
}
