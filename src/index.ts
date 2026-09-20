// SPDX-License-Identifier: MIT

import type { PluginDescriptor } from "emdash";

import { PLUGIN_ID } from "./config.js";
import { createPlugin } from "./runtime.js";
import { VERSION } from "./version.js";

export type {
	AnalyticsProvider,
	ConsentRecordPayload,
	ConsentState,
	EmbedCategory,
	EmprivacyConfig,
	EmprivacyPublicRuntimeConfig,
	VendorPublicRow,
} from "./config.js";
export type { EmprivacyBrowserApi, EmprivacyCategory } from "./public-api.js";
export type { ResolvedEmbed } from "./embed-resolve.js";
export type { AnalyticsLoader, VendorRow } from "./vendors.js";
export { assertValidCloudflareToken } from "./config.js";
export {
	KV_KEY,
	COOKIE_NAME,
	DEFAULT_CONFIG,
	normalizeConfig,
	isRootRelativeSitePath,
	resolvePolicyHref,
	isValidPolicyHrefInput,
	isPolicyPagePath,
} from "./config.js";
export { resolveEmbed, EMBED_BLOCK_TYPES } from "./embed-resolve.js";
export { buildVendorList, buildAnalyticsLoader } from "./vendors.js";

export { createPlugin };
export default createPlugin;

/**
 * EmDash native plugin descriptor — add to `plugins: []` in `emdash({ ... })` inside `astro.config`.
 *
 * EmPrivacy uses `page:fragments` (banner + consent scripts) and optional Portable Text
 * embed placeholders, which only run for **native** plugins in `plugins: []`.
 * Do not place this descriptor in `sandboxed: []`.
 */
export function emprivacyPlugin(): PluginDescriptor {
	return {
		id: PLUGIN_ID,
		version: VERSION,
		format: "native",
		entrypoint: "@emplugins/emprivacy",
		componentsEntry: "@emplugins/emprivacy/astro",
		adminPages: [
			{
				path: "/settings",
				label: "EmPrivacy",
				icon: "shield",
			},
		],
	};
}
