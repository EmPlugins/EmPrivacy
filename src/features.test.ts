// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { isPolicyPagePath, jsonForHtmlScript, normalizeConfig } from "./config.js";
import { createPlugin } from "./runtime.js";
import { parseLocaleOverridesText, resolveBannerCopy, chromeForLocale } from "./i18n.js";
import { isSafeHexColor, parseRadiusInput, THEME_PROFILES } from "./theme.js";
import { buildAnalyticsLoader, buildVendorList } from "./vendors.js";

describe("theme", () => {
	it("accepts hex and rejects CSS injection", () => {
		expect(isSafeHexColor("#111")).toBe(true);
		expect(isSafeHexColor("#3b82f6")).toBe(true);
		expect(isSafeHexColor("red")).toBe(false);
		expect(isSafeHexColor("#111;background:url(https://x)")).toBe(false);
	});

	it("caps radius", () => {
		expect(parseRadiusInput("6", 6)).toBe(6);
		expect(() => parseRadiusInput("99", 6)).toThrow(/0 to 24/);
		expect(() => parseRadiusInput("6px", 6)).toThrow();
	});

	it("starts on the first profile when no theme choice is stored", () => {
		const n = normalizeConfig({ theme: { bg: "#112233", text: "#eeeeee", accent: "#3b82f6", radiusPx: 4 } });
		expect(n.themeProfile).toBe("slate");
		expect(n.theme).toEqual(THEME_PROFILES.slate);
		expect(normalizeConfig(null).theme).toEqual(THEME_PROFILES.slate);
	});

	it("keeps explicit custom colors for the manual fields", () => {
		const n = normalizeConfig({
			themeProfile: "custom",
			theme: { bg: "#112233", text: "#eeeeee", accent: "#3b82f6", radiusPx: 4 },
		});
		expect(n.themeProfile).toBe("custom");
		expect(n.theme.bg).toBe("#112233");
		expect(n.theme.radiusPx).toBe(4);
	});

	it("replaces stored colors with the fixed profile palette", () => {
		const n = normalizeConfig({
			themeProfile: "slate",
			theme: { bg: "red;background:url(https://evil)", text: "#fff", accent: "#fff", radiusPx: 99 },
		});
		expect(n.theme).toEqual(THEME_PROFILES.slate);
		expect(jsonForHtmlScript(n.theme)).not.toContain("url");
		expect(normalizeConfig({ themeProfile: "not-a-theme" }).themeProfile).toBe("slate");
	});
});

describe("i18n", () => {
	it("falls back to English chrome", () => {
		expect(chromeForLocale("zz").acceptAll).toBe("Accept all");
		expect(chromeForLocale("de").acceptAll).toBe("Alle akzeptieren");
		expect(chromeForLocale("pt-BR").acceptAll).toBe("Aceitar tudo");
	});

	it("parses locale overrides and rejects invalid keys", () => {
		const o = parseLocaleOverridesText(
			'{"de":{"bannerTitle":"Hallo","bannerMessage":"Text"}}',
		);
		expect(resolveBannerCopy({ bannerTitle: "Hi", bannerMessage: "Msg" }, o, "de").bannerTitle).toBe(
			"Hallo",
		);
		expect(() => parseLocaleOverridesText('{"not a locale":{}}')).toThrow(/locale/i);
	});
});

