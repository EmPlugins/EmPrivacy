// SPDX-License-Identifier: MIT

/**
 * Shared URL / request guards used by admin validation and (via mirrored
 * logic) the public bootstrap. Keep client checks in sync with these helpers.
 */

export const YT_IFRAME = /^https:\/\/(?:www\.)?youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\/?$/;
export const VIMEO_IFRAME = /^https:\/\/player\.vimeo\.com\/video\/\d{6,12}\/?$/;

/** Sandbox and feature policy for YouTube/Vimeo iframes. Kept beside the src regexes. */
export const EMBED_IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-presentation";
export const EMBED_IFRAME_ALLOW =
	"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share";

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
	"www.clarity.ms",
	"clarity.ms",
	"bat.bing.com",
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

/**
 * Browser copy of the non-public host check. `parseStrictHttpsUrl` calls the
 * same source so the inline bootstrap cannot drift from the server.
 * Hostnames are whatever `new URL` already normalized (decimal, hex, and
 * short IPv4 forms become dotted quads; IPv6 keeps brackets).
 */
export function hostnameBlockScript(): string {
	return `function hostBlocked(raw){
var host=String(raw||"").trim().toLowerCase().replace(/^\\[|\\]$/g,"");
if(!host)return true;
if(host==="localhost"||endsWith(host,".localhost")||endsWith(host,".local")||endsWith(host,".internal")||endsWith(host,".arpa"))return true;
if(host.indexOf(":")>=0)return ipv6Blocked(host);
if(/^[0-9.]+$/.test(host)){
var v4=parseV4(host);
if(v4===null)return true;
return v4Blocked(v4);
}
return false;
}
function endsWith(h,s){return h.length>=s.length&&h.slice(h.length-s.length)===s;}
function parseV4(host){
var p=host.split(".");
if(p.length!==4)return null;
var n=0;
for(var i=0;i<p.length;i++){
var part=p[i];
if(!/^\\d{1,3}$/.test(part))return null;
if(part.length>1&&part.charAt(0)==="0")return null;
var v=+part;
if(v>255)return null;
n=n*256+v;
}
return n>>>0;
}
function v4Blocked(n){
var a=n>>>24;
var b=(n>>>16)&255;
if(a===0||a===10||a===127)return true;
if(a===100&&b>=64&&b<=127)return true;
if(a===169&&b===254)return true;
if(a===172&&b>=16&&b<=31)return true;
if(a===192&&b===168)return true;
if(a>=224)return true;
return false;
}
function ipv6Blocked(host){
if(host==="::"||host==="::1")return true;
var dotted=/^::ffff:(\\d{1,3}(?:\\.\\d{1,3}){3})$/.exec(host);
if(dotted){
var d4=parseV4(dotted[1]);
return d4===null||v4Blocked(d4);
}
var mapped=/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(host);
if(mapped){
var hi=parseInt(mapped[1],16);
var lo=parseInt(mapped[2],16);
if(hi>65535||lo>65535)return true;
return v4Blocked(((hi<<16)|lo)>>>0);
}
if(/\\d{1,3}(?:\\.\\d{1,3}){3}$/.test(host))return true;
var first;
if(host.slice(0,2)==="::")first=0;
else{
var head=host.split(":")[0];
if(!/^[0-9a-f]{1,4}$/.test(head))return true;
first=parseInt(head,16);
}
if((first&0xfe00)===0xfc00)return true;
if((first&0xffc0)===0xfe80)return true;
if((first&0xffc0)===0xfec0)return true;
if((first&0xff00)===0xff00)return true;
return false;
}`;
}

const hostBlockedImpl = new Function(`${hostnameBlockScript()}\nreturn hostBlocked;`)() as (
	raw: string,
) => boolean;

/** True for loopback, private, link-local, shared (CGNAT), and non-global addresses. */
export function isBlockedHostname(hostname: string): boolean {
	return hostBlockedImpl(hostname);
}

export function parseStrictHttpsUrl(raw: string): URL | null {
	const t = raw.trim();
	if (!t || t.length > 2048 || hasUnsafeUrlChars(t)) return null;
	if (/%0d|%0a|%09|%0b|%0c|%20/i.test(t)) return null;
	try {
		const u = new URL(t);
		if (u.protocol !== "https:") return null;
		if (u.username || u.password) return null;
		if (isBlockedHostname(u.hostname)) return null;
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
 * Client hydration for link-mode embeds.
 * X, Bluesky, and Gist keep their built-in host and path checks.
 * Every other host, including Mastodon and link previews, must be on
 * `embedHostAllowlist`. The DOM `kind` attribute is not permission.
 */
export function isAllowedHydratedEmbedLink(raw: string, embedHostAllowlist: readonly string[] = []): boolean {
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
	return embedHostAllowlist.includes(host);
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
	return opts.allowlist.includes(host);
}

/** SRI required before a custom or marketing script may load. Empty is not valid. */
export function hasSri(s: string | null | undefined): s is string {
	return typeof s === "string" && /^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(s);
}

export function isPublishableCustomScript(
	src: string,
	integrity: string | null | undefined,
	allowlist: readonly string[],
): boolean {
	return hasSri(integrity) && isScriptHostAllowed(src, { allowlist: [...allowlist], allowPresets: false });
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

export interface RateLimitKv {
	getVersioned<T>(key: string): Promise<{ value: T; revision: string } | null>;
	compareAndSet(
		key: string,
		expectedRevision: string | null,
		value: unknown,
	): Promise<{ applied: boolean }>;
}

/**
 * Compare-and-set increment. Returns false when the bucket is full, the store
 * errors, or eight conflicts in a row fail to land a write.
 */
export async function tryConsumeRateSlot(kv: RateLimitKv, key: string, limit: number): Promise<boolean> {
	for (let attempt = 0; attempt < 8; attempt++) {
		let current: { value: unknown; revision: string } | null;
		try {
			current = await kv.getVersioned<unknown>(key);
		} catch {
			return false;
		}
		const raw = current?.value;
		const n = typeof raw === "string" && /^\d{1,6}$/.test(raw) ? Number(raw) : 0;
		if (n >= limit) return false;
		try {
			const result = await kv.compareAndSet(key, current ? current.revision : null, String(n + 1));
			if (result.applied) return true;
		} catch {
			return false;
		}
	}
	return false;
}

/** Coarse hour bucket for rate limiting (UTC). */
export function rateHourKey(now = new Date()): string {
	const y = now.getUTCFullYear();
	const m = String(now.getUTCMonth() + 1).padStart(2, "0");
	const d = String(now.getUTCDate()).padStart(2, "0");
	const h = String(now.getUTCHours()).padStart(2, "0");
	return `${y}${m}${d}${h}`;
}
