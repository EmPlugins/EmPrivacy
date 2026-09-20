// SPDX-License-Identifier: MIT

import { definePlugin } from "emdash";
import type {
	PageFragmentContribution,
	PageFragmentEvent,
	PageMetadataContribution,
	PageMetadataEvent,
	PluginContext,
	RouteContext,
} from "emdash";
import { z } from "zod";

import {
	assertValidSavedConfig,
	type EmprivacyConfig,
	isPolicyPagePath,
	KV_KEY,
	normalizeConfig,
	PLUGIN_ID,
	type EmprivacyPublicRuntimeConfig,
	type ConsentRecordPayload,
	resolvePolicyHref,
	resolvePublicCopy,
} from "./config.js";
import {
	fetchLatestPublishedVersion,
	pluginVersionFields,
	pluginVersionNote,
} from "./npm-version.js";
import { buildBodyBootstrap, buildGoogleConsentHeadScript } from "./public-bootstrap.js";
import {
	assertSameOriginMutation,
	cookieMaxAgeSeconds,
	rateHourKey,
} from "./security.js";
import { buildAnalyticsLoader, buildVendorList } from "./vendors.js";
import { VERSION } from "./version.js";

/** Soft cap for anonymous consent POSTs per client fingerprint per UTC hour. */
const RECORD_RATE_LIMIT = 30;
const RECORD_LOG_CAP = 500;

const ADMIN_SETTINGS_PATH = "/settings";
const SAVE_ACTION_ID = "emprivacy-save";

const recordInput = z.object({
	policyVersion: z.string().trim().min(1).max(64),
	functional: z.boolean(),
	analytics: z.boolean(),
	marketing: z.boolean(),
});

async function loadConfig(ctx: PluginContext): Promise<EmprivacyConfig> {
	const raw = (await ctx.kv.get(KV_KEY)) as string | null;
	if (!raw) return normalizeConfig({});
	try {
		return normalizeConfig(JSON.parse(raw));
	} catch {
		return normalizeConfig({});
	}
}

async function saveConfigString(ctx: PluginContext, json: string): Promise<void> {
	await ctx.kv.set(KV_KEY, json);
}

function recordPathForSite(): string {
	return `/_emdash/api/plugins/${PLUGIN_ID}/record`;
}

function absolutePolicyHref(stored: string, ctx: PluginContext): string | null {
	const r = resolvePolicyHref(stored, ctx).trim();
	if (!r) return null;
	try {
		const u = new URL(r);
		if (u.protocol !== "https:") return null;
		return r;
	} catch {
		return null;
	}
}

function clientFingerKey(request: Request): string {
	const cf = request.headers.get("cf-connecting-ip")?.trim();
	const xff = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const ua = (request.headers.get("user-agent") ?? "").slice(0, 120);
	return `${cf || xff || "unknown"}|${ua}`;
}

async function hashFinger(s: string): Promise<string> {
	const data = new TextEncoder().encode(`emprivacy-rl:${s}`);
	const dig = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(dig))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
		.slice(0, 32);
}

async function allowRecordWrite(ctx: PluginContext, request: Request): Promise<boolean> {
	const key = `consent:rl:${rateHourKey()}:${await hashFinger(clientFingerKey(request))}`;
	try {
		const raw = (await ctx.kv.get(key)) as string | null;
		const n = raw && /^\d{1,6}$/.test(raw) ? Number(raw) : 0;
		if (n >= RECORD_RATE_LIMIT) return false;
		await ctx.kv.set(key, String(n + 1));
		return true;
	} catch {
		return false;
	}
}

function publicRuntime(
	cfg: EmprivacyConfig,
	ctx: PluginContext,
	page: { locale: string | null; path: string },
): EmprivacyPublicRuntimeConfig {
	const copy = resolvePublicCopy(cfg, page.locale);
	const hideBanner = cfg.hideBannerOnPolicyPages && isPolicyPagePath(page.path, cfg);
	return {
		bannerTitle: copy.bannerTitle,
		bannerMessage: copy.bannerMessage,
		privacyPolicyUrl: absolutePolicyHref(cfg.privacyPolicyUrl, ctx) ?? "",
		cookiePolicyUrl: cfg.cookiePolicyUrl ? (absolutePolicyHref(cfg.cookiePolicyUrl, ctx) ?? "") : "",
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
			integrity: cfg.scriptIntegrity[src] ?? null,
		})),
		scriptHostAllowlist: cfg.scriptHostAllowlist,
		scriptIntegrity: cfg.scriptIntegrity,
		cookieMaxAge: cookieMaxAgeSeconds(cfg.cookieMaxAgeDays),
		vendors: buildVendorList(cfg),
	};
}