describe("vendors", () => {
	it("does not leak Cloudflare tokens", () => {
		const cfg = normalizeConfig({
			analyticsProvider: "cloudflare",
			cloudflareWebAnalyticsToken: "secret-token-value",
		});
		const json = JSON.stringify(buildVendorList(cfg));
		expect(json).not.toContain("secret-token-value");
		expect(buildAnalyticsLoader(cfg)).toEqual({ type: "cloudflare", token: "secret-token-value" });
	});

	it("does not publish custom scripts that lack SRI or an allowlist entry", () => {
		const blocked = normalizeConfig({
			analyticsProvider: "custom",
			analyticsScriptUrls: ["https://cdn.example/a.js"],
			scriptHostAllowlist: [],
		});
		expect(buildAnalyticsLoader(blocked)).toEqual({ type: "none" });
		const allowed = normalizeConfig({
			analyticsProvider: "custom",
			analyticsScriptUrls: ["https://cdn.example/a.js"],
			scriptIntegrity: { "https://cdn.example/a.js": "sha384-abc=" },
			scriptHostAllowlist: ["cdn.example"],
		});
		expect(buildAnalyticsLoader(allowed)).toEqual({
			type: "custom",
			scripts: [{ src: "https://cdn.example/a.js", integrity: "sha384-abc=" }],
		});
	});

	it("builds a Plausible loader from a hostname only", () => {
		const cfg = normalizeConfig({ analyticsProvider: "plausible", analyticsId: "example.com" });
		expect(buildAnalyticsLoader(cfg)).toEqual({
			type: "plausible",
			src: "https://plausible.io/js/script.js",
			domain: "example.com",
		});
	});

	it("classifies GTM under marketing", () => {
		const cfg = normalizeConfig({ analyticsProvider: "gtm", analyticsId: "GTM-ABCD" });
		expect(buildAnalyticsLoader(cfg)).toEqual({ type: "gtm", containerId: "GTM-ABCD" });
		const gtm = buildVendorList(cfg).find((v) => v.id === "gtm");
		expect(gtm?.category).toBe("marketing");
	});

	it("keeps Clarity on analytics and UET on marketing without publishing the ID", () => {
		const clarity = normalizeConfig({ analyticsProvider: "clarity", analyticsId: "abcd1234" });
		expect(buildAnalyticsLoader(clarity)).toEqual({ type: "clarity", projectId: "abcd1234" });
		const clarityRow = buildVendorList(clarity).find((v) => v.id === "clarity");
		expect(clarityRow?.category).toBe("analytics");
		expect(JSON.stringify(clarityRow)).not.toContain("abcd1234");

		const uet = normalizeConfig({ analyticsProvider: "uet", analyticsId: "12345678" });
		expect(buildAnalyticsLoader(uet)).toEqual({ type: "uet", tagId: "12345678" });
		expect(buildVendorList(uet).find((v) => v.id === "uet")?.category).toBe("marketing");
		expect(JSON.stringify(buildVendorList(uet))).not.toContain("12345678");

		expect(buildAnalyticsLoader(normalizeConfig({ analyticsProvider: "clarity", analyticsId: "../evil" })).type).toBe(
			"none",
		);
		expect(buildAnalyticsLoader(normalizeConfig({ analyticsProvider: "uet", analyticsId: "12ab" })).type).toBe(
			"none",
		);
	});
});

describe("admin route", () => {
	it("rejects settings reads and saves when no user is signed in", async () => {
		const plugin = createPlugin() as unknown as {
			routes: { admin: { handler: (ctx: { user?: { id: string }; input: unknown }) => Promise<unknown> } };
		};
		const load = await plugin.routes.admin.handler({
			input: { type: "page_load", page: "/settings" },
		});
		expect(load).toBeInstanceOf(Response);
		expect((load as Response).status).toBe(401);
		const save = await plugin.routes.admin.handler({
			input: { type: "form_submit", action_id: "emprivacy-save", values: {} },
		});
		expect((save as Response).status).toBe(401);
	});
});

describe("isPolicyPagePath", () => {
	it("matches configured policy paths", () => {
		expect(isPolicyPagePath("/privacy", { privacyPolicyUrl: "/privacy", cookiePolicyUrl: "" })).toBe(
			true,
		);
		expect(
			isPolicyPagePath("/en/privacy", { privacyPolicyUrl: "/privacy", cookiePolicyUrl: "" }),
		).toBe(true);
		expect(isPolicyPagePath("/blog", { privacyPolicyUrl: "/privacy", cookiePolicyUrl: "" })).toBe(
			false,
		);
	});
});
