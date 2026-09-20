// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { isPolicyPagePath, normalizeConfig } from "./config.js";
import { parseLocaleOverridesText, resolveBannerCopy, chromeForLocale } from "./i18n.js";
import { isSafeHexColor, parseRadiusInput } from "./theme.js";
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
