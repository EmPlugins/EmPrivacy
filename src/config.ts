// SPDX-License-Identifier: MIT

/**
 * EmPrivacy KV document (`consent:config`) and shared helpers.
 */

import { chromeForLocale, type EmprivacyChromeStrings, type LocaleOverrides, parseLocaleOverrides, parseLocaleOverridesText, resolveBannerCopy } from "./i18n.js";
import { isFathomId, isGa4Id, isGtmId, isHostname, isUmamiId } from "./ids.js";
import {
	DEFAULT_COOKIE_MAX_AGE_DAYS,
	isSafeHttpsScriptUrl,
	isScriptHostAllowed,
	isValidIntegrity,
	normalizeCookieMaxAgeDays,
	parseCookieMaxAgeDays,
	parseHostnameAllowlist,
	parseScriptUrlWithIntegrity,
} from "./security.js";
import { DEFAULT_THEME, type EmprivacyTheme, normalizeHexColor, normalizeRadiusPx, parseRadiusInput } from "./theme.js";

export const KV_KEY = "consent:config" as const;
export const COOKIE_NAME = "emprivacy_cc" as const;
export const PLUGIN_ID = "emprivacy" as const;

export type AnalyticsProvider =
	| "cloudflare"
	| "none"
	| "custom"
	| "plausible"
	| "fathom"
	| "umami"
	| "simpleanalytics"
	| "ga4"
	| "gtm";

export type EmbedCategory = "functional" | "marketing";

export interface EmprivacyConfig {
	bannerTitle: string;
	bannerMessage: string;
	/**
	 * Privacy policy location: full `https://…` URL **or** a root-relative path to an EmDash **Page**
	 * (e.g. `/privacy`) resolved with `ctx.url()` on the server.
	 */
	privacyPolicyUrl: string;
	/** Optional cookie policy: same rules as `privacyPolicyUrl` (https URL or path like `/cookies`) */
	cookiePolicyUrl: string;
	/** When true, analytics/marketing/functional require explicit opt-in in the UI */
	strictDefaults: boolean;
	/** Bump to invalidate client consent cookies and re-show the banner */
	policyVersion: string;
	/**
	 * Analytics when `cloudflare` — **site token** from Cloudflare → Web Analytics (injected with `data-cf-beacon`).
	 * Public in the same way as a normal site embed. Empty means no Cloudflare script until a token is saved.
	 */
	cloudflareWebAnalyticsToken: string;
	analyticsProvider: AnalyticsProvider;
	/** Provider-specific id (domain, site id, G-…, GTM-…). */
	analyticsId: string;
	/** Required when `analyticsProvider` is `umami` — https script src only. */
	umamiScriptUrl: string;
	/** When `analyticsProvider` is `custom`, these https script URLs load after analytics consent. */
	analyticsScriptUrls: string[];
	/** Third-party script URLs loaded only after marketing consent (https only) */
	marketingScriptUrls: string[];
	/** Optional SRI hashes keyed by script src (sha256/384/512-…) */
	scriptIntegrity: Record<string, string>;
	/**
	 * When non-empty, Custom analytics and marketing script hosts must be on this list.
	 * Preset CDN hosts remain allowed for built-in providers.
	 */
	scriptHostAllowlist: string[];
	/** Consent cookie Max-Age in days (1–365, default 180) */
	cookieMaxAgeDays: number;
	/** Emit Google Consent Mode v2 defaults (denied) in head; updates after choice */
	googleConsentMode: boolean;
	/** POST consent snapshots to the plugin record route and optional storage */
	logConsentToServer: boolean;
	/** Category that official embed placeholders require */
	embedCategory: EmbedCategory;
	/** When true, EmPrivacy Portable Text components gate official embed blocks */
	gateEmbeds: boolean;
	/** Hide the first-visit banner on privacy/cookie policy paths */
	hideBannerOnPolicyPages: boolean;
	defaultLocale: string;
	localeOverrides: LocaleOverrides;
	theme: EmprivacyTheme;
}

