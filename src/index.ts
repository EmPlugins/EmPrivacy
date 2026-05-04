// SPDX-License-Identifier: MIT

import type { PluginDescriptor } from "emdash";

import { PLUGIN_ID } from "./config.js";
import { VERSION } from "./version.js";

export type {
	AnalyticsProvider,
	EmprivacyConfig,
	ConsentRecordPayload,
} from "./config.js";
export { assertValidCloudflareToken } from "./config.js";
export {
	KV_KEY,
	COOKIE_NAME,
	DEFAULT_CONFIG,
	normalizeConfig,
	isRootRelativeSitePath,
	resolvePolicyHref,
	isValidPolicyHrefInput,
} from "./config.js";

/**
 * EmDash plugin descriptor — add to `plugins: []` in `emdash({ ... })` inside `astro.config`.
 * Requires **trusted** registration so `page:metadata` / `page:fragments` run (sandboxed plugins cannot inject fragments).
 */
export function emprivacyPlugin(): PluginDescriptor {
	return {
		id: PLUGIN_ID,
		version: VERSION,
		format: "standard",
		entrypoint: "emprivacy/sandbox",
		capabilities: ["hooks.page-fragments:register"],
		storage: {
			consentEvents: { indexes: ["createdAt", "policyVersion"] },
		},
		adminPages: [
			{
				path: "/settings",
				label: "EmPrivacy",
				icon: "shield",
			},
		],
	};
}
