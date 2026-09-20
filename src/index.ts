// SPDX-License-Identifier: MIT

import type { PluginDescriptor } from "emdash";

import { PLUGIN_ID } from "./config.js";
import { createPlugin } from "./runtime.js";
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

export { createPlugin };
export default createPlugin;

/**
 * EmDash native plugin descriptor — add to `plugins: []` in `emdash({ ... })` inside `astro.config`.
 *
 * EmPrivacy uses `page:fragments` (banner + consent scripts), which only runs for **native**
 * plugins registered in `plugins: []`. Do not place this descriptor in `sandboxed: []`.
 * See [Page fragments](https://docs.emdashcms.com/plugins/creating-native-plugins/page-fragments/).
 */
export function emprivacyPlugin(): PluginDescriptor {
	return {
		id: PLUGIN_ID,
		version: VERSION,
		format: "native",
		entrypoint: "@emplugins/emprivacy",
		adminPages: [
			{
				path: "/settings",
				label: "EmPrivacy",
				icon: "shield",
			},
		],
	};
}
