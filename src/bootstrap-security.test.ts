// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { buildBodyBootstrap, buildMicrosoftConsentHeadScript } from "./public-bootstrap.js";
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
			bannerPosition: "bottom",
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
		expect(code).toContain('"bannerPosition":"bottom"');
		expect(code).toContain('C.bannerPosition==="top"?" emprivacy-bar--top":""');
		expect(code).toMatch(/L\.type==="gtm"/);
		expect(code).toContain("openPanel(C.ui.embedNeedConsent)");
		expect(code).toMatch(
			/closest\("\[data-emprivacy-embed-load\]"\)[\s\S]*?openPanel\(C\.ui\.embedNeedConsent\)/,
		);
		expect(code).toContain("navigator.globalPrivacyControl");
		expect(code).toContain("Max-Age=0");
		expect(code).toContain('ev.key==="Escape"');
		expect(code).toContain("https://www.clarity.ms/tag/");
		expect(code).toContain("https://bat.bing.com/bat.js");
		expect(code).toContain('"_uetsid"');
		expect(code).toContain("emprivacy_cc");
	});

	it("queues Microsoft consent as denied before a tag can load", () => {
		expect(buildMicrosoftConsentHeadScript("clarity")).toContain('"analytics_Storage":"denied"');
		expect(buildMicrosoftConsentHeadScript("clarity")).not.toContain("granted");
		expect(buildMicrosoftConsentHeadScript("uet")).toContain('"ad_storage":"denied"');
		expect(buildMicrosoftConsentHeadScript("uet")).not.toContain("granted");
	});
});
