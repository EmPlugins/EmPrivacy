// SPDX-License-Identifier: MIT

import type { AnalyticsProvider, EmprivacyConfig } from "./config.js";
import { isClarityId, isFathomId, isGa4Id, isGtmId, isHostname, isUetId, isUmamiId } from "./ids.js";
import { isPublishableCustomScript, isScriptHostAllowed } from "./security.js";

export type ConsentCategory = "essential" | "functional" | "analytics" | "marketing";

export interface VendorRow {
	id: string;
	name: string;
	category: ConsentCategory;
	purpose: string;
	/** First-party docs we control the URL for — never taken from admin HTML */
	policyUrl?: string;
}

export type AnalyticsLoader =
	| { type: "none" }
	| { type: "cloudflare"; token: string }
	| { type: "custom"; scripts: { src: string; integrity: string | null }[] }
	| { type: "plausible"; src: string; domain: string }
	| { type: "fathom"; src: string; siteId: string }
	| { type: "umami"; src: string; websiteId: string }
	| { type: "simpleanalytics"; src: string }
	| { type: "ga4"; measurementId: string }
	/** Loaded only after Marketing consent — GTM can fire advertising tags. */
	| { type: "gtm"; containerId: string }
	/** Loaded only after Analytics consent. Advertising storage follows Marketing. */
	| { type: "clarity"; projectId: string }
	/** Loaded only after Marketing consent. */
	| { type: "uet"; tagId: string };

const PLAUSIBLE_SCRIPT = "https://plausible.io/js/script.js";
const FATHOM_SCRIPT = "https://cdn.usefathom.com/script.js";
const SIMPLE_SCRIPT = "https://scripts.simpleanalyticscdn.com/latest.js";

export { isClarityId, isFathomId, isGa4Id, isGtmId, isHostname, isUetId, isUmamiId } from "./ids.js";

export function analyticsIdLabel(provider: AnalyticsProvider): string {
	switch (provider) {
		case "plausible":
			return "Plausible domain (example.com)";
		case "fathom":
			return "Fathom site ID";
		case "umami":
			return "Umami website ID";
		case "simpleanalytics":
			return "Simple Analytics hostname (optional)";
		case "ga4":
			return "GA4 measurement ID (G-…)";
		case "gtm":
			return "Google Tag Manager ID (GTM-…)";
		case "clarity":
			return "Microsoft Clarity project ID";
		case "uet":
			return "Microsoft UET tag ID";
		default:
			return "Analytics ID";
	}
}

export function buildAnalyticsLoader(cfg: EmprivacyConfig): AnalyticsLoader {
	switch (cfg.analyticsProvider) {
		case "none":
			return { type: "none" };
		case "cloudflare":
			return cfg.cloudflareWebAnalyticsToken
				? { type: "cloudflare", token: cfg.cloudflareWebAnalyticsToken }
				: { type: "none" };
		case "custom": {
			const scripts = cfg.analyticsScriptUrls
				.filter((src) => isPublishableCustomScript(src, cfg.scriptIntegrity[src], cfg.scriptHostAllowlist))
				.map((src) => ({ src, integrity: cfg.scriptIntegrity[src] ?? null }));
			return scripts.length ? { type: "custom", scripts } : { type: "none" };
		}
		case "plausible":
			return isHostname(cfg.analyticsId)
				? { type: "plausible", src: PLAUSIBLE_SCRIPT, domain: cfg.analyticsId.trim().toLowerCase() }
				: { type: "none" };
		case "fathom":
			return isFathomId(cfg.analyticsId)
				? { type: "fathom", src: FATHOM_SCRIPT, siteId: cfg.analyticsId.trim() }
				: { type: "none" };
		case "umami":
			return isUmamiId(cfg.analyticsId) &&
				cfg.umamiScriptUrl &&
				isScriptHostAllowed(cfg.umamiScriptUrl, {
					allowlist: cfg.scriptHostAllowlist,
					allowPresets: false,
				})
				? { type: "umami", src: cfg.umamiScriptUrl, websiteId: cfg.analyticsId.trim() }
				: { type: "none" };
		case "simpleanalytics":
			return { type: "simpleanalytics", src: SIMPLE_SCRIPT };
		case "ga4":
			return isGa4Id(cfg.analyticsId) ? { type: "ga4", measurementId: cfg.analyticsId.trim() } : { type: "none" };
		case "gtm":
			return isGtmId(cfg.analyticsId) ? { type: "gtm", containerId: cfg.analyticsId.trim() } : { type: "none" };
		case "clarity":
			return isClarityId(cfg.analyticsId)
				? { type: "clarity", projectId: cfg.analyticsId.trim() }
				: { type: "none" };
		case "uet":
			return isUetId(cfg.analyticsId) ? { type: "uet", tagId: cfg.analyticsId.trim() } : { type: "none" };
		default:
			return { type: "none" };
	}
}