export const DEFAULT_CONFIG: EmprivacyConfig = {
	bannerTitle: "Cookies & privacy",
	bannerMessage:
		"We use cookies to run this site and optionally for functional embeds, analytics, and marketing. You can accept or customize your choices.",
	privacyPolicyUrl: "/privacy",
	cookiePolicyUrl: "",
	strictDefaults: true,
	policyVersion: "1",
	cloudflareWebAnalyticsToken: "",
	analyticsProvider: "cloudflare",
	analyticsId: "",
	umamiScriptUrl: "",
	analyticsScriptUrls: [],
	marketingScriptUrls: [],
	scriptIntegrity: {},
	scriptHostAllowlist: [],
	cookieMaxAgeDays: DEFAULT_COOKIE_MAX_AGE_DAYS,
	googleConsentMode: false,
	logConsentToServer: false,
	embedCategory: "marketing",
	gateEmbeds: true,
	hideBannerOnPolicyPages: true,
	defaultLocale: "en",
	localeOverrides: {},
	theme: { ...DEFAULT_THEME },
};

const ANALYTICS_PROVIDERS: readonly AnalyticsProvider[] = [
	"cloudflare",
	"none",
	"custom",
	"plausible",
	"fathom",
	"umami",
	"simpleanalytics",
	"ga4",
	"gtm",
];

function hasUnsafeUrlChars(s: string): boolean {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}

function isHttpsUrl(s: string): boolean {
	try {
		const t = s.trim();
		if (!t) return false;
		if (hasUnsafeUrlChars(t)) return false;
		if (/%0d|%0a|%09|%0b|%0c|%20/i.test(t)) return false;
		const u = new URL(t);
		if (u.protocol !== "https:") return false;
		if (u.username || u.password) return false;
		return true;
	} catch {
		return false;
	}
}

function invalidScriptUrlError(kind: "analytics" | "marketing" | "umami", u: string): string {
	if (u.includes("<") || u.includes(">")) {
		return `Invalid ${kind} script URL (https only). Paste one full https:// URL per line (the script src only), not a <script> tag or HTML comment. The invalid line was: ${u}`;
	}
	return `Invalid ${kind} script URL (https only): ${u}`;
}

function isAnalyticsProvider(s: string): s is AnalyticsProvider {
	return (ANALYTICS_PROVIDERS as readonly string[]).includes(s);
}

function isEmbedCategory(s: string): s is EmbedCategory {
	return s === "functional" || s === "marketing";
}