function themeStyle(): string {
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

export function createPlugin() {
	return definePlugin({
		id: PLUGIN_ID,
		version: VERSION,
		capabilities: ["hooks.page-fragments:register"],
		storage: {
			consentEvents: { indexes: ["createdAt", "policyVersion"] },
		},
		admin: {
			pages: [
				{
					path: ADMIN_SETTINGS_PATH,
					label: "EmPrivacy",
					icon: "shield",
				},
			],
		},
		hooks: {
			"plugin:install": async (_e: unknown, ctx: PluginContext) => {
				const existing = (await ctx.kv.get(KV_KEY)) as string | null;
				if (!existing) {
					await saveConfigString(ctx, JSON.stringify(normalizeConfig({})));
					ctx.log.info("EmPrivacy: seeded default configuration");
				}
			},
			"page:metadata": {
				handler: async (
					_e: PageMetadataEvent,
					ctx: PluginContext,
				): Promise<PageMetadataContribution | PageMetadataContribution[] | null> => {
					const cfg = await loadConfig(ctx);
					const out: PageMetadataContribution[] = [];
					const privacyHref = absolutePolicyHref(cfg.privacyPolicyUrl, ctx);
					if (privacyHref) {
						out.push({
							kind: "link",
							rel: "site.standard.document",
							href: privacyHref,
							key: "emprivacy:privacy",
						});
					}
					const cookieHref = cfg.cookiePolicyUrl
						? absolutePolicyHref(cfg.cookiePolicyUrl, ctx)
						: null;
					if (cookieHref) {
						out.push({
							kind: "meta",
							name: "cookie-policy",
							content: cookieHref,
							key: "emprivacy:cookie-meta",
						});
					}
					return out.length ? out : null;
				},
			},
			"page:fragments": {
				handler: async (
					e: PageFragmentEvent,
					ctx: PluginContext,
				): Promise<PageFragmentContribution | PageFragmentContribution[] | null> => {
					const cfg = await loadConfig(ctx);
					const pr = publicRuntime(cfg, ctx, e.page);
					const style: PageFragmentContribution = {
						kind: "html",
						placement: "body:end",
						key: "emprivacy:style",
						html: themeStyle(),
					};
					const shell: PageFragmentContribution = {
						kind: "html",
						placement: "body:end",
						key: "emprivacy:shell",
						html: `<div id="emprivacy-root" data-emprivacy="1"></div>`,
					};
					const headScripts: PageFragmentContribution[] = [];
					if (cfg.googleConsentMode) {
						headScripts.push({
							kind: "inline-script",
							placement: "head",
							key: "emprivacy:gcm-default",
							code: buildGoogleConsentHeadScript(),
						});
					}
					const boot: PageFragmentContribution = {
						kind: "inline-script",
						placement: "body:end",
						key: "emprivacy:boot",
						code: buildBodyBootstrap(pr),
					};
					return [...headScripts, style, shell, boot];
				},
			},
		},
		routes: {
			admin: {
				handler: async (ctx: RouteContext) => {
					const interaction = ctx.input as
						| { type: string; page?: string; action_id?: string; values?: Record<string, unknown> }
						| undefined;

					if (interaction?.type === "page_load" && interaction.page === ADMIN_SETTINGS_PATH) {
						return buildSettingsPage(ctx);
					}
					if (interaction?.type === "form_submit" && interaction.action_id === SAVE_ACTION_ID) {
						const v = interaction.values ?? {};
						const asBool = (x: unknown) => {
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
								themeRadius: String(v.theme_radius ?? ""),
							});
							await saveConfigString(ctx, JSON.stringify(next));
							const page = await buildSettingsPage(ctx);
							return {
								...page,
								toast: { message: "EmPrivacy settings saved.", type: "success" },
							};
						} catch (e) {
							const msg = e instanceof Error ? e.message : "Save failed.";
							const page = await buildSettingsPage(ctx);
							return {
								...page,
								toast: { message: msg, type: "error" },
							};
						}
					}

					return { blocks: [] };
				},
			},
			record: {
				public: true,
				input: recordInput,
				handler: async (ctx: RouteContext) => {
					if (ctx.request.method !== "POST") {
						return new Response("method_not_allowed", { status: 405 });
					}
					let expectedOrigin: string;
					try {
						expectedOrigin = new URL(ctx.url("/")).origin;
					} catch {
						return new Response("bad_request", { status: 400 });
					}
					const csrf = assertSameOriginMutation(ctx.request, expectedOrigin);
					if (csrf) return csrf;

					const ct = ctx.request.headers.get("content-type") ?? "";
					if (!ct.toLowerCase().includes("application/json")) {
						return new Response("unsupported_media_type", { status: 415 });
					}

					const cfg = await loadConfig(ctx);
					if (!cfg.logConsentToServer) {
						return { ok: false, reason: "logging_disabled" };
					}
					const input = ctx.input as z.infer<typeof recordInput>;
					if (input.policyVersion !== cfg.policyVersion) {
						return new Response("policy_version_mismatch", { status: 400 });
					}
					if (!(await allowRecordWrite(ctx, ctx.request))) {
						return new Response("rate_limited", { status: 429 });
					}
					const row: ConsentRecordPayload = {
						createdAt: new Date().toISOString(),
						policyVersion: input.policyVersion,
						functional: input.functional,
						analytics: input.analytics,
						marketing: input.marketing,
					};
					try {
						const existing = await ctx.storage.consentEvents.query({
							orderBy: { createdAt: "desc" },
							limit: RECORD_LOG_CAP,
						});
						if (existing.items.length >= RECORD_LOG_CAP) {
							return { ok: false, reason: "log_full" };
						}
					} catch {
						// Fail closed: never unbounded-write when capacity cannot be checked.
						return { ok: false, reason: "storage_unavailable" };
					}
					await ctx.storage.consentEvents.put(
						`${Date.now()}-${Math.random().toString(36).slice(2)}`,
						row,
					);
					return { ok: true };
				},
			},
			vendors: {
				public: true,
				handler: async (ctx: RouteContext) => {
					if (ctx.request.method !== "GET") {
						return new Response("method_not_allowed", { status: 405 });
					}
					const cfg = await loadConfig(ctx);
					return { vendors: buildVendorList(cfg) };
				},
			},
		},
	});
}

