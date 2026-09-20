// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { buildBodyBootstrap } from "./public-bootstrap.js";
import { chromeForLocale } from "./i18n.js";
import { DEFAULT_THEME } from "./theme.js";

describe("buildBodyBootstrap security surface", () => {
	it("embeds client allowlists and soft-consent, not silent marketing grant", () => {
		const code = buildBodyBootstrap({
			bannerTitle: "T",
			bannerMessage: "M",
			privacyPolicyUrl: "https://example.com/privacy",
			cookiePolicyUrl: "",
			strictDefaults: true,
			policyVersion: "1",
			googleConsentMode: false,
			logConsent: false,
			recordPath: "/_emdash/api/plugins/emprivacy/record",
			embedCategory: "marketing",
			gateEmbeds: true,
			hideBanner: false,
			theme: DEFAULT_THEME,
			ui: chromeForLocale("en"),
			loader: { type: "none" },
			marketingScripts: [],
			scriptHostAllowlist: ["cdn.example"],
			scriptIntegrity: {},
			cookieMaxAge: 15552000,
			vendors: [],
		});
		expect(code).toContain("youtube-nocookie");
		expect(code).toContain("allow-presentation");
		expect(code).not.toContain("allow-popups-to-escape-sandbox");
		expect(code).toContain("embedNeedConsent");
		expect(code).toContain("scriptHostAllowlist");
		expect(code).toContain("15552000");
		expect(code).toMatch(/L\.type==="gtm"/);
		expect(code).toContain("openPanel(C.ui.embedNeedConsent)");
		expect(code).toMatch(
			/closest\("\[data-emprivacy-embed-load\]"\)[\s\S]*?openPanel\(C\.ui\.embedNeedConsent\)/,
		);
	});
});