/** Reject characters that would break JSON or attributes; allow typical Cloudflare site token strings. */
export function assertValidCloudflareToken(t: string): void {
	const s = t.trim();
	if (s.length === 0) return;
	if (s.length > 256) throw new Error("Cloudflare site token is too long.");
	if (/[\s<>'"&]/.test(s)) {
		throw new Error("Cloudflare site token contains invalid characters.");
	}
}

/**
 * Root-relative public path (EmDash page route), e.g. `/privacy`.
 * Rejects protocol-relative URLs (`//…`) and whitespace.
 */
export function isRootRelativeSitePath(s: string): boolean {
	const t = s.trim();
	if (t.length === 0) return false;
	if (!t.startsWith("/")) return false;
	if (t.startsWith("//")) return false;
	if (hasUnsafeUrlChars(t)) return false;
	return true;
}

/** For hooks: turn stored path or absolute URL into a public absolute URL. */
export function resolvePolicyHref(
	stored: string,
	ctx: { url: (path: string) => string },
): string {
	const t = stored.trim();
	if (!t) return t;
	if (isRootRelativeSitePath(t)) return ctx.url(t);
	return t;
}

export function isValidPolicyHrefInput(s: string): boolean {
	const t = s.trim();
	if (!t) return false;
	return isHttpsUrl(t) || isRootRelativeSitePath(t);
}

export function parseUrlList(text: string): string[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
	return [...new Set(lines)];
}

function assertLength(label: string, s: string, min: number, max: number): void {
	const t = s.trim();
	if (t.length < min) throw new Error(`${label} is required.`);
	if (t.length > max) throw new Error(`${label} is too long.`);
}

function assertOptionalLength(label: string, s: string, max: number): void {
	const t = s.trim();
	if (t.length > max) throw new Error(`${label} is too long.`);
}

function pathnameFromHref(href: string): string | null {
	const t = href.trim();
	if (!t) return null;
	if (isRootRelativeSitePath(t)) {
		return t.split(/[?#]/)[0] ?? t;
	}
	try {
		const u = new URL(t);
		return u.pathname.replace(/\/+$/, "") || "/";
	} catch {
		return null;
	}
}

/** True when the public page is the configured privacy or cookie policy. */
export function isPolicyPagePath(pagePath: string, cfg: Pick<EmprivacyConfig, "privacyPolicyUrl" | "cookiePolicyUrl">): boolean {
	const raw = pagePath.trim();
	if (!raw) return false;
	const current = raw.split(/[?#]/)[0]?.replace(/\/+$/, "") || "/";
	for (const stored of [cfg.privacyPolicyUrl, cfg.cookiePolicyUrl]) {
		const pn = pathnameFromHref(stored);
		if (!pn) continue;
		if (current === pn) return true;
		if (current.endsWith(pn) && pn !== "/") return true;
	}
	return false;
}

export function normalizeConfig(raw: unknown): EmprivacyConfig {
	if (typeof raw !== "object" || raw === null) return { ...DEFAULT_CONFIG, theme: { ...DEFAULT_THEME } };
	const o = raw as Record<string, unknown>;
	const analytics = Array.isArray(o.analyticsScriptUrls)
		? o.analyticsScriptUrls.filter((x): x is string => typeof x === "string")
		: DEFAULT_CONFIG.analyticsScriptUrls;
	const marketing = Array.isArray(o.marketingScriptUrls)
		? o.marketingScriptUrls.filter((x): x is string => typeof x === "string")
		: DEFAULT_CONFIG.marketingScriptUrls;

	const cfTok =
		typeof o.cloudflareWebAnalyticsToken === "string" ? o.cloudflareWebAnalyticsToken : "";
	const apCandidate = typeof o.analyticsProvider === "string" ? o.analyticsProvider.trim() : "";
	let analyticsProvider: AnalyticsProvider;
	if (isAnalyticsProvider(apCandidate)) {
		analyticsProvider = apCandidate;
	} else if (analytics.length > 0) {
		analyticsProvider = "custom";
	} else {
		analyticsProvider = DEFAULT_CONFIG.analyticsProvider;
	}

	const themeRaw = o.theme && typeof o.theme === "object" ? (o.theme as Record<string, unknown>) : {};
	const embedRaw = typeof o.embedCategory === "string" ? o.embedCategory.trim() : "";
	const integrityRaw =
		o.scriptIntegrity && typeof o.scriptIntegrity === "object" && !Array.isArray(o.scriptIntegrity)
			? (o.scriptIntegrity as Record<string, unknown>)
			: {};
	const scriptIntegrity: Record<string, string> = {};
	for (const [k, v] of Object.entries(integrityRaw)) {
		if (typeof k === "string" && typeof v === "string" && isValidIntegrity(v) && isSafeHttpsScriptUrl(k)) {
			scriptIntegrity[k] = v;
		}
		if (Object.keys(scriptIntegrity).length >= 100) break;
	}
	const allowRaw = Array.isArray(o.scriptHostAllowlist)
		? o.scriptHostAllowlist.filter((x): x is string => typeof x === "string")
		: [];
	const scriptHostAllowlist = allowRaw
		.map((h) => h.trim().toLowerCase())
		.filter((h) => isHostname(h))
		.slice(0, 50);

	return {
		bannerTitle: typeof o.bannerTitle === "string" ? o.bannerTitle : DEFAULT_CONFIG.bannerTitle,
		bannerMessage:
			typeof o.bannerMessage === "string" ? o.bannerMessage : DEFAULT_CONFIG.bannerMessage,
		privacyPolicyUrl:
			typeof o.privacyPolicyUrl === "string" ? o.privacyPolicyUrl : DEFAULT_CONFIG.privacyPolicyUrl,
		cookiePolicyUrl:
			typeof o.cookiePolicyUrl === "string" ? o.cookiePolicyUrl : DEFAULT_CONFIG.cookiePolicyUrl,
		strictDefaults:
			typeof o.strictDefaults === "boolean" ? o.strictDefaults : DEFAULT_CONFIG.strictDefaults,
		policyVersion:
			typeof o.policyVersion === "string" && o.policyVersion.length > 0
				? o.policyVersion
				: DEFAULT_CONFIG.policyVersion,
		cloudflareWebAnalyticsToken: cfTok,
		analyticsProvider,
		analyticsId: typeof o.analyticsId === "string" ? o.analyticsId : "",
		umamiScriptUrl: typeof o.umamiScriptUrl === "string" ? o.umamiScriptUrl : "",
		analyticsScriptUrls: analytics,
		marketingScriptUrls: marketing,
		scriptIntegrity,
		scriptHostAllowlist,
		cookieMaxAgeDays: normalizeCookieMaxAgeDays(o.cookieMaxAgeDays, DEFAULT_CONFIG.cookieMaxAgeDays),
		googleConsentMode:
			typeof o.googleConsentMode === "boolean" ? o.googleConsentMode : DEFAULT_CONFIG.googleConsentMode,
		logConsentToServer:
			typeof o.logConsentToServer === "boolean"
				? o.logConsentToServer
				: DEFAULT_CONFIG.logConsentToServer,
		embedCategory: isEmbedCategory(embedRaw) ? embedRaw : DEFAULT_CONFIG.embedCategory,
		gateEmbeds: typeof o.gateEmbeds === "boolean" ? o.gateEmbeds : DEFAULT_CONFIG.gateEmbeds,
		hideBannerOnPolicyPages:
			typeof o.hideBannerOnPolicyPages === "boolean"
				? o.hideBannerOnPolicyPages
				: DEFAULT_CONFIG.hideBannerOnPolicyPages,
		defaultLocale: typeof o.defaultLocale === "string" && o.defaultLocale ? o.defaultLocale : DEFAULT_CONFIG.defaultLocale,
		localeOverrides: parseLocaleOverrides(o.localeOverrides),
		theme: {
			bg: normalizeHexColor(typeof themeRaw.bg === "string" ? themeRaw.bg : "", DEFAULT_THEME.bg),
			text: normalizeHexColor(typeof themeRaw.text === "string" ? themeRaw.text : "", DEFAULT_THEME.text),
			accent: normalizeHexColor(
				typeof themeRaw.accent === "string" ? themeRaw.accent : "",
				DEFAULT_THEME.accent,
			),
			radiusPx: normalizeRadiusPx(themeRaw.radiusPx, DEFAULT_THEME.radiusPx),
		},
	};
}

function assertAnalyticsId(provider: AnalyticsProvider, id: string, umamiScriptUrl: string): void {
	const t = id.trim();
	if (provider === "plausible") {
		if (!isHostname(t)) throw new Error("Plausible domain must be a hostname like example.com (no https://).");
		return;
	}
	if (provider === "fathom") {
		if (!isFathomId(t)) throw new Error("Fathom site ID must be 4–32 letters or digits.");
		return;
	}
	if (provider === "umami") {
		if (!isUmamiId(t)) throw new Error("Umami website ID looks invalid.");
		if (!isHttpsUrl(umamiScriptUrl)) {
			throw new Error("Umami requires the https script URL (Cloud or your self-hosted tracker).");
		}
		return;
	}
	if (provider === "ga4") {
		if (!isGa4Id(t)) throw new Error("GA4 measurement ID must look like G-XXXXXXXX.");
		return;
	}
	if (provider === "gtm") {
		if (!isGtmId(t)) throw new Error("Google Tag Manager ID must look like GTM-XXXX.");
		return;
	}
	if (provider === "simpleanalytics" && t && !isHostname(t)) {
		throw new Error("Simple Analytics hostname must be a domain like example.com, or empty.");
	}
}

/** Validate admin-submitted fields; throws an Error with a short message on failure */
export function assertValidSavedConfig(input: {
	bannerTitle: string;
	bannerMessage: string;
	privacyPolicyUrl: string;
	cookiePolicyUrl: string;
	strictDefaults: boolean;
	policyVersion: string;
	analyticsPlatform: string;
	cloudflareToken: string;
	analyticsId: string;
	umamiScriptUrl: string;
	analyticsUrlsText: string;
	marketingUrlsText: string;
	scriptHostAllowlistText: string;
	cookieMaxAgeDays: string;
	googleConsentMode: boolean;
	logConsentToServer: boolean;
	embedCategory: string;
	gateEmbeds: boolean;
	hideBannerOnPolicyPages: boolean;
	defaultLocale: string;
	localeOverridesText: string;
	themeBg: string;
	themeText: string;
	themeAccent: string;
	themeRadius: string;
}): EmprivacyConfig {
	assertLength("Policy version", input.policyVersion, 1, 64);
	assertOptionalLength("Banner title", input.bannerTitle, 120);
	assertOptionalLength("Short notice", input.bannerMessage, 600);

	const privacyPolicyUrl = input.privacyPolicyUrl.trim();
	if (!isValidPolicyHrefInput(privacyPolicyUrl)) {
		throw new Error(
			"Privacy policy must be a full https:// URL or a site path to your EmDash Page (e.g. /privacy).",
		);
	}
	if (privacyPolicyUrl.length > 2048) throw new Error("Privacy policy URL/path is too long.");

	let cookiePolicyUrl = input.cookiePolicyUrl.trim();
	if (cookiePolicyUrl && !isValidPolicyHrefInput(cookiePolicyUrl)) {
		throw new Error(
			"Cookie policy must be a valid https:// URL or a root-relative path (e.g. /cookies), or empty.",
		);
	}
	if (cookiePolicyUrl.length > 2048) throw new Error("Cookie policy URL/path is too long.");
	if (!cookiePolicyUrl) cookiePolicyUrl = DEFAULT_CONFIG.cookiePolicyUrl;

	const ap = input.analyticsPlatform.trim() || "cloudflare";
	if (!isAnalyticsProvider(ap)) {
		throw new Error("Analytics: choose a supported platform.");
	}
	const tokenTrim = input.cloudflareToken.trim();
	if (ap === "cloudflare") {
		assertValidCloudflareToken(tokenTrim);
	}

	const umamiScriptUrl = input.umamiScriptUrl.trim();
	if (ap === "umami" && umamiScriptUrl && !isHttpsUrl(umamiScriptUrl)) {
		throw new Error(invalidScriptUrlError("umami", umamiScriptUrl));
	}
	if (ap !== "none" && ap !== "custom" && ap !== "cloudflare" && ap !== "simpleanalytics" && ap !== "gtm") {
		assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	} else if (ap === "simpleanalytics" && input.analyticsId.trim()) {
		assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	} else if (ap === "gtm") {
		assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	}

	const scriptHostAllowlist = parseHostnameAllowlist(input.scriptHostAllowlistText);
	const cookieMaxAgeDays = parseCookieMaxAgeDays(input.cookieMaxAgeDays, DEFAULT_COOKIE_MAX_AGE_DAYS);
	const scriptIntegrity: Record<string, string> = {};

	const assertScriptLine = (kind: "analytics" | "marketing", line: string): string => {
		const { src, integrity } = parseScriptUrlWithIntegrity(line);
		if (!src || src.length > 2048) throw new Error(invalidScriptUrlError(kind, line));
		if (!isSafeHttpsScriptUrl(src)) throw new Error(invalidScriptUrlError(kind, src));
		if (integrity && !isValidIntegrity(integrity)) {
			throw new Error(`Invalid SRI for ${kind} script (expected sha256-|sha384-|sha512-…).`);
		}
		if (
			!isScriptHostAllowed(src, {
				allowlist: scriptHostAllowlist,
				allowPresets: false,
			})
		) {
			throw new Error(
				`${kind} script host is not on the allowlist. Add the hostname or clear the allowlist.`,
			);
		}
		if (integrity) scriptIntegrity[src] = integrity;
		return src;
	};

	if (ap === "umami" && umamiScriptUrl) {
		if (
			!isScriptHostAllowed(umamiScriptUrl, {
				allowlist: scriptHostAllowlist,
				allowPresets: false,
			})
		) {
			throw new Error(
				"Umami script host is not on the allowlist. Add the hostname or clear the allowlist.",
			);
		}
	}

	const analyticsScriptUrls: string[] = [];
	if (ap === "custom") {
		const list = parseUrlList(input.analyticsUrlsText);
		if (list.length > 50) throw new Error("Analytics script URL list is too long (max 50).");
		for (const u of list) {
			analyticsScriptUrls.push(assertScriptLine("analytics", u));
		}
	}
	const marketingScriptUrls: string[] = [];
	const mlist = parseUrlList(input.marketingUrlsText);
	if (mlist.length > 50) throw new Error("Marketing script URL list is too long (max 50).");
	for (const u of mlist) {
		marketingScriptUrls.push(assertScriptLine("marketing", u));
	}

	const embedCategory = input.embedCategory.trim() || "marketing";
	if (!isEmbedCategory(embedCategory)) {
		throw new Error("Embeds must require Functional or Marketing consent.");
	}

	const defaultLocale = input.defaultLocale.trim().toLowerCase() || "en";
	if (!/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(defaultLocale)) {
		throw new Error("Default locale must look like en or pt-BR.");
	}

	const localeOverrides = parseLocaleOverridesText(input.localeOverridesText);
	for (const pack of Object.values(localeOverrides)) {
		if (pack.bannerTitle !== undefined) assertOptionalLength("Translated banner title", pack.bannerTitle, 120);
		if (pack.bannerMessage !== undefined) assertOptionalLength("Translated short notice", pack.bannerMessage, 600);
	}

	const themeBg = input.themeBg.trim() || DEFAULT_THEME.bg;
	const themeText = input.themeText.trim() || DEFAULT_THEME.text;
	const themeAccent = input.themeAccent.trim() || DEFAULT_THEME.accent;
	if (input.themeBg.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeBg)) {
		throw new Error("Banner background must be a hex color like #111111.");
	}
	if (input.themeText.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeText)) {
		throw new Error("Banner text color must be a hex color like #eeeeee.");
	}
	if (input.themeAccent.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeAccent)) {
		throw new Error("Banner accent color must be a hex color like #3b82f6.");
	}

	return normalizeConfig({
		bannerTitle: input.bannerTitle.trim() || DEFAULT_CONFIG.bannerTitle,
		bannerMessage: input.bannerMessage.trim() || DEFAULT_CONFIG.bannerMessage,
		privacyPolicyUrl,
		cookiePolicyUrl,
		strictDefaults: input.strictDefaults,
		policyVersion: input.policyVersion.trim(),
		analyticsProvider: ap,
		cloudflareWebAnalyticsToken: ap === "cloudflare" ? tokenTrim : "",
		analyticsId:
			ap === "cloudflare" || ap === "custom" || ap === "none" ? "" : input.analyticsId.trim(),
		umamiScriptUrl: ap === "umami" ? umamiScriptUrl : "",
		analyticsScriptUrls: ap === "custom" ? analyticsScriptUrls : [],
		marketingScriptUrls,
		scriptIntegrity,
		scriptHostAllowlist,
		cookieMaxAgeDays,
		googleConsentMode: input.googleConsentMode,
		logConsentToServer: input.logConsentToServer,
		embedCategory,
		gateEmbeds: input.gateEmbeds,
		hideBannerOnPolicyPages: input.hideBannerOnPolicyPages,
		defaultLocale,
		localeOverrides,
		theme: {
			bg: themeBg,
			text: themeText,
			accent: themeAccent,
			radiusPx: parseRadiusInput(input.themeRadius, DEFAULT_THEME.radiusPx),
		},
	});
}

export interface ConsentRecordPayload {
	createdAt: string;
	policyVersion: string;
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

/** Safe to embed in `<script type="application/json">` (breakout-safe) */
export function jsonForHtmlScript(value: unknown): string {
	return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => {
		switch (c) {
			case "<":
				return "\\u003c";
			case ">":
				return "\\u003e";
			case "&":
				return "\\u0026";
			case "\u2028":
				return "\\u2028";
			case "\u2029":
				return "\\u2029";
			default:
				return c;
		}
	});
}

export interface ConsentState {
	v: string;
	essential: true;
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

export interface VendorPublicRow {
	id: string;
	name: string;
	category: "essential" | "functional" | "analytics" | "marketing";
	purpose: string;
	policyUrl?: string;
}

export interface EmprivacyPublicRuntimeConfig {
	bannerTitle: string;
	bannerMessage: string;
	privacyPolicyUrl: string;
	cookiePolicyUrl: string;
	strictDefaults: boolean;
	policyVersion: string;
	googleConsentMode: boolean;
	logConsent: boolean;
	recordPath: string;
	embedCategory: EmbedCategory;
	gateEmbeds: boolean;
	hideBanner: boolean;
	theme: EmprivacyTheme;
	ui: EmprivacyChromeStrings;
	loader: import("./vendors.js").AnalyticsLoader;
	marketingScripts: { src: string; integrity: string | null }[];
	scriptHostAllowlist: string[];
	scriptIntegrity: Record<string, string>;
	cookieMaxAge: number;
	vendors: VendorPublicRow[];
}

export function resolvePublicCopy(
	cfg: EmprivacyConfig,
	locale: string | null | undefined,
): { bannerTitle: string; bannerMessage: string; ui: EmprivacyChromeStrings } {
	const copy = resolveBannerCopy(
		{ bannerTitle: cfg.bannerTitle, bannerMessage: cfg.bannerMessage },
		cfg.localeOverrides,
		locale ?? cfg.defaultLocale,
	);
	return {
		bannerTitle: copy.bannerTitle,
		bannerMessage: copy.bannerMessage,
		ui: chromeForLocale(locale ?? cfg.defaultLocale),
	};
}