export default createPlugin;

async function buildSettingsPage(ctx: PluginContext) {
	const [cfg, latestPublished] = await Promise.all([
		loadConfig(ctx),
		fetchLatestPublishedVersion({
			fetch: ctx.http?.fetch ?? globalThis.fetch,
		}),
	]);
	const installedVersion = ctx.plugin?.version ?? VERSION;
	const analyticsText = cfg.analyticsScriptUrls
		.map((src) => {
			const i = cfg.scriptIntegrity[src];
			return i ? `${src} ${i}` : src;
		})
		.join("\n");
	const marketingText = cfg.marketingScriptUrls
		.map((src) => {
			const i = cfg.scriptIntegrity[src];
			return i ? `${src} ${i}` : src;
		})
		.join("\n");
	const platform = cfg.analyticsProvider;
	const docsUrl = "https://github.com/EmPlugins/EmPrivacy/blob/main/docs/PLUGIN_SETTINGS.md";
	const vendorFields = buildVendorList(cfg).map((v) => ({
		label: `${v.name} · ${v.category}`,
		value: v.purpose,
	}));
	const localeOverridesText =
		Object.keys(cfg.localeOverrides).length > 0
			? JSON.stringify(cfg.localeOverrides, null, 2)
			: "";

	const consentFields = await (async () => {
		try {
			const r = await ctx.storage.consentEvents.query({
				orderBy: { createdAt: "desc" },
				limit: 15,
			});
			return r.items.map((item) => {
				const d = item.data as ConsentRecordPayload;
				const functional =
					typeof d.functional === "boolean" ? ` · functional ${d.functional ? "on" : "off"}` : "";
				return {
					label: d.createdAt,
					value: `policy ${d.policyVersion}${functional} · analytics ${d.analytics ? "on" : "off"} · marketing ${d.marketing ? "on" : "off"}`,
				};
			});
		} catch {
			return [] as { label: string; value: string }[];
		}
	})();

	return {
		blocks: [
			{
				type: "header" as const,
				text: "EmPrivacy — Cookie & consent",
			},
			{
				type: "fields" as const,
				fields: pluginVersionFields(installedVersion, latestPublished),
			},
			{
				type: "context" as const,
				text: pluginVersionNote(installedVersion, latestPublished),
			},
			{
				type: "context" as const,
				text: `Documentation: ${docsUrl}`,
			},
			{
				type: "context" as const,
				text: "This plugin is a technical consent layer, not legal advice and not a privacy-policy generator. You still write and publish the legal pages. EmPrivacy does not scan your theme for leftover trackers, does not geo-locate visitors, and does not block first-party EmDash comments.",
			},
			{
				type: "context" as const,
				text: "Privacy / cookie links: use your EmDash **Page** public path (e.g. `/privacy`) or a full `https://…` URL. Banner chrome follows the page locale when a built-in translation exists (en, de, fr, es, it, nl, pt, pl).",
			},
			{ type: "divider" as const },
			{
				type: "form" as const,
				blockId: "emprivacy-form",
				fields: [
					{
						type: "text_input" as const,
						action_id: "banner_title",
						label: "Banner title (fallback locale)",
						initial_value: cfg.bannerTitle,
					},
					{
						type: "text_input" as const,
						action_id: "banner_message",
						label: "Short notice (fallback locale)",
						multiline: true,
						initial_value: cfg.bannerMessage,
					},
					{
						type: "text_input" as const,
						action_id: "default_locale",
						label: "Fallback locale code",
						placeholder: "en",
						initial_value: cfg.defaultLocale,
					},
					{
						type: "text_input" as const,
						action_id: "locale_overrides",
						label: "Optional title/message translations (JSON)",
						placeholder: '{"de":{"bannerTitle":"Cookies & Datenschutz","bannerMessage":"…"}}\n',
						multiline: true,
						initial_value: localeOverridesText,
					},
					{
						type: "text_input" as const,
						action_id: "privacy_url",
						label: "Privacy policy — EmDash Page path or https URL",
						placeholder: "/privacy or https://…",
						initial_value: cfg.privacyPolicyUrl,
					},
					{
						type: "text_input" as const,
						action_id: "cookie_url",
						label: "Cookie policy (optional) — path or https URL",
						placeholder: "/cookies or https://…",
						initial_value: cfg.cookiePolicyUrl || "",
					},
					{
						type: "text_input" as const,
						action_id: "policy_version",
						label: "Policy / consent version",
						initial_value: cfg.policyVersion,
					},
					{
						type: "toggle" as const,
						action_id: "strict_defaults",
						label: "Strict defaults (require opt-in for functional, analytics, and marketing)",
						initial_value: cfg.strictDefaults,
					},
					{
						type: "toggle" as const,
						action_id: "hide_on_policy",
						label: "Hide the first-visit banner on privacy and cookie policy pages",
						initial_value: cfg.hideBannerOnPolicyPages,
					},
					{
						type: "radio" as const,
						action_id: "analytics_platform",
						label: "Analytics platform",
						options: [
							{ value: "cloudflare", label: "Cloudflare Web Analytics" },
							{ value: "plausible", label: "Plausible" },
							{ value: "fathom", label: "Fathom" },
							{ value: "umami", label: "Umami" },
							{ value: "simpleanalytics", label: "Simple Analytics" },
							{ value: "ga4", label: "Google Analytics 4" },
							{ value: "gtm", label: "Google Tag Manager (requires Marketing consent)" },
							{ value: "none", label: "None" },
							{ value: "custom", label: "Custom (https script URLs, one per line)" },
						],
						initial_value: platform,
					},
					{
						type: "text_input" as const,
						action_id: "cloudflare_token",
						label: "Cloudflare Web Analytics site token",
						placeholder: "Token from Web Analytics in the Cloudflare dashboard",
						initial_value: cfg.cloudflareWebAnalyticsToken,
						condition: { field: "analytics_platform", eq: "cloudflare" },
					},
					{
						type: "text_input" as const,
						action_id: "analytics_id",
						label: "Analytics ID (domain, site ID, G-…, or GTM-…)",
						placeholder: "example.com / G-XXXX / GTM-XXXX",
						initial_value: cfg.analyticsId,
					},
					{
						type: "text_input" as const,
						action_id: "umami_script_url",
						label: "Umami script URL (https only)",
						placeholder: "https://cloud.umami.is/script.js",
						initial_value: cfg.umamiScriptUrl,
						condition: { field: "analytics_platform", eq: "umami" },
					},
					{
						type: "text_input" as const,
						action_id: "analytics_urls",
						label:
							"Custom analytics script URLs (one https URL per line; optional trailing SRI: … sha384-…)",
						placeholder: "https://cdn.example/a.js sha384-…",
						multiline: true,
						initial_value: analyticsText,
						condition: { field: "analytics_platform", eq: "custom" },
					},
					{
						type: "text_input" as const,
						action_id: "marketing_urls",
						label:
							"Marketing script URLs (one https URL per line; optional trailing SRI: … sha384-…)",
						placeholder: "https://… (one per line)",
						multiline: true,
						initial_value: marketingText,
					},
					{
						type: "text_input" as const,
						action_id: "script_host_allowlist",
						label:
							"Script host allowlist (optional; one hostname per line). When set, Custom analytics and marketing URLs must match.",
						placeholder: "cdn.example.com\njs.stripe.com",
						multiline: true,
						initial_value: cfg.scriptHostAllowlist.join("\n"),
					},
					{
						type: "text_input" as const,
						action_id: "cookie_max_age_days",
						label: "Consent cookie lifetime (days, 1–365, default 180)",
						placeholder: "180",
						initial_value: String(cfg.cookieMaxAgeDays),
					},
					{
						type: "toggle" as const,
						action_id: "google_cm",
						label: "Google Consent Mode v2 (denied defaults in head; updates after choice)",
						initial_value: cfg.googleConsentMode,
					},
					{
						type: "toggle" as const,
						action_id: "gate_embeds",
						label: "Gate official EmDash embed blocks (YouTube, Vimeo, social, Gist)",
						initial_value: cfg.gateEmbeds,
					},
					{
						type: "radio" as const,
						action_id: "embed_category",
						label: "Embeds require this category",
						options: [
							{ value: "marketing", label: "Marketing (recommended for YouTube / social)" },
							{ value: "functional", label: "Functional" },
						],
						initial_value: cfg.embedCategory,
					},
					{
						type: "text_input" as const,
						action_id: "theme_bg",
						label: "Banner background (hex)",
						placeholder: "#111111",
						initial_value: cfg.theme.bg,
					},
					{
						type: "text_input" as const,
						action_id: "theme_text",
						label: "Banner text (hex)",
						placeholder: "#eeeeee",
						initial_value: cfg.theme.text,
					},
					{
						type: "text_input" as const,
						action_id: "theme_accent",
						label: "Banner accent (hex)",
						placeholder: "#3b82f6",
						initial_value: cfg.theme.accent,
					},
					{
						type: "text_input" as const,
						action_id: "theme_radius",
						label: "Banner corner radius (0–24 px)",
						placeholder: "6",
						initial_value: String(cfg.theme.radiusPx),
					},
					{
						type: "toggle" as const,
						action_id: "log_server",
						label: "Log consent choices to the server (minimal record; no IP; rate-limited; Origin/Sec-Fetch-Site required)",
						initial_value: cfg.logConsentToServer,
					},
				],
				submit: { label: "Save settings", action_id: SAVE_ACTION_ID },
			},
			{ type: "divider" as const },
			{
				type: "header" as const,
				text: "What this site uses",
			},
			{
				type: "context" as const,
				text: "Generated from your current settings. Paste this into your cookie policy if you want a living vendor list. Also available at `/_emdash/api/plugins/emprivacy/vendors`. Tokens and script IDs are not included.",
			},
			{
				type: "fields" as const,
				fields: vendorFields,
			},
			...(cfg.logConsentToServer && consentFields.length > 0
				? [
						{ type: "divider" as const },
						{
							type: "header" as const,
							text: "Recent consent records",
						},
						{
							type: "fields" as const,
							fields: consentFields,
						},
					]
				: []),
		],
	};
}
