// SPDX-License-Identifier: MIT

import type { ConsentState } from "./config.js";

export type EmprivacyCategory = "essential" | "functional" | "analytics" | "marketing";

/**
 * Public browser API attached to `window.emprivacy`.
 * Other plugins and themes should use this instead of reading the cookie directly.
 */
export interface EmprivacyBrowserApi {
	get(): ConsentState | null;
	has(category: EmprivacyCategory): boolean;
	onChange(cb: (state: ConsentState) => void): () => void;
	open(): void;
}

declare global {
	interface Window {
		emprivacy?: EmprivacyBrowserApi;
	}
}

export {};
