import { definePlugin } from "emdash";
import { z } from "zod";
const LOCALE_KEY = /^[a-z]{2,3}(?:-[A-Za-z]{2})?$/;
const CHROME = {
	en: {
		acceptAll: "Accept all",
		rejectNonEssential: "Reject non-essential",
		customize: "Customize",
		saveChoices: "Save choices",
		close: "Close",
		essential: "Essential",
		functional: "Functional",
		analytics: "Analytics",
		marketing: "Marketing",
		essentialNote: "Always on — needed to run the site and remember this choice.",
		privacyPolicy: "Privacy policy",
		cookiePolicy: "Cookie policy",
		cookieSettings: "Cookie and privacy settings",
		loadEmbed: "Allow embeds and load",
		embedBlocked: "This embed is blocked until you allow the matching cookie category.",
		embedNeedConsent: "To load this embed, allow the matching category in cookie settings.",
		vendorsHeading: "What this site uses",
		whatWeUse: "What we use"
	},
	de: {
		acceptAll: "Alle akzeptieren",
		rejectNonEssential: "Nicht notwendige ablehnen",
		customize: "Anpassen",
		saveChoices: "Auswahl speichern",
		close: "Schließen",
		essential: "Essenziell",
		functional: "Funktional",
		analytics: "Analyse",
		marketing: "Marketing",
		essentialNote: "Immer aktiv — erforderlich für die Website und diese Auswahl.",
		privacyPolicy: "Datenschutzerklärung",
		cookiePolicy: "Cookie-Richtlinie",
		cookieSettings: "Cookie- und Datenschutzeinstellungen",
		loadEmbed: "Einbettungen erlauben und laden",
		embedBlocked: "Diese Einbettung ist gesperrt, bis Sie die passende Kategorie erlauben.",
		embedNeedConsent: "Um diese Einbettung zu laden, erlauben Sie die passende Kategorie in den Cookie-Einstellungen.",
		vendorsHeading: "Was diese Website verwendet",
		whatWeUse: "Was wir verwenden"
	},
	fr: {
		acceptAll: "Tout accepter",
		rejectNonEssential: "Refuser les non essentiels",
		customize: "Personnaliser",
		saveChoices: "Enregistrer",
		close: "Fermer",
		essential: "Essentiels",
		functional: "Fonctionnels",
		analytics: "Mesure d’audience",
		marketing: "Marketing",
		essentialNote: "Toujours actifs — nécessaires au site et à ce choix.",
		privacyPolicy: "Politique de confidentialité",
		cookiePolicy: "Politique cookies",
		cookieSettings: "Paramètres des cookies et de confidentialité",
		loadEmbed: "Autoriser les contenus intégrés",
		embedBlocked: "Ce contenu est bloqué tant que vous n’avez pas autorisé la catégorie correspondante.",
		embedNeedConsent: "Pour charger ce contenu, autorisez la catégorie correspondante dans les paramètres des cookies.",
		vendorsHeading: "Ce que ce site utilise",
		whatWeUse: "Ce que nous utilisons"
	},
	es: {
		acceptAll: "Aceptar todo",
		rejectNonEssential: "Rechazar no esenciales",
		customize: "Personalizar",
		saveChoices: "Guardar",
		close: "Cerrar",
		essential: "Esenciales",
		functional: "Funcionales",
		analytics: "Analítica",
		marketing: "Marketing",
		essentialNote: "Siempre activos — necesarios para el sitio y esta elección.",
		privacyPolicy: "Política de privacidad",
		cookiePolicy: "Política de cookies",
		cookieSettings: "Ajustes de cookies y privacidad",
		loadEmbed: "Permitir incrustaciones y cargar",
		embedBlocked: "Este contenido está bloqueado hasta que permita la categoría correspondiente.",
		embedNeedConsent: "Para cargar este contenido, permita la categoría correspondiente en los ajustes de cookies.",
		vendorsHeading: "Qué usa este sitio",
		whatWeUse: "Qué usamos"
	},
	it: {
		acceptAll: "Accetta tutto",
		rejectNonEssential: "Rifiuta non essenziali",
		customize: "Personalizza",
		saveChoices: "Salva",
		close: "Chiudi",
		essential: "Essenziali",
		functional: "Funzionali",
		analytics: "Statistiche",
		marketing: "Marketing",
		essentialNote: "Sempre attivi — necessari al sito e a questa scelta.",
		privacyPolicy: "Informativa sulla privacy",
		cookiePolicy: "Informativa cookie",
		cookieSettings: "Impostazioni cookie e privacy",
		loadEmbed: "Consenti gli embed e carica",
		embedBlocked: "Questo contenuto è bloccato finché non consenti la categoria corrispondente.",
		embedNeedConsent: "Per caricare questo contenuto, consenti la categoria corrispondente nelle impostazioni cookie.",
		vendorsHeading: "Cosa usa questo sito",
		whatWeUse: "Cosa usiamo"
	},
	nl: {
		acceptAll: "Alles accepteren",
		rejectNonEssential: "Niet-essentieel weigeren",
		customize: "Aanpassen",
		saveChoices: "Opslaan",
		close: "Sluiten",
		essential: "Essentieel",
		functional: "Functioneel",
		analytics: "Statistieken",
		marketing: "Marketing",
		essentialNote: "Altijd aan — nodig voor de site en deze keuze.",
		privacyPolicy: "Privacybeleid",
		cookiePolicy: "Cookiebeleid",
		cookieSettings: "Cookie- en privacyinstellingen",
		loadEmbed: "Embeds toestaan en laden",
		embedBlocked: "Deze embed is geblokkeerd tot u de bijbehorende categorie toestaat.",
		embedNeedConsent: "Om deze embed te laden, sta de bijbehorende categorie toe in de cookie-instellingen.",
		vendorsHeading: "Wat deze site gebruikt",
		whatWeUse: "Wat wij gebruiken"
	},
	pt: {
		acceptAll: "Aceitar tudo",
		rejectNonEssential: "Recusar não essenciais",
		customize: "Personalizar",
		saveChoices: "Guardar",
		close: "Fechar",
		essential: "Essenciais",
		functional: "Funcionais",
		analytics: "Analítica",
		marketing: "Marketing",
		essentialNote: "Sempre ativos — necessários para o site e esta escolha.",
		privacyPolicy: "Política de privacidade",
		cookiePolicy: "Política de cookies",
		cookieSettings: "Definições de cookies e privacidade",
		loadEmbed: "Permitir embeds e carregar",
		embedBlocked: "Este conteúdo está bloqueado até autorizar a categoria correspondente.",
		embedNeedConsent: "Para carregar este conteúdo, autorize a categoria correspondente nas definições de cookies.",
		vendorsHeading: "O que este site usa",
		whatWeUse: "O que usamos"
	},
	pl: {
		acceptAll: "Zaakceptuj wszystkie",
		rejectNonEssential: "Odrzuć niepotrzebne",
		customize: "Dostosuj",
		saveChoices: "Zapisz",
		close: "Zamknij",
		essential: "Niezbędne",
		functional: "Funkcjonalne",
		analytics: "Analityczne",
		marketing: "Marketingowe",
		essentialNote: "Zawsze włączone — potrzebne do działania witryny i zapamiętania wyboru.",
		privacyPolicy: "Polityka prywatności",
		cookiePolicy: "Polityka cookies",
		cookieSettings: "Ustawienia plików cookie i prywatności",
		loadEmbed: "Zezwól na osadzenia i wczytaj",
		embedBlocked: "Ta treść jest zablokowana, dopóki nie zezwolisz na odpowiednią kategorię.",
		embedNeedConsent: "Aby wczytać tę treść, zezwól na odpowiednią kategorię w ustawieniach plików cookie.",
		vendorsHeading: "Czego używa ta witryna",
		whatWeUse: "Czego używamy"
	}
};
function isLocaleKey(s) {
	return LOCALE_KEY.test(s.trim());
}
/** `de-DE` → `["de-de", "de"]` (case-normalized). */
function localeFallbackKeys(locale) {
	if (!locale) return [];
	const t = locale.trim();
	if (!t || t.length > 16) return [];
	const lower = t.toLowerCase();
	const parts = lower.split("-");
	const keys = [];
	if (parts.length >= 2) keys.push(`${parts[0]}-${parts[1]}`);
	keys.push(parts[0] ?? lower);
	return keys.filter((k, i, a) => isLocaleKey(k) && a.indexOf(k) === i);
}
function chromeForLocale(locale) {
	for (const key of localeFallbackKeys(locale)) {
		const found = CHROME[key] ?? CHROME[key.split("-")[0] ?? ""];
		if (found) return found;
	}
	return CHROME["en"];
}
function parseLocaleOverrides(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const out = {};
	for (const [k, v] of Object.entries(raw)) {
		if (!isLocaleKey(k)) continue;
		if (!v || typeof v !== "object" || Array.isArray(v)) continue;
		const o = v;
		const entry = {};
		if (typeof o.bannerTitle === "string") entry.bannerTitle = o.bannerTitle;
		if (typeof o.bannerMessage === "string") entry.bannerMessage = o.bannerMessage;
		if (entry.bannerTitle !== void 0 || entry.bannerMessage !== void 0) out[k.toLowerCase()] = entry;
		if (Object.keys(out).length >= 32) break;
	}
	return out;
}
function parseLocaleOverridesText(text) {
	const t = text.trim();
	if (!t) return {};
	let parsed;
	try {
		parsed = JSON.parse(t);
	} catch {
		throw new Error("Translations must be JSON: {\"de\":{\"bannerTitle\":\"…\",\"bannerMessage\":\"…\"}}.");
	}
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("Translations JSON must be an object keyed by locale (e.g. de, fr).");
	for (const key of Object.keys(parsed)) if (!isLocaleKey(key)) throw new Error(`Invalid locale key "${key}". Use codes like en, de, or pt-BR.`);
	return parseLocaleOverrides(parsed);
}
function resolveBannerCopy(defaults, overrides, locale) {
	let title = defaults.bannerTitle;
	let message = defaults.bannerMessage;
	for (const key of localeFallbackKeys(locale)) {
		const o = overrides[key] ?? overrides[key.split("-")[0] ?? ""];
		if (!o) continue;
		if (typeof o.bannerTitle === "string" && o.bannerTitle.trim()) title = o.bannerTitle;
		if (typeof o.bannerMessage === "string" && o.bannerMessage.trim()) message = o.bannerMessage;
		break;
	}
	return {
		bannerTitle: title,
		bannerMessage: message
	};
}
//#endregion
//#region src/ids.ts
const HOSTNAME$1 = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const FATHOM_ID = /^[A-Za-z0-9]{4,32}$/;
const UMAMI_ID = /^[A-Za-z0-9-]{8,64}$/;
const GA4_ID = /^G-[A-Z0-9]{4,14}$/;
const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/;
function isHostname$1(s) {
	const t = s.trim().toLowerCase();
	if (!t || t.length > 253) return false;
	if (t === "localhost" || t.endsWith(".localhost")) return false;
	return HOSTNAME$1.test(t);
}
function isGa4Id(s) {
	return GA4_ID.test(s.trim());
}
function isGtmId(s) {
	return GTM_ID.test(s.trim());
}
function isFathomId(s) {
	return FATHOM_ID.test(s.trim());
}
function isUmamiId(s) {
	return UMAMI_ID.test(s.trim());
}
//#endregion
//#region src/security.ts
/** Hosts EmPrivacy may load as <script src> for built-in presets. */
const PRESET_SCRIPT_HOSTS = /* @__PURE__ */ new Set([
	"static.cloudflareinsights.com",
	"plausible.io",
	"cdn.usefathom.com",
	"scripts.simpleanalyticscdn.com",
	"www.googletagmanager.com",
	"googletagmanager.com"
]);
const HOSTNAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
function normalizeCookieMaxAgeDays(n, fallback = 180) {
	if (typeof n !== "number" || !Number.isFinite(n) || n < 1) return fallback;
	return Math.min(365, Math.max(1, Math.round(n)));
}
function parseCookieMaxAgeDays(s, fallback = 180) {
	const t = s.trim();
	if (!t) return fallback;
	if (!/^\d{1,3}$/.test(t)) throw new Error(`Consent cookie lifetime must be 1–365 days.`);
	const n = Number(t);
	if (n < 1 || n > 365) throw new Error(`Consent cookie lifetime must be 1–365 days.`);
	return n;
}
function cookieMaxAgeSeconds(days) {
	return normalizeCookieMaxAgeDays(days) * 24 * 60 * 60;
}
function hasUnsafeUrlChars$1(s) {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}
function parseStrictHttpsUrl(raw) {
	const t = raw.trim();
	if (!t || t.length > 2048 || hasUnsafeUrlChars$1(t)) return null;
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
function isHostname(s) {
	const t = s.trim().toLowerCase();
	if (!t || t.length > 253) return false;
	if (t === "localhost" || t.endsWith(".localhost")) return false;
	return HOSTNAME.test(t);
}
function parseHostnameAllowlist(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim().toLowerCase()).filter(Boolean);
	const out = [];
	for (const line of lines) {
		if (!isHostname(line)) throw new Error(`Invalid script host allowlist entry "${line}". Use hostnames like cdn.example.com.`);
		if (!out.includes(line)) out.push(line);
		if (out.length > 50) throw new Error("Script host allowlist is too long (max 50).");
	}
	return out;
}
function isSafeHttpsScriptUrl(raw) {
	const u = parseStrictHttpsUrl(raw);
	if (!u) return false;
	if (u.hash) return false;
	return true;
}
function isScriptHostAllowed(raw, opts) {
	const u = parseStrictHttpsUrl(raw);
	if (!u) return false;
	const host = u.hostname.toLowerCase();
	if (opts.allowPresets && PRESET_SCRIPT_HOSTS.has(host)) return true;
	if (opts.allowlist.length === 0) return true;
	return opts.allowlist.includes(host);
}
/** Optional SRI: `https://cdn.example/a.js sha384-...` or `... integrity=sha384-...`. */
function parseScriptUrlWithIntegrity(line) {
	const t = line.trim();
	if (!t) return {
		src: "",
		integrity: null
	};
	const integrityEq = /\sintegrity=(sha(?:256|384|512)-[A-Za-z0-9+/=]+)$/i.exec(t);
	if (integrityEq) return {
		src: t.slice(0, integrityEq.index).trim(),
		integrity: integrityEq[1] ?? null
	};
	const spaced = /^(https:\/\/\S+)\s+(sha(?:256|384|512)-[A-Za-z0-9+/=]+)$/i.exec(t);
	if (spaced) return {
		src: spaced[1] ?? "",
		integrity: spaced[2] ?? null
	};
	return {
		src: t,
		integrity: null
	};
}
function isValidIntegrity(s) {
	if (!s) return true;
	return /^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(s);
}
/**
* Same-origin guard for public state-changing plugin routes.
* Requires Origin matching the site, or Sec-Fetch-Site: same-origin.
*/
function assertSameOriginMutation(request, expectedOrigin) {
	const origin = request.headers.get("origin");
	if (origin) {
		if (origin !== expectedOrigin) return new Response("forbidden", { status: 403 });
		return null;
	}
	if ((request.headers.get("sec-fetch-site") ?? "").toLowerCase() === "same-origin") return null;
	return new Response("forbidden", { status: 403 });
}
/** Coarse hour bucket for rate limiting (UTC). */
function rateHourKey(now = /* @__PURE__ */ new Date()) {
	return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}${String(now.getUTCHours()).padStart(2, "0")}`;
}
//#endregion
//#region src/theme.ts
/** Hex colors only — rejects CSS injection via theme fields. */
const HEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
const DEFAULT_THEME = {
	bg: "#111111",
	text: "#eeeeee",
	accent: "#3b82f6",
	radiusPx: 6
};
function isSafeHexColor(s) {
	return HEX.test(s.trim());
}
function normalizeHexColor(s, fallback) {
	const t = s.trim();
	return isSafeHexColor(t) ? t : fallback;
}
function normalizeRadiusPx(n, fallback) {
	if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
	return Math.min(24, Math.max(0, Math.round(n)));
}
function parseRadiusInput(s, fallback) {
	const t = s.trim();
	if (!t) return fallback;
	if (!/^\d{1,2}$/.test(t)) throw new Error("Corner radius must be a whole number from 0 to 24.");
	const n = Number(t);
	if (n > 24) throw new Error("Corner radius must be a whole number from 0 to 24.");
	return normalizeRadiusPx(n, fallback);
}
//#endregion
//#region src/config.ts
/**
* EmPrivacy KV document (`consent:config`) and shared helpers.
*/
const KV_KEY = "consent:config";
const COOKIE_NAME = "emprivacy_cc";
const PLUGIN_ID = "emprivacy";
const DEFAULT_CONFIG = {
	bannerTitle: "Cookies & privacy",
	bannerMessage: "We use cookies to run this site and optionally for functional embeds, analytics, and marketing. You can accept or customize your choices.",
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
	cookieMaxAgeDays: 180,
	googleConsentMode: false,
	logConsentToServer: false,
	embedCategory: "marketing",
	gateEmbeds: true,
	hideBannerOnPolicyPages: true,
	defaultLocale: "en",
	localeOverrides: {},
	theme: { ...DEFAULT_THEME }
};
const ANALYTICS_PROVIDERS = [
	"cloudflare",
	"none",
	"custom",
	"plausible",
	"fathom",
	"umami",
	"simpleanalytics",
	"ga4",
	"gtm"
];
function hasUnsafeUrlChars(s) {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}
function isHttpsUrl(s) {
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
function invalidScriptUrlError(kind, u) {
	if (u.includes("<") || u.includes(">")) return `Invalid ${kind} script URL (https only). Paste one full https:// URL per line (the script src only), not a <script> tag or HTML comment. The invalid line was: ${u}`;
	return `Invalid ${kind} script URL (https only): ${u}`;
}
function isAnalyticsProvider(s) {
	return ANALYTICS_PROVIDERS.includes(s);
}
function isEmbedCategory(s) {
	return s === "functional" || s === "marketing";
}
/** Reject characters that would break JSON or attributes; allow typical Cloudflare site token strings. */
function assertValidCloudflareToken(t) {
	const s = t.trim();
	if (s.length === 0) return;
	if (s.length > 256) throw new Error("Cloudflare site token is too long.");
	if (/[\s<>'"&]/.test(s)) throw new Error("Cloudflare site token contains invalid characters.");
}
/**
* Root-relative public path (EmDash page route), e.g. `/privacy`.
* Rejects protocol-relative URLs (`//…`) and whitespace.
*/
function isRootRelativeSitePath(s) {
	const t = s.trim();
	if (t.length === 0) return false;
	if (!t.startsWith("/")) return false;
	if (t.startsWith("//")) return false;
	if (hasUnsafeUrlChars(t)) return false;
	return true;
}
/** For hooks: turn stored path or absolute URL into a public absolute URL. */
function resolvePolicyHref(stored, ctx) {
	const t = stored.trim();
	if (!t) return t;
	if (isRootRelativeSitePath(t)) return ctx.url(t);
	return t;
}
function isValidPolicyHrefInput(s) {
	const t = s.trim();
	if (!t) return false;
	return isHttpsUrl(t) || isRootRelativeSitePath(t);
}
function parseUrlList(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	return [...new Set(lines)];
}
function assertLength(label, s, min, max) {
	const t = s.trim();
	if (t.length < min) throw new Error(`${label} is required.`);
	if (t.length > max) throw new Error(`${label} is too long.`);
}
function assertOptionalLength(label, s, max) {
	if (s.trim().length > max) throw new Error(`${label} is too long.`);
}
function pathnameFromHref(href) {
	const t = href.trim();
	if (!t) return null;
	if (isRootRelativeSitePath(t)) return t.split(/[?#]/)[0] ?? t;
	try {
		return new URL(t).pathname.replace(/\/+$/, "") || "/";
	} catch {
		return null;
	}
}
/** True when the public page is the configured privacy or cookie policy. */
function isPolicyPagePath(pagePath, cfg) {
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
function normalizeConfig(raw) {
	if (typeof raw !== "object" || raw === null) return {
		...DEFAULT_CONFIG,
		theme: { ...DEFAULT_THEME }
	};
	const o = raw;
	const analytics = Array.isArray(o.analyticsScriptUrls) ? o.analyticsScriptUrls.filter((x) => typeof x === "string") : DEFAULT_CONFIG.analyticsScriptUrls;
	const marketing = Array.isArray(o.marketingScriptUrls) ? o.marketingScriptUrls.filter((x) => typeof x === "string") : DEFAULT_CONFIG.marketingScriptUrls;
	const cfTok = typeof o.cloudflareWebAnalyticsToken === "string" ? o.cloudflareWebAnalyticsToken : "";
	const apCandidate = typeof o.analyticsProvider === "string" ? o.analyticsProvider.trim() : "";
	let analyticsProvider;
	if (isAnalyticsProvider(apCandidate)) analyticsProvider = apCandidate;
	else if (analytics.length > 0) analyticsProvider = "custom";
	else analyticsProvider = DEFAULT_CONFIG.analyticsProvider;
	const themeRaw = o.theme && typeof o.theme === "object" ? o.theme : {};
	const embedRaw = typeof o.embedCategory === "string" ? o.embedCategory.trim() : "";
	const integrityRaw = o.scriptIntegrity && typeof o.scriptIntegrity === "object" && !Array.isArray(o.scriptIntegrity) ? o.scriptIntegrity : {};
	const scriptIntegrity = {};
	for (const [k, v] of Object.entries(integrityRaw)) {
		if (typeof k === "string" && typeof v === "string" && isValidIntegrity(v) && isSafeHttpsScriptUrl(k)) scriptIntegrity[k] = v;
		if (Object.keys(scriptIntegrity).length >= 100) break;
	}
	const scriptHostAllowlist = (Array.isArray(o.scriptHostAllowlist) ? o.scriptHostAllowlist.filter((x) => typeof x === "string") : []).map((h) => h.trim().toLowerCase()).filter((h) => isHostname$1(h)).slice(0, 50);
	return {
		bannerTitle: typeof o.bannerTitle === "string" ? o.bannerTitle : DEFAULT_CONFIG.bannerTitle,
		bannerMessage: typeof o.bannerMessage === "string" ? o.bannerMessage : DEFAULT_CONFIG.bannerMessage,
		privacyPolicyUrl: typeof o.privacyPolicyUrl === "string" ? o.privacyPolicyUrl : DEFAULT_CONFIG.privacyPolicyUrl,
		cookiePolicyUrl: typeof o.cookiePolicyUrl === "string" ? o.cookiePolicyUrl : DEFAULT_CONFIG.cookiePolicyUrl,
		strictDefaults: typeof o.strictDefaults === "boolean" ? o.strictDefaults : DEFAULT_CONFIG.strictDefaults,
		policyVersion: typeof o.policyVersion === "string" && o.policyVersion.length > 0 ? o.policyVersion : DEFAULT_CONFIG.policyVersion,
		cloudflareWebAnalyticsToken: cfTok,
		analyticsProvider,
		analyticsId: typeof o.analyticsId === "string" ? o.analyticsId : "",
		umamiScriptUrl: typeof o.umamiScriptUrl === "string" ? o.umamiScriptUrl : "",
		analyticsScriptUrls: analytics,
		marketingScriptUrls: marketing,
		scriptIntegrity,
		scriptHostAllowlist,
		cookieMaxAgeDays: normalizeCookieMaxAgeDays(o.cookieMaxAgeDays, DEFAULT_CONFIG.cookieMaxAgeDays),
		googleConsentMode: typeof o.googleConsentMode === "boolean" ? o.googleConsentMode : DEFAULT_CONFIG.googleConsentMode,
		logConsentToServer: typeof o.logConsentToServer === "boolean" ? o.logConsentToServer : DEFAULT_CONFIG.logConsentToServer,
		embedCategory: isEmbedCategory(embedRaw) ? embedRaw : DEFAULT_CONFIG.embedCategory,
		gateEmbeds: typeof o.gateEmbeds === "boolean" ? o.gateEmbeds : DEFAULT_CONFIG.gateEmbeds,
		hideBannerOnPolicyPages: typeof o.hideBannerOnPolicyPages === "boolean" ? o.hideBannerOnPolicyPages : DEFAULT_CONFIG.hideBannerOnPolicyPages,
		defaultLocale: typeof o.defaultLocale === "string" && o.defaultLocale ? o.defaultLocale : DEFAULT_CONFIG.defaultLocale,
		localeOverrides: parseLocaleOverrides(o.localeOverrides),
		theme: {
			bg: normalizeHexColor(typeof themeRaw.bg === "string" ? themeRaw.bg : "", DEFAULT_THEME.bg),
			text: normalizeHexColor(typeof themeRaw.text === "string" ? themeRaw.text : "", DEFAULT_THEME.text),
			accent: normalizeHexColor(typeof themeRaw.accent === "string" ? themeRaw.accent : "", DEFAULT_THEME.accent),
			radiusPx: normalizeRadiusPx(themeRaw.radiusPx, DEFAULT_THEME.radiusPx)
		}
	};
}
function assertAnalyticsId(provider, id, umamiScriptUrl) {
	const t = id.trim();
	if (provider === "plausible") {
		if (!isHostname$1(t)) throw new Error("Plausible domain must be a hostname like example.com (no https://).");
		return;
	}
	if (provider === "fathom") {
		if (!isFathomId(t)) throw new Error("Fathom site ID must be 4–32 letters or digits.");
		return;
	}
	if (provider === "umami") {
		if (!isUmamiId(t)) throw new Error("Umami website ID looks invalid.");
		if (!isHttpsUrl(umamiScriptUrl)) throw new Error("Umami requires the https script URL (Cloud or your self-hosted tracker).");
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
	if (provider === "simpleanalytics" && t && !isHostname$1(t)) throw new Error("Simple Analytics hostname must be a domain like example.com, or empty.");
}
/** Validate admin-submitted fields; throws an Error with a short message on failure */
function assertValidSavedConfig(input) {
	assertLength("Policy version", input.policyVersion, 1, 64);
	assertOptionalLength("Banner title", input.bannerTitle, 120);
	assertOptionalLength("Short notice", input.bannerMessage, 600);
	const privacyPolicyUrl = input.privacyPolicyUrl.trim();
	if (!isValidPolicyHrefInput(privacyPolicyUrl)) throw new Error("Privacy policy must be a full https:// URL or a site path to your EmDash Page (e.g. /privacy).");
	if (privacyPolicyUrl.length > 2048) throw new Error("Privacy policy URL/path is too long.");
	let cookiePolicyUrl = input.cookiePolicyUrl.trim();
	if (cookiePolicyUrl && !isValidPolicyHrefInput(cookiePolicyUrl)) throw new Error("Cookie policy must be a valid https:// URL or a root-relative path (e.g. /cookies), or empty.");
	if (cookiePolicyUrl.length > 2048) throw new Error("Cookie policy URL/path is too long.");
	if (!cookiePolicyUrl) cookiePolicyUrl = DEFAULT_CONFIG.cookiePolicyUrl;
	const ap = input.analyticsPlatform.trim() || "cloudflare";
	if (!isAnalyticsProvider(ap)) throw new Error("Analytics: choose a supported platform.");
	const tokenTrim = input.cloudflareToken.trim();
	if (ap === "cloudflare") assertValidCloudflareToken(tokenTrim);
	const umamiScriptUrl = input.umamiScriptUrl.trim();
	if (ap === "umami" && umamiScriptUrl && !isHttpsUrl(umamiScriptUrl)) throw new Error(invalidScriptUrlError("umami", umamiScriptUrl));
	if (ap !== "none" && ap !== "custom" && ap !== "cloudflare" && ap !== "simpleanalytics" && ap !== "gtm") assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	else if (ap === "simpleanalytics" && input.analyticsId.trim()) assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	else if (ap === "gtm") assertAnalyticsId(ap, input.analyticsId, umamiScriptUrl);
	const scriptHostAllowlist = parseHostnameAllowlist(input.scriptHostAllowlistText);
	const cookieMaxAgeDays = parseCookieMaxAgeDays(input.cookieMaxAgeDays, 180);
	const scriptIntegrity = {};
	const assertScriptLine = (kind, line) => {
		const { src, integrity } = parseScriptUrlWithIntegrity(line);
		if (!src || src.length > 2048) throw new Error(invalidScriptUrlError(kind, line));
		if (!isSafeHttpsScriptUrl(src)) throw new Error(invalidScriptUrlError(kind, src));
		if (integrity && !isValidIntegrity(integrity)) throw new Error(`Invalid SRI for ${kind} script (expected sha256-|sha384-|sha512-…).`);
		if (!isScriptHostAllowed(src, {
			allowlist: scriptHostAllowlist,
			allowPresets: false
		})) throw new Error(`${kind} script host is not on the allowlist. Add the hostname or clear the allowlist.`);
		if (integrity) scriptIntegrity[src] = integrity;
		return src;
	};
	if (ap === "umami" && umamiScriptUrl) {
		if (!isScriptHostAllowed(umamiScriptUrl, {
			allowlist: scriptHostAllowlist,
			allowPresets: false
		})) throw new Error("Umami script host is not on the allowlist. Add the hostname or clear the allowlist.");
	}
	const analyticsScriptUrls = [];
	if (ap === "custom") {
		const list = parseUrlList(input.analyticsUrlsText);
		if (list.length > 50) throw new Error("Analytics script URL list is too long (max 50).");
		for (const u of list) analyticsScriptUrls.push(assertScriptLine("analytics", u));
	}
	const marketingScriptUrls = [];
	const mlist = parseUrlList(input.marketingUrlsText);
	if (mlist.length > 50) throw new Error("Marketing script URL list is too long (max 50).");
	for (const u of mlist) marketingScriptUrls.push(assertScriptLine("marketing", u));
	const embedCategory = input.embedCategory.trim() || "marketing";
	if (!isEmbedCategory(embedCategory)) throw new Error("Embeds must require Functional or Marketing consent.");
	const defaultLocale = input.defaultLocale.trim().toLowerCase() || "en";
	if (!/^[a-z]{2,3}(?:-[a-z]{2})?$/.test(defaultLocale)) throw new Error("Default locale must look like en or pt-BR.");
	const localeOverrides = parseLocaleOverridesText(input.localeOverridesText);
	for (const pack of Object.values(localeOverrides)) {
		if (pack.bannerTitle !== void 0) assertOptionalLength("Translated banner title", pack.bannerTitle, 120);
		if (pack.bannerMessage !== void 0) assertOptionalLength("Translated short notice", pack.bannerMessage, 600);
	}
	const themeBg = input.themeBg.trim() || DEFAULT_THEME.bg;
	const themeText = input.themeText.trim() || DEFAULT_THEME.text;
	const themeAccent = input.themeAccent.trim() || DEFAULT_THEME.accent;
	if (input.themeBg.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeBg)) throw new Error("Banner background must be a hex color like #111111.");
	if (input.themeText.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeText)) throw new Error("Banner text color must be a hex color like #eeeeee.");
	if (input.themeAccent.trim() && !/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(themeAccent)) throw new Error("Banner accent color must be a hex color like #3b82f6.");
	return normalizeConfig({
		bannerTitle: input.bannerTitle.trim() || DEFAULT_CONFIG.bannerTitle,
		bannerMessage: input.bannerMessage.trim() || DEFAULT_CONFIG.bannerMessage,
		privacyPolicyUrl,
		cookiePolicyUrl,
		strictDefaults: input.strictDefaults,
		policyVersion: input.policyVersion.trim(),
		analyticsProvider: ap,
		cloudflareWebAnalyticsToken: ap === "cloudflare" ? tokenTrim : "",
		analyticsId: ap === "cloudflare" || ap === "custom" || ap === "none" ? "" : input.analyticsId.trim(),
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
			radiusPx: parseRadiusInput(input.themeRadius, DEFAULT_THEME.radiusPx)
		}
	});
}
/** Safe to embed in `<script type="application/json">` (breakout-safe) */
function jsonForHtmlScript(value) {
	return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => {
		switch (c) {
			case "<": return "\\u003c";
			case ">": return "\\u003e";
			case "&": return "\\u0026";
			case "\u2028": return "\\u2028";
			case "\u2029": return "\\u2029";
			default: return c;
		}
	});
}
function resolvePublicCopy(cfg, locale) {
	const copy = resolveBannerCopy({
		bannerTitle: cfg.bannerTitle,
		bannerMessage: cfg.bannerMessage
	}, cfg.localeOverrides, locale ?? cfg.defaultLocale);
	return {
		bannerTitle: copy.bannerTitle,
		bannerMessage: copy.bannerMessage,
		ui: chromeForLocale(locale ?? cfg.defaultLocale)
	};
}
//#endregion
//#region src/npm-version.ts
/** Public npm package page for this plugin. */
const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@emplugins/emprivacy";
/** npm registry metadata for the `latest` dist-tag. */
const NPM_REGISTRY_LATEST_URL = "https://registry.npmjs.org/@emplugins/emprivacy/latest";
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const SUCCESS_CACHE_MS = 6e5;
const FAILURE_CACHE_MS = 6e4;
const FETCH_TIMEOUT_MS = 2500;
let cache = null;
/** Accept only a well-formed semver from untrusted registry JSON. */
function parseNpmLatestVersion(data) {
	if (!data || typeof data !== "object") return null;
	const version = data.version;
	if (typeof version !== "string") return null;
	const trimmed = version.trim();
	return SEMVER.test(trimmed) ? trimmed : null;
}
function parseCore(version) {
	const m = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
	if (!m) return null;
	return [
		Number(m[1]),
		Number(m[2]),
		Number(m[3])
	];
}
/** True when `latest` is a higher MAJOR.MINOR.PATCH than `installed`. */
function isNewerPublished(latest, installed) {
	const a = parseCore(latest);
	const b = parseCore(installed);
	if (!a || !b) return latest !== installed;
	if (a[0] !== b[0]) return a[0] > b[0];
	if (a[1] !== b[1]) return a[1] > b[1];
	return a[2] > b[2];
}
function pluginVersionFields(installed, latest) {
	return [{
		label: "Installed version",
		value: installed
	}, {
		label: "Latest on npm",
		value: latest ?? "Could not reach npm"
	}];
}
function pluginVersionNote(installed, latest) {
	if (latest && isNewerPublished(latest, installed)) return `A newer version is published. Update @emplugins/emprivacy to get it. ${NPM_PACKAGE_URL}`;
	return `Published package: ${NPM_PACKAGE_URL}`;
}
/**
* Read the published `latest` version from the npm registry.
* Results are cached briefly so admin save/reload does not hit npm every time.
* Failures return null and never throw — the settings page must still load.
*/
async function fetchLatestPublishedVersion(options) {
	const now = options?.now ?? Date.now();
	if (cache && now < cache.expiresAt) return cache.value;
	const doFetch = options?.fetch ?? globalThis.fetch;
	const timeoutMs = options?.timeoutMs ?? FETCH_TIMEOUT_MS;
	try {
		const response = await doFetch(NPM_REGISTRY_LATEST_URL, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"User-Agent": "EmPrivacy (https://github.com/EmPlugins/EmPrivacy)"
			},
			signal: AbortSignal.timeout(timeoutMs)
		});
		if (!response.ok) {
			cache = {
				value: null,
				expiresAt: now + FAILURE_CACHE_MS
			};
			return null;
		}
		const version = parseNpmLatestVersion(await response.json());
		cache = {
			value: version,
			expiresAt: now + (version ? SUCCESS_CACHE_MS : FAILURE_CACHE_MS)
		};
		return version;
	} catch {
		cache = {
			value: null,
			expiresAt: now + FAILURE_CACHE_MS
		};
		return null;
	}
}
//#endregion
//#region src/public-bootstrap.ts
/**
* Public-site bootstrap. Banner copy is applied with textContent / createTextNode only.
* Embed/script URLs are re-validated in the browser (never trust DOM data-src alone).
*/
function buildBodyBootstrap(pr) {
	return `(function(){
var C=${jsonForHtmlScript(pr)};
var CN="${COOKIE_NAME}";
var listeners=[];
var PRESET_HOSTS={"static.cloudflareinsights.com":1,"plausible.io":1,"cdn.usefathom.com":1,"scripts.simpleanalyticscdn.com":1,"www.googletagmanager.com":1,"googletagmanager.com":1};
var YT_IFRAME=/^https:\\/\\/(?:www\\.)?youtube-nocookie\\.com\\/embed\\/[A-Za-z0-9_-]{11}\\/?$/;
var VIMEO_IFRAME=/^https:\\/\\/player\\.vimeo\\.com\\/video\\/\\d{6,12}\\/?$/;
function readCookie(){
try{
var m=document.cookie.match(new RegExp("(?:^|;\\\\s*)"+CN+"=([^;]*)"));
var v=m?decodeURIComponent(m[1]):"";
if(!v||v.length>1024)return"";
return v;
}catch(e){return"";}
}
function writeCookie(val){
var secure=document.location.protocol==="https:"?"; Secure":"";
var maxAge=typeof C.cookieMaxAge==="number"&&C.cookieMaxAge>0?C.cookieMaxAge:15552000;
document.cookie=CN+"="+encodeURIComponent(val)+"; Path=/; SameSite=Lax"+secure+"; Max-Age="+maxAge;
}
function flagOk(x){return x===0||x===1||x===true||x===false;}
function parseState(s){
try{
var o=JSON.parse(s);
if(!o||typeof o!=="object")return null;
if(typeof o.v!=="string")return null;
if(o.v!==C.policyVersion)return null;
if(!flagOk(o.a)||!flagOk(o.m)||!flagOk(o.f))return null;
return {v:o.v,essential:true,functional:!!o.f,analytics:!!o.a,marketing:!!o.m};
}catch(e){return null;}
}
function currentState(){return parseState(readCookie());}
function emit(st){
listeners.slice().forEach(function(fn){try{fn(st);}catch(e){}});
try{document.dispatchEvent(new CustomEvent("emprivacy:change",{detail:st}));}catch(e){}
}
function needBanner(){
if(C.hideBanner)return false;
return !parseState(readCookie());
}
function parseHttps(raw){
try{
if(!raw||typeof raw!=="string"||raw.length>2048)return null;
if(/[\\u0000-\\u001F\\u007F\\s]/.test(raw))return null;
if(/%0d|%0a|%09|%0b|%0c|%20/i.test(raw))return null;
var u=new URL(raw);
if(u.protocol!=="https:")return null;
if(u.username||u.password)return null;
var h=u.hostname.toLowerCase();
if(h==="localhost"||h.endsWith(".localhost")||h==="127.0.0.1"||h==="::1")return null;
return u;
}catch(e){return null;}
}
function hostAllowed(u,allowPresets){
var h=u.hostname.toLowerCase();
if(allowPresets&&PRESET_HOSTS[h])return true;
var list=C.scriptHostAllowlist||[];
if(!list.length)return true;
return list.indexOf(h)>=0;
}
function safeScriptUrl(raw,allowPresets){
var u=parseHttps(raw);
if(!u||u.hash)return null;
if(!hostAllowed(u,!!allowPresets))return null;
return u.href;
}
function allowedIframe(src){return YT_IFRAME.test(src)||VIMEO_IFRAME.test(src);}
function allowedLink(src,kind){
var u=parseHttps(src);
if(!u)return false;
var h=u.hostname.toLowerCase();
if(h==="x.com"||h==="www.x.com"||h==="twitter.com"||h==="www.twitter.com"||h==="mobile.twitter.com"){
return /\\/(?:i\\/web\\/)?status(?:es)?\\/\\d{5,20}\\/?$/i.test(u.pathname);
}
if(h==="bsky.app"||h==="www.bsky.app"){
return /^\\/profile\\/[^/]+\\/post\\/[^/]+\\/?$/.test(u.pathname);
}
if(h==="gist.github.com"){
return /^\\/[A-Za-z0-9-]{1,39}\\/[a-f0-9]{8,64}\\/?$/i.test(u.pathname);
}
if(/^\\/@[^/]+\\/\\d+\\/?$/.test(u.pathname)||/^\\/users\\/[^/]+\\/statuses\\/\\d+\\/?$/.test(u.pathname))return true;
return kind==="linkPreview";
}
function alreadyScriptSrc(u){
try{
return Array.prototype.some.call(document.getElementsByTagName("script"),function(s){return s.src===u;});
}catch(e){return false;}
}
function loadScript(src, attrs, integrity, allowPresets){
var safe=safeScriptUrl(src,allowPresets);
if(!safe||alreadyScriptSrc(safe))return;
var e=document.createElement("script");
e.src=safe;e.async=true;e.referrerPolicy="no-referrer-when-downgrade";
if(integrity&&/^sha(?:256|384|512)-[A-Za-z0-9+/=]+$/.test(integrity)){
e.integrity=integrity;
e.crossOrigin="anonymous";
}
if(attrs){
Object.keys(attrs).forEach(function(k){
if(/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(k)) e.setAttribute(k,String(attrs[k]));
});
}
document.head.appendChild(e);
}
function loadCloudflareBeacon(token){
var u="https://static.cloudflareinsights.com/beacon.min.js";
if(!token||typeof token!=="string"||token.length>256||/[\\s<>'"&]/.test(token))return;
if(alreadyScriptSrc(u))return;
var e=document.createElement("script");
e.src=u;
e.defer=true;
e.setAttribute("data-cf-beacon",JSON.stringify({token:token}));
e.referrerPolicy="no-referrer-when-downgrade";
document.head.appendChild(e);
}
function applyAnalytics(){
var L=C.loader||{type:"none"};
if(L.type==="cloudflare") loadCloudflareBeacon(L.token);
else if(L.type==="custom") (L.scripts||[]).forEach(function(s){loadScript(s.src,null,s.integrity,false);});
else if(L.type==="plausible") loadScript(L.src,{"data-domain":L.domain},null,true);
else if(L.type==="fathom") loadScript(L.src,{"data-site":L.siteId},null,true);
else if(L.type==="umami") loadScript(L.src,{"data-website-id":L.websiteId},null,false);
else if(L.type==="simpleanalytics") loadScript(L.src,null,null,true);
else if(L.type==="ga4"){
window.dataLayer=window.dataLayer||[];
if(typeof window.gtag!=="function"){window.gtag=function(){window.dataLayer.push(arguments);};}
loadScript("https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(L.measurementId),null,null,true);
window.gtag("js",new Date());
window.gtag("config",L.measurementId);
}
}
function applyMarketing(){
var urls=C.marketingScripts||[];
urls.forEach(function(s){loadScript(s.src,null,s.integrity,false);});
var L=C.loader||{type:"none"};
if(L.type==="gtm"){
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
loadScript("https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(L.containerId),null,null,true);
}
}
function applyScripts(st){
if(st.analytics) applyAnalytics();
if(st.marketing) applyMarketing();
}
function gtagUpdate(st){
if(!C.googleConsentMode||!window.gtag)return;
window.gtag("consent","update",{
analytics_storage:st.analytics?"granted":"denied",
ad_storage:st.marketing?"granted":"denied",
ad_user_data:st.marketing?"granted":"denied",
ad_personalization:st.marketing?"granted":"denied",
personalization_storage:st.marketing?"granted":"denied",
functionality_storage:st.functional?"granted":"denied",
security_storage:"granted"
});
}
function logServer(st){
if(!C.logConsent)return;
fetch(C.recordPath,{
method:"POST",
credentials:"same-origin",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({policyVersion:C.policyVersion,functional:!!st.functional,analytics:!!st.analytics,marketing:!!st.marketing})
}).catch(function(){});
}
function hide(el){if(el)el.setAttribute("hidden","");el&&(el.style.display="none");}
function show(el){if(el)el.removeAttribute("hidden");el&&(el.style.display="");}
function embedAllowed(st){
if(!C.gateEmbeds)return false;
return C.embedCategory==="functional"?!!st.functional:!!st.marketing;
}
function mountIframe(box,src){
if(!allowedIframe(src))return;
var f=document.createElement("iframe");
f.src=src;
f.setAttribute("loading","lazy");
f.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
f.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
f.setAttribute("allowfullscreen","");
f.setAttribute("sandbox","allow-scripts allow-same-origin allow-presentation");
f.setAttribute("title",box.getAttribute("data-label")||"Embed");
f.style.width="100%";
f.style.aspectRatio="16/9";
f.style.border="0";
box.replaceWith(f);
}
function mountLink(box,src,label,kind){
if(!allowedLink(src,kind))return;
var a=document.createElement("a");
a.href=src;
a.rel="noopener noreferrer nofollow";
a.target="_blank";
a.appendChild(document.createTextNode(label||src));
box.replaceWith(a);
}
function hydrateEmbeds(st){
if(!C.gateEmbeds)return;
var nodes=document.querySelectorAll("[data-emprivacy-embed]");
Array.prototype.forEach.call(nodes,function(box){
var copy=box.querySelector(".emprivacy-embed-copy");
var loadBtn=box.querySelector("[data-emprivacy-embed-load]");
if(copy) copy.textContent=C.ui.embedBlocked;
if(loadBtn) loadBtn.textContent=C.ui.loadEmbed;
if(!embedAllowed(st))return;
var src=box.getAttribute("data-src")||"";
var mode=box.getAttribute("data-mode")||"";
var kind=box.getAttribute("data-emprivacy-embed")||"";
if(mode==="iframe") mountIframe(box,src);
else mountLink(box,src,box.getAttribute("data-label")||"",kind);
});
}
function persist(a,m,f,opts){
var st={v:C.policyVersion,essential:true,functional:!!f,analytics:!!a,marketing:!!m};
writeCookie(JSON.stringify({v:st.v,a:st.analytics?1:0,m:st.marketing?1:0,f:st.functional?1:0}));
logServer(st);
gtagUpdate(st);
emit(st);
hydrateEmbeds(st);
if(!opts||!opts.skipReload){
location.reload();
return st;
}
applyScripts(st);
return st;
}
function addPolicyLinks(links){
function addOne(href,text){
if(!href)return;
if(!parseHttps(href))return;
var a=document.createElement("a");
a.href=href;
a.rel="nofollow noopener";
a.target="_blank";
a.appendChild(document.createTextNode(text));
links.appendChild(a);
}
addOne(C.privacyPolicyUrl,C.ui.privacyPolicy);
if(C.cookiePolicyUrl)addOne(C.cookiePolicyUrl,C.ui.cookiePolicy);
}
function addVendorDisclosure(parent){
if(!C.vendors||!C.vendors.length)return;
var det=document.createElement("details");
det.className="emprivacy-vendors";
var sum=document.createElement("summary");
sum.appendChild(document.createTextNode(C.ui.vendorsHeading));
det.appendChild(sum);
var ul=document.createElement("ul");
C.vendors.forEach(function(v){
var li=document.createElement("li");
var strong=document.createElement("strong");
strong.appendChild(document.createTextNode(v.name));
li.appendChild(strong);
li.appendChild(document.createTextNode(" ("+v.category+") — "+v.purpose));
if(v.policyUrl&&parseHttps(v.policyUrl)){
li.appendChild(document.createTextNode(" "));
var a=document.createElement("a");
a.href=v.policyUrl;
a.rel="nofollow noopener";
a.target="_blank";
a.appendChild(document.createTextNode(C.ui.whatWeUse));
li.appendChild(a);
}
ul.appendChild(li);
});
det.appendChild(ul);
parent.appendChild(det);
}
function mkRow(label,id,on,locked){
var w=document.createElement("label");
w.className="emprivacy-switch";
var cb=document.createElement("input");
cb.type="checkbox";
cb.id=id;
cb.checked=on;
if(locked){cb.checked=true;cb.disabled=true;}
w.appendChild(cb);
w.appendChild(document.createTextNode(" "+label));
return {wrap:w,box:cb};
}
var openPanel=function(){};
function installApi(){
var api=Object.freeze({
get:function(){return currentState();},
has:function(cat){
if(cat==="essential")return true;
var st=currentState();
if(!st)return false;
if(cat==="functional")return !!st.functional;
if(cat==="analytics")return !!st.analytics;
if(cat==="marketing")return !!st.marketing;
return false;
},
onChange:function(cb){
if(typeof cb!=="function")return function(){};
listeners.push(cb);
return function(){listeners=listeners.filter(function(x){return x!==cb;});};
},
open:function(){openPanel();}
});
try{Object.defineProperty(window,"emprivacy",{value:api,writable:false,configurable:false});}catch(e){window.emprivacy=api;}
}
function applyTheme(root){
try{
root.style.setProperty("--emprivacy-bg",C.theme.bg);
root.style.setProperty("--emprivacy-text",C.theme.text);
root.style.setProperty("--emprivacy-accent",C.theme.accent);
root.style.setProperty("--emprivacy-radius",String(C.theme.radiusPx)+"px");
}catch(e){}
}
function mount(){
var root=document.getElementById("emprivacy-root");
if(!root)return;
applyTheme(root);
var initial=currentState();
if(initial) hydrateEmbeds(initial);
var trigger=document.createElement("button");
trigger.type="button";
trigger.className="emprivacy-cookie-trigger";
trigger.setAttribute("aria-label",C.ui.cookieSettings);
var ic=document.createElement("span");
ic.setAttribute("aria-hidden","true");
ic.className="emprivacy-cookie-trigger-icon";
ic.appendChild(document.createTextNode("🍪"));
trigger.appendChild(ic);
function showTrigger(){trigger.removeAttribute("hidden");}
function hideTrigger(){trigger.setAttribute("hidden","");}
function buildPanel(isReopen,hint){
var st=parseState(readCookie());
var aOn=st?!!st.analytics:(C.strictDefaults?false:true);
var mOn=st?!!st.marketing:(C.strictDefaults?false:true);
var fOn=st?!!st.functional:(C.strictDefaults?false:true);
if(isReopen) hideTrigger();
var bar=document.createElement("div");
bar.className="emprivacy-bar"+(isReopen?" emprivacy-bar--reopen":"");
bar.setAttribute("role","dialog");
bar.setAttribute("aria-modal",isReopen?"true":"false");
var title=document.createElement("h2");
title.className="emprivacy-title";
title.appendChild(document.createTextNode(C.bannerTitle));
var msg=document.createElement("p");
msg.className="emprivacy-msg";
msg.appendChild(document.createTextNode(C.bannerMessage));
var links=document.createElement("div");
links.className="emprivacy-links";
addPolicyLinks(links);
var opts=document.createElement("div");
opts.className="emprivacy-opts";
if(!isReopen) opts.setAttribute("hidden","");
if(hint){
var hintEl=document.createElement("p");
hintEl.className="emprivacy-note";
hintEl.appendChild(document.createTextNode(hint));
opts.appendChild(hintEl);
show(opts);
}
var ess=mkRow(C.ui.essential,isReopen?"emprivacy-re":"emprivacy-e",true,true);
var note=document.createElement("p");
note.className="emprivacy-note";
note.appendChild(document.createTextNode(C.ui.essentialNote));
var fr=mkRow(C.ui.functional,isReopen?"emprivacy-rf":"emprivacy-f",fOn,false);
var er=mkRow(C.ui.analytics,isReopen?"emprivacy-ra":"emprivacy-a",aOn,false);
var mr=mkRow(C.ui.marketing,isReopen?"emprivacy-rm":"emprivacy-m",mOn,false);
opts.appendChild(ess.wrap);
opts.appendChild(note);
opts.appendChild(fr.wrap);
opts.appendChild(er.wrap);
opts.appendChild(mr.wrap);
addVendorDisclosure(opts);
var actions=document.createElement("div");
actions.className="emprivacy-actions";
var btnAll=document.createElement("button");
btnAll.type="button";
btnAll.className="emprivacy-btn emprivacy-btn-primary";
btnAll.appendChild(document.createTextNode(C.ui.acceptAll));
btnAll.addEventListener("click",function(){persist(true,true,true);});
var btnRej=document.createElement("button");
btnRej.type="button";
btnRej.className="emprivacy-btn";
btnRej.appendChild(document.createTextNode(C.ui.rejectNonEssential));
btnRej.addEventListener("click",function(){persist(false,false,false);});
var btnSave=document.createElement("button");
btnSave.type="button";
btnSave.className="emprivacy-btn emprivacy-btn-primary";
if(!isReopen&&!hint) btnSave.setAttribute("hidden","");
btnSave.appendChild(document.createTextNode(C.ui.saveChoices));
btnSave.addEventListener("click",function(){persist(!!er.box.checked,!!mr.box.checked,!!fr.box.checked);});
actions.appendChild(btnAll);
actions.appendChild(btnRej);
if(!isReopen){
var btnCust=document.createElement("button");
btnCust.type="button";
btnCust.className="emprivacy-btn";
btnCust.appendChild(document.createTextNode(C.ui.customize));
btnCust.addEventListener("click",function(){show(opts);btnSave.removeAttribute("hidden");});
actions.appendChild(btnCust);
}else{
var btnClose=document.createElement("button");
btnClose.type="button";
btnClose.className="emprivacy-btn";
btnClose.appendChild(document.createTextNode(C.ui.close));
btnClose.addEventListener("click",function(){
if(bar.parentNode)bar.parentNode.removeChild(bar);
showTrigger();
});
actions.appendChild(btnClose);
}
actions.appendChild(btnSave);
bar.appendChild(title);
bar.appendChild(msg);
bar.appendChild(links);
bar.appendChild(opts);
bar.appendChild(actions);
return bar;
}
function openReopenPanel(hint){
if(root.querySelector(".emprivacy-bar--reopen"))return;
var st=parseState(readCookie());
if(!st)return;
root.appendChild(buildPanel(true,hint||""));
}
openPanel=function(hint){
var st=parseState(readCookie());
if(st) openReopenPanel(hint);
else{
var existing=root.querySelector(".emprivacy-bar");
if(existing){
if(hint){
var note=document.createElement("p");
note.className="emprivacy-note";
note.appendChild(document.createTextNode(hint));
var opts=existing.querySelector(".emprivacy-opts");
if(opts){opts.insertBefore(note,opts.firstChild);show(opts);}
}
try{existing.scrollIntoView({block:"end"});}catch(e){}
}
}
};
root.appendChild(trigger);
hideTrigger();
function wireEmbedButtons(){
document.addEventListener("click",function(ev){
var t=ev.target;
if(!t||!t.closest)return;
var btn=t.closest("[data-emprivacy-embed-load]");
if(!btn)return;
ev.preventDefault();
if(!C.gateEmbeds)return;
var st=currentState();
if(st&&embedAllowed(st)){
hydrateEmbeds(st);
return;
}
openPanel(C.ui.embedNeedConsent);
});
}
wireEmbedButtons();
if(!needBanner()){
var st=parseState(readCookie());
if(st){
applyScripts(st);
gtagUpdate(st);
hydrateEmbeds(st);
}
showTrigger();
trigger.addEventListener("click",function(){openReopenPanel();});
installApi();
return;
}
root.appendChild(buildPanel(false,""));
trigger.addEventListener("click",function(){openReopenPanel();});
installApi();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
else mount();
})();`;
}
function buildGoogleConsentHeadScript() {
	return `(function(){window.dataLayer=window.dataLayer||[];function g(){window.dataLayer.push(arguments);}window.gtag=g;g("consent","default",{"analytics_storage":"denied","ad_storage":"denied","ad_user_data":"denied","ad_personalization":"denied","functionality_storage":"denied","security_storage":"granted","personalization_storage":"denied"});})();`;
}
//#endregion
//#region src/vendors.ts
const PLAUSIBLE_SCRIPT = "https://plausible.io/js/script.js";
const FATHOM_SCRIPT = "https://cdn.usefathom.com/script.js";
const SIMPLE_SCRIPT = "https://scripts.simpleanalyticscdn.com/latest.js";
function buildAnalyticsLoader(cfg) {
	switch (cfg.analyticsProvider) {
		case "none": return { type: "none" };
		case "cloudflare": return cfg.cloudflareWebAnalyticsToken ? {
			type: "cloudflare",
			token: cfg.cloudflareWebAnalyticsToken
		} : { type: "none" };
		case "custom": return cfg.analyticsScriptUrls.length ? {
			type: "custom",
			scripts: cfg.analyticsScriptUrls.map((src) => ({
				src,
				integrity: cfg.scriptIntegrity[src] ?? null
			}))
		} : { type: "none" };
		case "plausible": return isHostname$1(cfg.analyticsId) ? {
			type: "plausible",
			src: PLAUSIBLE_SCRIPT,
			domain: cfg.analyticsId.trim().toLowerCase()
		} : { type: "none" };
		case "fathom": return isFathomId(cfg.analyticsId) ? {
			type: "fathom",
			src: FATHOM_SCRIPT,
			siteId: cfg.analyticsId.trim()
		} : { type: "none" };
		case "umami": return isUmamiId(cfg.analyticsId) && cfg.umamiScriptUrl ? {
			type: "umami",
			src: cfg.umamiScriptUrl,
			websiteId: cfg.analyticsId.trim()
		} : { type: "none" };
		case "simpleanalytics": return {
			type: "simpleanalytics",
			src: SIMPLE_SCRIPT
		};
		case "ga4": return isGa4Id(cfg.analyticsId) ? {
			type: "ga4",
			measurementId: cfg.analyticsId.trim()
		} : { type: "none" };
		case "gtm": return isGtmId(cfg.analyticsId) ? {
			type: "gtm",
			containerId: cfg.analyticsId.trim()
		} : { type: "none" };
		default: return { type: "none" };
	}
}
function buildVendorList(cfg) {
	const rows = [{
		id: "emprivacy",
		name: "EmPrivacy consent cookie",
		category: "essential",
		purpose: "Stores your category choices (`emprivacy_cc`) so the banner does not reappear every visit."
	}];
	if (cfg.gateEmbeds) rows.push({
		id: "embeds",
		name: "Third-party embeds (YouTube, Vimeo, social posts, Gists)",
		category: cfg.embedCategory,
		purpose: "Loads official EmDash embed blocks only after this category is allowed. Unknown or unsafe embed URLs are never framed."
	});
	const loader = buildAnalyticsLoader(cfg);
	if (loader.type === "cloudflare") rows.push({
		id: "cloudflare-wa",
		name: "Cloudflare Web Analytics",
		category: "analytics",
		purpose: "Privacy-oriented page analytics via Cloudflare’s beacon after Analytics consent.",
		policyUrl: "https://www.cloudflare.com/privacypolicy/"
	});
	else if (loader.type === "plausible") rows.push({
		id: "plausible",
		name: "Plausible Analytics",
		category: "analytics",
		purpose: "Cookieless first-party analytics loaded after Analytics consent.",
		policyUrl: "https://plausible.io/privacy"
	});
	else if (loader.type === "fathom") rows.push({
		id: "fathom",
		name: "Fathom Analytics",
		category: "analytics",
		purpose: "Privacy-focused analytics loaded after Analytics consent.",
		policyUrl: "https://usefathom.com/privacy"
	});
	else if (loader.type === "umami") rows.push({
		id: "umami",
		name: "Umami",
		category: "analytics",
		purpose: "Self-hosted or Umami Cloud analytics loaded after Analytics consent.",
		policyUrl: "https://umami.is/privacy"
	});
	else if (loader.type === "simpleanalytics") rows.push({
		id: "simpleanalytics",
		name: "Simple Analytics",
		category: "analytics",
		purpose: "Privacy-focused analytics loaded after Analytics consent.",
		policyUrl: "https://www.simpleanalytics.com/privacy-policy"
	});
	else if (loader.type === "ga4") rows.push({
		id: "ga4",
		name: "Google Analytics 4",
		category: "analytics",
		purpose: "Google Analytics loaded after Analytics consent. Enable Google Consent Mode if you also use Google tags.",
		policyUrl: "https://policies.google.com/privacy"
	});
	else if (loader.type === "gtm") rows.push({
		id: "gtm",
		name: "Google Tag Manager",
		category: "marketing",
		purpose: "Loads GTM only after Marketing consent (containers often fire ads/remarketing). You remain responsible for tags inside the container.",
		policyUrl: "https://policies.google.com/privacy"
	});
	else if (loader.type === "custom") for (const [i, script] of loader.scripts.entries()) {
		let host = "custom script";
		try {
			host = new URL(script.src).hostname;
		} catch {}
		rows.push({
			id: `custom-analytics-${i}`,
			name: `Custom analytics (${host})`,
			category: "analytics",
			purpose: "A script URL you configured. Loaded only after Analytics consent."
		});
	}
	for (const [i, src] of cfg.marketingScriptUrls.entries()) {
		let host = "custom script";
		try {
			host = new URL(src).hostname;
		} catch {}
		rows.push({
			id: `marketing-${i}`,
			name: `Marketing script (${host})`,
			category: "marketing",
			purpose: "A marketing or advertising script you configured. Loaded only after Marketing consent."
		});
	}
	if (cfg.googleConsentMode) rows.push({
		id: "gcm",
		name: "Google Consent Mode v2",
		category: "essential",
		purpose: "Sets denied-by-default Google consent signals in the page; updates after the visitor chooses.",
		policyUrl: "https://support.google.com/tagmanager/answer/13695607"
	});
	return rows;
}
//#endregion
//#region src/version.ts
const VERSION = "2.1.0";
//#endregion
//#region src/runtime.ts
/** Soft cap for anonymous consent POSTs per client fingerprint per UTC hour. */
const RECORD_RATE_LIMIT = 30;
const RECORD_LOG_CAP = 500;
const ADMIN_SETTINGS_PATH = "/settings";
const SAVE_ACTION_ID = "emprivacy-save";
const recordInput = z.object({
	policyVersion: z.string().trim().min(1).max(64),
	functional: z.boolean(),
	analytics: z.boolean(),
	marketing: z.boolean()
});
async function loadConfig(ctx) {
	const raw = await ctx.kv.get(KV_KEY);
	if (!raw) return normalizeConfig({});
	try {
		return normalizeConfig(JSON.parse(raw));
	} catch {
		return normalizeConfig({});
	}
}
async function saveConfigString(ctx, json) {
	await ctx.kv.set(KV_KEY, json);
}
function recordPathForSite() {
	return `/_emdash/api/plugins/${PLUGIN_ID}/record`;
}
function absolutePolicyHref(stored, ctx) {
	const r = resolvePolicyHref(stored, ctx).trim();
	if (!r) return null;
	try {
		if (new URL(r).protocol !== "https:") return null;
		return r;
	} catch {
		return null;
	}
}
function clientFingerKey(request) {
	const cf = request.headers.get("cf-connecting-ip")?.trim();
	const xff = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const ua = (request.headers.get("user-agent") ?? "").slice(0, 120);
	return `${cf || xff || "unknown"}|${ua}`;
}
async function hashFinger(s) {
	const data = new TextEncoder().encode(`emprivacy-rl:${s}`);
	const dig = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(dig)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
async function allowRecordWrite(ctx, request) {
	const key = `consent:rl:${rateHourKey()}:${await hashFinger(clientFingerKey(request))}`;
	try {
		const raw = await ctx.kv.get(key);
		const n = raw && /^\d{1,6}$/.test(raw) ? Number(raw) : 0;
		if (n >= RECORD_RATE_LIMIT) return false;
		await ctx.kv.set(key, String(n + 1));
		return true;
	} catch {
		return false;
	}
}
function publicRuntime(cfg, ctx, page) {
	const copy = resolvePublicCopy(cfg, page.locale);
	const hideBanner = cfg.hideBannerOnPolicyPages && isPolicyPagePath(page.path, cfg);
	return {
		bannerTitle: copy.bannerTitle,
		bannerMessage: copy.bannerMessage,
		privacyPolicyUrl: absolutePolicyHref(cfg.privacyPolicyUrl, ctx) ?? "",
		cookiePolicyUrl: cfg.cookiePolicyUrl ? absolutePolicyHref(cfg.cookiePolicyUrl, ctx) ?? "" : "",
		strictDefaults: cfg.strictDefaults,
		policyVersion: cfg.policyVersion,
		googleConsentMode: cfg.googleConsentMode,
		logConsent: cfg.logConsentToServer,
		recordPath: recordPathForSite(),
		embedCategory: cfg.embedCategory,
		gateEmbeds: cfg.gateEmbeds,
		hideBanner,
		theme: cfg.theme,
		ui: copy.ui,
		loader: buildAnalyticsLoader(cfg),
		marketingScripts: cfg.marketingScriptUrls.map((src) => ({
			src,
			integrity: cfg.scriptIntegrity[src] ?? null
		})),
		scriptHostAllowlist: cfg.scriptHostAllowlist,
		scriptIntegrity: cfg.scriptIntegrity,
		cookieMaxAge: cookieMaxAgeSeconds(cfg.cookieMaxAgeDays),
		vendors: buildVendorList(cfg)
	};
}
function themeStyle() {
	return `<style id="emprivacy-style">
#emprivacy-root{font-family:system-ui,sans-serif;font-size:14px;--emprivacy-bg:#111111;--emprivacy-text:#eeeeee;--emprivacy-accent:#3b82f6;--emprivacy-radius:6px}
.emprivacy-bar{position:fixed;z-index:99999;left:0;right:0;bottom:0;background:var(--emprivacy-bg);color:var(--emprivacy-text);padding:16px 20px 20px;box-shadow:0 -4px 24px rgba(0,0,0,.25);max-height:45vh;overflow:auto}
.emprivacy-title{margin:0 0 8px;font-size:1.1rem}
.emprivacy-msg,.emprivacy-note{margin:0 0 10px;line-height:1.4;opacity:.95}
.emprivacy-note{font-size:.85rem}
.emprivacy-links a{color:var(--emprivacy-accent);margin-right:12px}
.emprivacy-opts{margin:10px 0;border-top:1px solid color-mix(in srgb,var(--emprivacy-text) 20%,transparent);padding-top:10px}
.emprivacy-switch{display:block;margin:6px 0}
.emprivacy-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.emprivacy-btn{border-radius:var(--emprivacy-radius);border:1px solid color-mix(in srgb,var(--emprivacy-text) 35%,transparent);background:transparent;color:var(--emprivacy-text);padding:8px 12px;cursor:pointer}
.emprivacy-btn-primary{background:var(--emprivacy-accent);border-color:var(--emprivacy-accent);color:#fff}
.emprivacy-cookie-trigger{position:fixed;z-index:99998;left:16px;bottom:16px;width:48px;height:48px;border-radius:50%;border:1px solid color-mix(in srgb,var(--emprivacy-text) 35%,transparent);background:var(--emprivacy-bg);color:var(--emprivacy-text);box-shadow:0 2px 12px rgba(0,0,0,.2);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center}
.emprivacy-cookie-trigger:hover{filter:brightness(1.1)}
.emprivacy-cookie-trigger:focus{outline:2px solid var(--emprivacy-accent);outline-offset:2px}
.emprivacy-cookie-trigger[hidden]{display:none!important}
.emprivacy-cookie-trigger-icon{font-size:1.35rem;line-height:1}
.emprivacy-bar--reopen{z-index:100000}
.emprivacy-vendors{margin:10px 0 0}
.emprivacy-vendors ul{margin:8px 0 0;padding-left:1.2rem}
</style>`;
}
function createPlugin() {
	return definePlugin({
		id: PLUGIN_ID,
		version: VERSION,
		capabilities: ["hooks.page-fragments:register"],
		storage: { consentEvents: { indexes: ["createdAt", "policyVersion"] } },
		admin: { pages: [{
			path: ADMIN_SETTINGS_PATH,
			label: "EmPrivacy",
			icon: "shield"
		}] },
		hooks: {
			"plugin:install": async (_e, ctx) => {
				if (!await ctx.kv.get("consent:config")) {
					await saveConfigString(ctx, JSON.stringify(normalizeConfig({})));
					ctx.log.info("EmPrivacy: seeded default configuration");
				}
			},
			"page:metadata": { handler: async (_e, ctx) => {
				const cfg = await loadConfig(ctx);
				const out = [];
				const privacyHref = absolutePolicyHref(cfg.privacyPolicyUrl, ctx);
				if (privacyHref) out.push({
					kind: "link",
					rel: "site.standard.document",
					href: privacyHref,
					key: "emprivacy:privacy"
				});
				const cookieHref = cfg.cookiePolicyUrl ? absolutePolicyHref(cfg.cookiePolicyUrl, ctx) : null;
				if (cookieHref) out.push({
					kind: "meta",
					name: "cookie-policy",
					content: cookieHref,
					key: "emprivacy:cookie-meta"
				});
				return out.length ? out : null;
			} },
			"page:fragments": { handler: async (e, ctx) => {
				const cfg = await loadConfig(ctx);
				const pr = publicRuntime(cfg, ctx, e.page);
				const style = {
					kind: "html",
					placement: "body:end",
					key: "emprivacy:style",
					html: themeStyle()
				};
				const shell = {
					kind: "html",
					placement: "body:end",
					key: "emprivacy:shell",
					html: `<div id="emprivacy-root" data-emprivacy="1"></div>`
				};
				const headScripts = [];
				if (cfg.googleConsentMode) headScripts.push({
					kind: "inline-script",
					placement: "head",
					key: "emprivacy:gcm-default",
					code: buildGoogleConsentHeadScript()
				});
				const boot = {
					kind: "inline-script",
					placement: "body:end",
					key: "emprivacy:boot",
					code: buildBodyBootstrap(pr)
				};
				return [
					...headScripts,
					style,
					shell,
					boot
				];
			} }
		},
		routes: {
			admin: { handler: async (ctx) => {
				const interaction = ctx.input;
				if (interaction?.type === "page_load" && interaction.page === ADMIN_SETTINGS_PATH) return buildSettingsPage(ctx);
				if (interaction?.type === "form_submit" && interaction.action_id === SAVE_ACTION_ID) {
					const v = interaction.values ?? {};
					const asBool = (x) => {
						if (x === true) return true;
						if (x === false) return false;
						if (typeof x === "string") return x === "true" || x === "on" || x === "1";
						return Boolean(x);
					};
					try {
						const next = assertValidSavedConfig({
							bannerTitle: String(v.banner_title ?? ""),
							bannerMessage: String(v.banner_message ?? ""),
							privacyPolicyUrl: String(v.privacy_url ?? ""),
							cookiePolicyUrl: String(v.cookie_url ?? ""),
							strictDefaults: asBool(v.strict_defaults),
							policyVersion: String(v.policy_version ?? ""),
							analyticsPlatform: String(v.analytics_platform ?? "cloudflare"),
							cloudflareToken: String(v.cloudflare_token ?? ""),
							analyticsId: String(v.analytics_id ?? ""),
							umamiScriptUrl: String(v.umami_script_url ?? ""),
							analyticsUrlsText: String(v.analytics_urls ?? ""),
							marketingUrlsText: String(v.marketing_urls ?? ""),
							scriptHostAllowlistText: String(v.script_host_allowlist ?? ""),
							cookieMaxAgeDays: String(v.cookie_max_age_days ?? "180"),
							googleConsentMode: asBool(v.google_cm),
							logConsentToServer: asBool(v.log_server),
							embedCategory: String(v.embed_category ?? "marketing"),
							gateEmbeds: asBool(v.gate_embeds),
							hideBannerOnPolicyPages: asBool(v.hide_on_policy),
							defaultLocale: String(v.default_locale ?? "en"),
							localeOverridesText: String(v.locale_overrides ?? ""),
							themeBg: String(v.theme_bg ?? ""),
							themeText: String(v.theme_text ?? ""),
							themeAccent: String(v.theme_accent ?? ""),
							themeRadius: String(v.theme_radius ?? "")
						});
						await saveConfigString(ctx, JSON.stringify(next));
						return {
							...await buildSettingsPage(ctx),
							toast: {
								message: "EmPrivacy settings saved.",
								type: "success"
							}
						};
					} catch (e) {
						const msg = e instanceof Error ? e.message : "Save failed.";
						return {
							...await buildSettingsPage(ctx),
							toast: {
								message: msg,
								type: "error"
							}
						};
					}
				}
				return { blocks: [] };
			} },
			record: {
				public: true,
				input: recordInput,
				handler: async (ctx) => {
					if (ctx.request.method !== "POST") return new Response("method_not_allowed", { status: 405 });
					let expectedOrigin;
					try {
						expectedOrigin = new URL(ctx.url("/")).origin;
					} catch {
						return new Response("bad_request", { status: 400 });
					}
					const csrf = assertSameOriginMutation(ctx.request, expectedOrigin);
					if (csrf) return csrf;
					if (!(ctx.request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return new Response("unsupported_media_type", { status: 415 });
					const cfg = await loadConfig(ctx);
					if (!cfg.logConsentToServer) return {
						ok: false,
						reason: "logging_disabled"
					};
					const input = ctx.input;
					if (input.policyVersion !== cfg.policyVersion) return new Response("policy_version_mismatch", { status: 400 });
					if (!await allowRecordWrite(ctx, ctx.request)) return new Response("rate_limited", { status: 429 });
					const row = {
						createdAt: (/* @__PURE__ */ new Date()).toISOString(),
						policyVersion: input.policyVersion,
						functional: input.functional,
						analytics: input.analytics,
						marketing: input.marketing
					};
					try {
						if ((await ctx.storage.consentEvents.query({
							orderBy: { createdAt: "desc" },
							limit: RECORD_LOG_CAP
						})).items.length >= RECORD_LOG_CAP) return {
							ok: false,
							reason: "log_full"
						};
					} catch {
						return {
							ok: false,
							reason: "storage_unavailable"
						};
					}
					await ctx.storage.consentEvents.put(`${Date.now()}-${Math.random().toString(36).slice(2)}`, row);
					return { ok: true };
				}
			},
			vendors: {
				public: true,
				handler: async (ctx) => {
					if (ctx.request.method !== "GET") return new Response("method_not_allowed", { status: 405 });
					return { vendors: buildVendorList(await loadConfig(ctx)) };
				}
			}
		}
	});
}
async function buildSettingsPage(ctx) {
	const [cfg, latestPublished] = await Promise.all([loadConfig(ctx), fetchLatestPublishedVersion({ fetch: ctx.http?.fetch ?? globalThis.fetch })]);
	const installedVersion = ctx.plugin?.version ?? "2.1.0";
	const analyticsText = cfg.analyticsScriptUrls.map((src) => {
		const i = cfg.scriptIntegrity[src];
		return i ? `${src} ${i}` : src;
	}).join("\n");
	const marketingText = cfg.marketingScriptUrls.map((src) => {
		const i = cfg.scriptIntegrity[src];
		return i ? `${src} ${i}` : src;
	}).join("\n");
	const platform = cfg.analyticsProvider;
	const docsUrl = "https://github.com/EmPlugins/EmPrivacy/blob/main/docs/PLUGIN_SETTINGS.md";
	const vendorFields = buildVendorList(cfg).map((v) => ({
		label: `${v.name} · ${v.category}`,
		value: v.purpose
	}));
	const localeOverridesText = Object.keys(cfg.localeOverrides).length > 0 ? JSON.stringify(cfg.localeOverrides, null, 2) : "";
	const consentFields = await (async () => {
		try {
			return (await ctx.storage.consentEvents.query({
				orderBy: { createdAt: "desc" },
				limit: 15
			})).items.map((item) => {
				const d = item.data;
				const functional = typeof d.functional === "boolean" ? ` · functional ${d.functional ? "on" : "off"}` : "";
				return {
					label: d.createdAt,
					value: `policy ${d.policyVersion}${functional} · analytics ${d.analytics ? "on" : "off"} · marketing ${d.marketing ? "on" : "off"}`
				};
			});
		} catch {
			return [];
		}
	})();
	return { blocks: [
		{
			type: "header",
			text: "EmPrivacy — Cookie & consent"
		},
		{
			type: "fields",
			fields: pluginVersionFields(installedVersion, latestPublished)
		},
		{
			type: "context",
			text: pluginVersionNote(installedVersion, latestPublished)
		},
		{
			type: "context",
			text: `Documentation: ${docsUrl}`
		},
		{
			type: "context",
			text: "This plugin is a technical consent layer, not legal advice and not a privacy-policy generator. You still write and publish the legal pages. EmPrivacy does not scan your theme for leftover trackers, does not geo-locate visitors, and does not block first-party EmDash comments."
		},
		{
			type: "context",
			text: "Privacy / cookie links: use your EmDash **Page** public path (e.g. `/privacy`) or a full `https://…` URL. Banner chrome follows the page locale when a built-in translation exists (en, de, fr, es, it, nl, pt, pl)."
		},
		{ type: "divider" },
		{
			type: "form",
			blockId: "emprivacy-form",
			fields: [
				{
					type: "text_input",
					action_id: "banner_title",
					label: "Banner title (fallback locale)",
					initial_value: cfg.bannerTitle
				},
				{
					type: "text_input",
					action_id: "banner_message",
					label: "Short notice (fallback locale)",
					multiline: true,
					initial_value: cfg.bannerMessage
				},
				{
					type: "text_input",
					action_id: "default_locale",
					label: "Fallback locale code",
					placeholder: "en",
					initial_value: cfg.defaultLocale
				},
				{
					type: "text_input",
					action_id: "locale_overrides",
					label: "Optional title/message translations (JSON)",
					placeholder: "{\"de\":{\"bannerTitle\":\"Cookies & Datenschutz\",\"bannerMessage\":\"…\"}}\n",
					multiline: true,
					initial_value: localeOverridesText
				},
				{
					type: "text_input",
					action_id: "privacy_url",
					label: "Privacy policy — EmDash Page path or https URL",
					placeholder: "/privacy or https://…",
					initial_value: cfg.privacyPolicyUrl
				},
				{
					type: "text_input",
					action_id: "cookie_url",
					label: "Cookie policy (optional) — path or https URL",
					placeholder: "/cookies or https://…",
					initial_value: cfg.cookiePolicyUrl || ""
				},
				{
					type: "text_input",
					action_id: "policy_version",
					label: "Policy / consent version",
					initial_value: cfg.policyVersion
				},
				{
					type: "toggle",
					action_id: "strict_defaults",
					label: "Strict defaults (require opt-in for functional, analytics, and marketing)",
					initial_value: cfg.strictDefaults
				},
				{
					type: "toggle",
					action_id: "hide_on_policy",
					label: "Hide the first-visit banner on privacy and cookie policy pages",
					initial_value: cfg.hideBannerOnPolicyPages
				},
				{
					type: "radio",
					action_id: "analytics_platform",
					label: "Analytics platform",
					options: [
						{
							value: "cloudflare",
							label: "Cloudflare Web Analytics"
						},
						{
							value: "plausible",
							label: "Plausible"
						},
						{
							value: "fathom",
							label: "Fathom"
						},
						{
							value: "umami",
							label: "Umami"
						},
						{
							value: "simpleanalytics",
							label: "Simple Analytics"
						},
						{
							value: "ga4",
							label: "Google Analytics 4"
						},
						{
							value: "gtm",
							label: "Google Tag Manager (requires Marketing consent)"
						},
						{
							value: "none",
							label: "None"
						},
						{
							value: "custom",
							label: "Custom (https script URLs, one per line)"
						}
					],
					initial_value: platform
				},
				{
					type: "text_input",
					action_id: "cloudflare_token",
					label: "Cloudflare Web Analytics site token",
					placeholder: "Token from Web Analytics in the Cloudflare dashboard",
					initial_value: cfg.cloudflareWebAnalyticsToken,
					condition: {
						field: "analytics_platform",
						eq: "cloudflare"
					}
				},
				{
					type: "text_input",
					action_id: "analytics_id",
					label: "Analytics ID (domain, site ID, G-…, or GTM-…)",
					placeholder: "example.com / G-XXXX / GTM-XXXX",
					initial_value: cfg.analyticsId
				},
				{
					type: "text_input",
					action_id: "umami_script_url",
					label: "Umami script URL (https only)",
					placeholder: "https://cloud.umami.is/script.js",
					initial_value: cfg.umamiScriptUrl,
					condition: {
						field: "analytics_platform",
						eq: "umami"
					}
				},
				{
					type: "text_input",
					action_id: "analytics_urls",
					label: "Custom analytics script URLs (one https URL per line; optional trailing SRI: … sha384-…)",
					placeholder: "https://cdn.example/a.js sha384-…",
					multiline: true,
					initial_value: analyticsText,
					condition: {
						field: "analytics_platform",
						eq: "custom"
					}
				},
				{
					type: "text_input",
					action_id: "marketing_urls",
					label: "Marketing script URLs (one https URL per line; optional trailing SRI: … sha384-…)",
					placeholder: "https://… (one per line)",
					multiline: true,
					initial_value: marketingText
				},
				{
					type: "text_input",
					action_id: "script_host_allowlist",
					label: "Script host allowlist (optional; one hostname per line). When set, Custom analytics and marketing URLs must match.",
					placeholder: "cdn.example.com\njs.stripe.com",
					multiline: true,
					initial_value: cfg.scriptHostAllowlist.join("\n")
				},
				{
					type: "text_input",
					action_id: "cookie_max_age_days",
					label: "Consent cookie lifetime (days, 1–365, default 180)",
					placeholder: "180",
					initial_value: String(cfg.cookieMaxAgeDays)
				},
				{
					type: "toggle",
					action_id: "google_cm",
					label: "Google Consent Mode v2 (denied defaults in head; updates after choice)",
					initial_value: cfg.googleConsentMode
				},
				{
					type: "toggle",
					action_id: "gate_embeds",
					label: "Gate official EmDash embed blocks (YouTube, Vimeo, social, Gist)",
					initial_value: cfg.gateEmbeds
				},
				{
					type: "radio",
					action_id: "embed_category",
					label: "Embeds require this category",
					options: [{
						value: "marketing",
						label: "Marketing (recommended for YouTube / social)"
					}, {
						value: "functional",
						label: "Functional"
					}],
					initial_value: cfg.embedCategory
				},
				{
					type: "text_input",
					action_id: "theme_bg",
					label: "Banner background (hex)",
					placeholder: "#111111",
					initial_value: cfg.theme.bg
				},
				{
					type: "text_input",
					action_id: "theme_text",
					label: "Banner text (hex)",
					placeholder: "#eeeeee",
					initial_value: cfg.theme.text
				},
				{
					type: "text_input",
					action_id: "theme_accent",
					label: "Banner accent (hex)",
					placeholder: "#3b82f6",
					initial_value: cfg.theme.accent
				},
				{
					type: "text_input",
					action_id: "theme_radius",
					label: "Banner corner radius (0–24 px)",
					placeholder: "6",
					initial_value: String(cfg.theme.radiusPx)
				},
				{
					type: "toggle",
					action_id: "log_server",
					label: "Log consent choices to the server (minimal record; no IP; rate-limited; Origin/Sec-Fetch-Site required)",
					initial_value: cfg.logConsentToServer
				}
			],
			submit: {
				label: "Save settings",
				action_id: SAVE_ACTION_ID
			}
		},
		{ type: "divider" },
		{
			type: "header",
			text: "What this site uses"
		},
		{
			type: "context",
			text: "Generated from your current settings. Paste this into your cookie policy if you want a living vendor list. Also available at `/_emdash/api/plugins/emprivacy/vendors`. Tokens and script IDs are not included."
		},
		{
			type: "fields",
			fields: vendorFields
		},
		...cfg.logConsentToServer && consentFields.length > 0 ? [
			{ type: "divider" },
			{
				type: "header",
				text: "Recent consent records"
			},
			{
				type: "fields",
				fields: consentFields
			}
		] : []
	] };
}
//#endregion
//#region src/astro/embed-resolve.ts
/**
* Validate official EmDash embed block payloads and produce a first-party
* placeholder plan. Never returns a URL we did not construct or allowlist.
*/
const EMBED_BLOCK_TYPES = [
	"youtube",
	"vimeo",
	"tweet",
	"bluesky",
	"mastodon",
	"linkPreview",
	"gist"
];
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;
const TWEET_ID = /^\d{5,20}$/;
const BSKY_RKEY = /^[a-z0-9]{1,32}$/i;
const BSKY_HANDLE = /^[a-z0-9.-]{1,253}$/i;
const GIST_ID = /^[a-f0-9]{8,64}$/i;
const GIST_USER = /^[A-Za-z0-9-]{1,39}$/;
const YT_HOSTS = /* @__PURE__ */ new Set([
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com",
	"youtu.be",
	"www.youtube-nocookie.com",
	"youtube-nocookie.com"
]);
const VIMEO_HOSTS = /* @__PURE__ */ new Set([
	"vimeo.com",
	"www.vimeo.com",
	"player.vimeo.com"
]);
const TWEET_HOSTS = /* @__PURE__ */ new Set([
	"twitter.com",
	"www.twitter.com",
	"x.com",
	"www.x.com",
	"mobile.twitter.com"
]);
const BSKY_HOSTS = /* @__PURE__ */ new Set(["bsky.app", "www.bsky.app"]);
const GIST_HOSTS = /* @__PURE__ */ new Set(["gist.github.com"]);
const POSTER_HOSTS = /* @__PURE__ */ new Set([
	"i.ytimg.com",
	"img.youtube.com",
	"i.vimeocdn.com"
]);
function hasUnsafeChars(s) {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}
function parseHttpsUrl(raw) {
	const t = raw.trim();
	if (!t || t.length > 2048 || hasUnsafeChars(t)) return null;
	if (/%0d|%0a|%09|%0b|%0c|%20/i.test(t)) return null;
	try {
		const u = new URL(t);
		if (u.protocol !== "https:") return null;
		if (u.username || u.password) return null;
		if (u.hostname === "localhost" || u.hostname.endsWith(".localhost")) return null;
		return u;
	} catch {
		return null;
	}
}
function hostOf(u) {
	return u.hostname.toLowerCase();
}
function youtubeId(raw) {
	const t = raw.trim();
	if (YT_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !YT_HOSTS.has(hostOf(u))) return null;
	if (hostOf(u) === "youtu.be") {
		const id = u.pathname.replace(/^\//, "").split("/")[0] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	const v = u.searchParams.get("v");
	if (v && YT_ID.test(v)) return v;
	const parts = u.pathname.split("/").filter(Boolean);
	const embedIdx = parts.indexOf("embed");
	if (embedIdx >= 0) {
		const id = parts[embedIdx + 1] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	const shortsIdx = parts.indexOf("shorts");
	if (shortsIdx >= 0) {
		const id = parts[shortsIdx + 1] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	return null;
}
function vimeoId(raw) {
	const t = raw.trim();
	if (VIMEO_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !VIMEO_HOSTS.has(hostOf(u))) return null;
	const parts = u.pathname.split("/").filter(Boolean);
	const last = parts[parts.length - 1] ?? "";
	const videoIdx = parts.indexOf("video");
	if (videoIdx >= 0) {
		const id = parts[videoIdx + 1] ?? "";
		return VIMEO_ID.test(id) ? id : null;
	}
	return VIMEO_ID.test(last) ? last : null;
}
function tweetId(raw) {
	const t = raw.trim();
	if (TWEET_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !TWEET_HOSTS.has(hostOf(u))) return null;
	return /\/status(?:es)?\/(\d{5,20})(?:\/|$)/i.exec(u.pathname)?.[1] ?? null;
}
function blueskyHref(raw) {
	const u = parseHttpsUrl(raw);
	if (!u || !BSKY_HOSTS.has(hostOf(u))) return null;
	const m = /^\/profile\/([^/]+)\/post\/([^/]+)\/?$/.exec(u.pathname);
	if (!m) return null;
	const handle = m[1] ?? "";
	const rkey = m[2] ?? "";
	if (!BSKY_HANDLE.test(handle) || !BSKY_RKEY.test(rkey)) return null;
	return `https://bsky.app/profile/${handle}/post/${rkey}`;
}
function gistHref(raw) {
	const u = parseHttpsUrl(raw);
	if (!u || !GIST_HOSTS.has(hostOf(u))) return null;
	const parts = u.pathname.split("/").filter(Boolean);
	if (parts.length < 2) return null;
	const user = parts[0] ?? "";
	const id = (parts[1] ?? "").replace(/\.js$/i, "");
	if (!GIST_USER.test(user) || !GIST_ID.test(id)) return null;
	return `https://gist.github.com/${user}/${id}`;
}
function mastodonHref(raw) {
	const u = parseHttpsUrl(raw);
	if (!u) return null;
	if (!/^\/@[^/]+\/\d+\/?$/.test(u.pathname) && !/^\/users\/[^/]+\/statuses\/\d+\/?$/.test(u.pathname)) return null;
	return `https://${hostOf(u)}${u.pathname.replace(/\/$/, "")}`;
}
function posterUrl(raw, kind, mediaId) {
	if (kind === "youtube" && mediaId && YT_ID.test(mediaId)) return `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`;
	if (typeof raw !== "string") return null;
	const u = parseHttpsUrl(raw);
	if (!u || !POSTER_HOSTS.has(hostOf(u))) return null;
	return u.href;
}
function isEmbedBlockType(s) {
	return EMBED_BLOCK_TYPES.includes(s);
}
function resolveEmbed(node) {
	if (!node || typeof node._type !== "string" || !isEmbedBlockType(node._type)) return null;
	if (typeof node.id !== "string") return null;
	const kind = node._type;
	const rawId = node.id.trim();
	if (!rawId || rawId.length > 2048) return null;
	if (kind === "youtube") {
		const id = youtubeId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "iframe",
			src: `https://www.youtube-nocookie.com/embed/${id}`,
			label: "YouTube",
			poster: posterUrl(node.poster, kind, id)
		};
	}
	if (kind === "vimeo") {
		const id = vimeoId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "iframe",
			src: `https://player.vimeo.com/video/${id}`,
			label: "Vimeo",
			poster: posterUrl(node.poster, kind, id)
		};
	}
	if (kind === "tweet") {
		const id = tweetId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "link",
			src: `https://x.com/i/web/status/${id}`,
			label: "Post on X",
			poster: null
		};
	}
	if (kind === "bluesky") {
		const href = blueskyHref(rawId);
		if (!href) return null;
		return {
			kind,
			mode: "link",
			src: href,
			label: "Bluesky post",
			poster: null
		};
	}
	if (kind === "mastodon") {
		const href = mastodonHref(rawId);
		if (!href) return null;
		return {
			kind,
			mode: "link",
			src: href,
			label: "Mastodon post",
			poster: null
		};
	}
	if (kind === "gist") {
		const href = gistHref(rawId);
		if (!href) return null;
		return {
			kind,
			mode: "link",
			src: href,
			label: "GitHub Gist",
			poster: null
		};
	}
	const href = parseHttpsUrl(rawId);
	if (!href) return null;
	return {
		kind: "linkPreview",
		mode: "link",
		src: href.href,
		label: href.hostname,
		poster: null
	};
}
//#endregion
//#region src/index.ts
var src_default = createPlugin;
/**
* EmDash native plugin descriptor — add to `plugins: []` in `emdash({ ... })` inside `astro.config`.
*
* EmPrivacy uses `page:fragments` (banner + consent scripts) and optional Portable Text
* embed placeholders, which only run for **native** plugins in `plugins: []`.
* Do not place this descriptor in `sandboxed: []`.
*/
function emprivacyPlugin() {
	return {
		id: PLUGIN_ID,
		version: VERSION,
		format: "native",
		entrypoint: "@emplugins/emprivacy",
		componentsEntry: "@emplugins/emprivacy/astro",
		adminPages: [{
			path: "/settings",
			label: "EmPrivacy",
			icon: "shield"
		}]
	};
}
//#endregion
export { COOKIE_NAME, DEFAULT_CONFIG, EMBED_BLOCK_TYPES, KV_KEY, assertValidCloudflareToken, buildAnalyticsLoader, buildVendorList, createPlugin, src_default as default, emprivacyPlugin, isPolicyPagePath, isRootRelativeSitePath, isValidPolicyHrefInput, normalizeConfig, resolveEmbed, resolvePolicyHref };
