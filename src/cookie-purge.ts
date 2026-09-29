// SPDX-License-Identifier: MIT

/**
 * First-party cookie names EmPrivacy may expire when a category is off.
 * The list is fixed in this module. Admin settings cannot add names.
 * HttpOnly cookies and cookies on other sites cannot be cleared from page script.
 */

const COOKIE_NAME = /^[A-Za-z0-9_]{1,64}$/;
const CONSENT_COOKIE = "emprivacy_cc";
const MAX_COOKIE_HEADER = 8192;

export const ANALYTICS_COOKIE_EXACT = ["_ga", "_gid", "_gat"] as const;
export const ANALYTICS_COOKIE_PREFIX = ["_ga_", "_gat_"] as const;

export const MARKETING_COOKIE_EXACT = [
	"_gcl_au",
	"_gcl_aw",
	"_gcl_dc",
	"_clck",
	"_clsk",
	"CLID",
	"_uetsid",
	"_uetvid",
] as const;
export const MARKETING_COOKIE_PREFIX = ["_gcl_"] as const;

export const PURGE_RULES = {
	analytics: { exact: [...ANALYTICS_COOKIE_EXACT], prefix: [...ANALYTICS_COOKIE_PREFIX] },
	marketing: { exact: [...MARKETING_COOKIE_EXACT], prefix: [...MARKETING_COOKIE_PREFIX] },
} as const;

export function cookiesToExpire(
	cookieHeader: string,
	denied: { analytics: boolean; marketing: boolean },
): string[] {
	const exact = new Set<string>();
	const prefixes: string[] = [];
	if (denied.analytics) {
		for (const name of ANALYTICS_COOKIE_EXACT) exact.add(name);
		prefixes.push(...ANALYTICS_COOKIE_PREFIX);
	}
	if (denied.marketing) {
		for (const name of MARKETING_COOKIE_EXACT) exact.add(name);
		prefixes.push(...MARKETING_COOKIE_PREFIX);
	}
	const raw = cookieHeader.length > MAX_COOKIE_HEADER ? cookieHeader.slice(0, MAX_COOKIE_HEADER) : cookieHeader;
	const out: string[] = [];
	for (const part of raw.split(";")) {
		const name = (part.split("=")[0] ?? "").trim();
		if (!COOKIE_NAME.test(name) || name === CONSENT_COOKIE) continue;
		const hit = exact.has(name) || prefixes.some((prefix) => prefix.length > 0 && name.startsWith(prefix));
		if (hit && !out.includes(name)) out.push(name);
	}
	return out;
}