export function buildVendorList(cfg: EmprivacyConfig): VendorRow[] {
	const rows: VendorRow[] = [
		{
			id: "emprivacy",
			name: "EmPrivacy consent cookie",
			category: "essential",
			purpose: "Stores your category choices (`emprivacy_cc`) so the banner does not reappear every visit.",
		},
	];

	if (cfg.gateEmbeds) {
		rows.push({
			id: "embeds",
			name: "Third-party embeds (YouTube, Vimeo, social posts, Gists)",
			category: cfg.embedCategory,
			purpose: "Loads official EmDash embed blocks only after this category is allowed. Unknown or unsafe embed URLs are never framed.",
		});
	}

	const loader = buildAnalyticsLoader(cfg);
	if (loader.type === "cloudflare") {
		rows.push({
			id: "cloudflare-wa",
			name: "Cloudflare Web Analytics",
			category: "analytics",
			purpose: "Privacy-oriented page analytics via Cloudflare’s beacon after Analytics consent.",
			policyUrl: "https://www.cloudflare.com/privacypolicy/",
		});
	} else if (loader.type === "plausible") {
		rows.push({
			id: "plausible",
			name: "Plausible Analytics",
			category: "analytics",
			purpose: "Cookieless first-party analytics loaded after Analytics consent.",
			policyUrl: "https://plausible.io/privacy",
		});
	} else if (loader.type === "fathom") {
		rows.push({
			id: "fathom",
			name: "Fathom Analytics",
			category: "analytics",
			purpose: "Privacy-focused analytics loaded after Analytics consent.",
			policyUrl: "https://usefathom.com/privacy",
		});
	} else if (loader.type === "umami") {
		rows.push({
			id: "umami",
			name: "Umami",
			category: "analytics",
			purpose: "Self-hosted or Umami Cloud analytics loaded after Analytics consent.",
			policyUrl: "https://umami.is/privacy",
		});
	} else if (loader.type === "simpleanalytics") {
		rows.push({
			id: "simpleanalytics",
			name: "Simple Analytics",
			category: "analytics",
			purpose: "Privacy-focused analytics loaded after Analytics consent.",
			policyUrl: "https://www.simpleanalytics.com/privacy-policy",
		});
	} else if (loader.type === "ga4") {
		rows.push({
			id: "ga4",
			name: "Google Analytics 4",
			category: "analytics",
			purpose: "Google Analytics loaded after Analytics consent. Enable Google Consent Mode if you also use Google tags.",
			policyUrl: "https://policies.google.com/privacy",
		});
	} else if (loader.type === "gtm") {
		rows.push({
			id: "gtm",
			name: "Google Tag Manager",
			category: "marketing",
			purpose:
				"Loads GTM only after Marketing consent (containers often fire ads/remarketing). You remain responsible for tags inside the container.",
			policyUrl: "https://policies.google.com/privacy",
		});
	} else if (loader.type === "clarity") {
		rows.push({
			id: "clarity",
			name: "Microsoft Clarity",
			category: "analytics",
			purpose:
				"Clarity loads only after Analytics consent. Advertising storage stays denied until Marketing is also allowed. The project ID is not shown here.",
			policyUrl: "https://www.microsoft.com/privacy",
		});
	} else if (loader.type === "uet") {
		rows.push({
			id: "uet",
			name: "Microsoft Advertising (UET)",
			category: "marketing",
			purpose:
				"The UET tag loads only after Marketing consent. Until then, advertising storage stays denied and the tag is not injected.",
			policyUrl: "https://www.microsoft.com/privacy",
		});
	} else if (loader.type === "custom") {
		for (const [i, script] of loader.scripts.entries()) {
			let host = "custom script";
			try {
				host = new URL(script.src).hostname;
			} catch {
				/* keep fallback */
			}
			rows.push({
				id: `custom-analytics-${i}`,
				name: `Custom analytics (${host})`,
				category: "analytics",
				purpose: "A script URL you configured. Loaded only after Analytics consent.",
			});
		}
	}

	for (const [i, src] of cfg.marketingScriptUrls.entries()) {
		let host = "custom script";
		try {
			host = new URL(src).hostname;
		} catch {
			/* keep fallback */
		}
		rows.push({
			id: `marketing-${i}`,
			name: `Marketing script (${host})`,
			category: "marketing",
			purpose: "A marketing or advertising script you configured. Loaded only after Marketing consent.",
		});
	}

	if (cfg.googleConsentMode) {
		rows.push({
			id: "gcm",
			name: "Google Consent Mode v2",
			category: "essential",
			purpose: "Sets denied-by-default Google consent signals in the page; updates after the visitor chooses.",
			policyUrl: "https://support.google.com/tagmanager/answer/13695607",
		});
	}

	return rows;
}
