import { i18n } from "@lingui/core";

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion
//#region src/lib/api/client.ts
const API_BASE = "/_emdash/api";
/**
* Fetch wrapper that adds the X-EmDash-Request CSRF protection header
* to all requests. All API calls should use this instead of raw fetch().
*/
function apiFetch(input, init) {
	const headers = new Headers(init?.headers);
	headers.set("X-EmDash-Request", "1");
	return fetch(input, {
		...init,
		headers
	});
}
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
var ApiResponseError = class extends Error {
	constructor(status, code, message, details) {
		super(message);
		this.status = status;
		this.code = code;
		this.details = details;
		this.name = "ApiResponseError";
	}
};
/**
* Extract per-field validation issue messages from a `VALIDATION_ERROR`
* response's `error.details.issues` array (see `packages/core/src/api/parse.ts`).
* Returns undefined when the shape doesn't match, so callers can fall back
* to the generic top-level message.
*/
function formatValidationIssues(error) {
	if (error.code !== "VALIDATION_ERROR") return void 0;
	if (!isRecord(error.details)) return void 0;
	const issues = error.details.issues;
	if (!Array.isArray(issues) || issues.length === 0) return void 0;
	const messages = issues.map((issue) => {
		if (!isRecord(issue)) return void 0;
		const { path, message } = issue;
		if (typeof message !== "string") return void 0;
		return typeof path === "string" && path.length > 0 ? `${path}: ${message}` : message;
	}).filter((m) => m !== void 0);
	return messages.length > 0 ? messages.join("; ") : void 0;
}
function formatSandboxedSaveRejection(error) {
	if (error.code !== "SAVE_REJECTED" || !isRecord(error.details)) return void 0;
	const { pluginId, reason } = error.details;
	if (typeof pluginId !== "string" || typeof reason !== "string") return void 0;
	if (pluginId.length === 0 || reason.length === 0) return void 0;
	return i18n._({
		id: "7KcTZB",
		message: "Plugin {pluginId} rejected the save: {reason}",
		values: {
			pluginId,
			reason
		}
	});
}
/**
* Client errors that pass no verdict on the request body, so resending it
* unchanged can still succeed. Every other 4xx repeats its verdict on every
* attempt.
*/
const RETRYABLE_CLIENT_ERROR_STATUSES = new Set([
	408,
	421,
	425,
	429
]);
/** Whether retrying the same request unchanged can never succeed. */
function isTerminalRequestError(error) {
	if (!(error instanceof ApiResponseError)) return false;
	return error.status >= 400 && error.status < 500 && !RETRYABLE_CLIENT_ERROR_STATUSES.has(error.status);
}
/**
* Throw an error with the message from the API response body if available,
* falling back to a generic message. All API error responses use the shape
* `{ success: false, error: { code, message, details? } }`. For validation
* errors, the field-level messages in `error.details.issues` are surfaced
* instead of the generic "Invalid request data" top-level message.
*/
async function throwResponseError(res, fallback) {
	const body = await res.json().catch(() => ({}));
	let message;
	let code = "UNKNOWN_ERROR";
	let details;
	if (isRecord(body) && isRecord(body.error)) {
		const { error } = body;
		message = formatValidationIssues(error);
		if (!message) message = formatSandboxedSaveRejection(error);
		if (!message && typeof error.message === "string") message = error.message;
		if (typeof error.code === "string") code = error.code;
		if (isRecord(error.details)) details = error.details;
	}
	throw new ApiResponseError(res.status, code, message || `${fallback}: ${res.statusText}`, details);
}
/**
* Parse an API response with the { success, data: T } envelope.
*
* Handles error responses via throwResponseError, then unwraps the data envelope.
* Replaces both bare `response.json()` and field-unwrap patterns.
*/
async function parseApiResponse(response, fallbackMessage = i18n._({
	id: "/3O5R/",
	message: "Request failed"
})) {
	if (!response.ok) await throwResponseError(response, fallbackMessage);
	return (await response.json()).data;
}
/**
* Fetch admin manifest
*/
async function fetchManifest() {
	return parseApiResponse(await apiFetch(`${API_BASE}/manifest`), i18n._({
		id: "6B9mcK",
		message: "Failed to fetch manifest"
	}));
}
/**
* Fetch auth mode (public endpoint — works without authentication).
* Used by the login page to determine which login UI to render.
*/
async function fetchAuthMode() {
	return parseApiResponse(await apiFetch(`${API_BASE}/auth/mode`), i18n._({
		id: "HS8GaZ",
		message: "Failed to fetch auth mode"
	}));
}

//#endregion
//#region src/lib/api/plugins.ts
/**
* Plugin management APIs
*/
var plugins_exports = /* @__PURE__ */ __exportAll({
	disablePlugin: () => disablePlugin,
	enablePlugin: () => enablePlugin,
	fetchPlugin: () => fetchPlugin,
	fetchPluginSettings: () => fetchPluginSettings,
	fetchPlugins: () => fetchPlugins,
	setPluginMcpEnabled: () => setPluginMcpEnabled,
	updatePluginSettings: () => updatePluginSettings
});
/**
* Fetch all plugins
*/
async function fetchPlugins() {
	return (await parseApiResponse(await apiFetch(`${API_BASE}/admin/plugins`), i18n._({
		id: "lKhv/y",
		message: "Failed to fetch plugins"
	}))).items;
}
/**
* Fetch a single plugin
*/
async function fetchPlugin(pluginId) {
	const response = await apiFetch(`${API_BASE}/admin/plugins/${pluginId}`);
	if (!response.ok) {
		if (response.status === 404) throw new Error(i18n._({
			id: "/8h8wp",
			message: "Plugin \"{pluginId}\" not found",
			values: { pluginId }
		}));
		await throwResponseError(response, i18n._({
			id: "5Je0bM",
			message: "Failed to fetch plugin"
		}));
	}
	return (await parseApiResponse(response, i18n._({
		id: "5Je0bM",
		message: "Failed to fetch plugin"
	}))).item;
}
/**
* Fetch a plugin's settings schema and current values
*/
async function fetchPluginSettings(pluginId) {
	return parseApiResponse(await apiFetch(`${API_BASE}/admin/plugins/${pluginId}/settings`), i18n._({
		id: "dSfnXn",
		message: "Failed to fetch plugin settings"
	}));
}
/**
* Update a plugin's settings. Only keys present in `values` are written;
* `null` clears a stored value (reverting to the schema default).
*/
async function updatePluginSettings(pluginId, values) {
	return parseApiResponse(await apiFetch(`${API_BASE}/admin/plugins/${pluginId}/settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ values })
	}), i18n._({
		id: "viEewP",
		message: "Failed to update plugin settings"
	}));
}
/**
* Enable a plugin
*/
async function enablePlugin(pluginId) {
	return (await parseApiResponse(await apiFetch(`${API_BASE}/admin/plugins/${pluginId}/enable`, { method: "POST" }), i18n._({
		id: "K4UCXw",
		message: "Failed to enable plugin"
	}))).item;
}
/**
* Disable a plugin
*/
async function disablePlugin(pluginId) {
	return (await parseApiResponse(await apiFetch(`${API_BASE}/admin/plugins/${pluginId}/disable`, { method: "POST" }), i18n._({
		id: "GWYJp8",
		message: "Failed to disable plugin"
	}))).item;
}
async function setPluginMcpEnabled(pluginId, enabled) {
	const response = await apiFetch(`${API_BASE}/admin/plugins/${pluginId}/mcp`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ enabled })
	});
	if (!response.ok) await throwResponseError(response, i18n._({
		id: "0eCoEw",
		message: "Failed to update plugin MCP access"
	}));
}

//#endregion
export { fetchPlugins as a, updatePluginSettings as c, apiFetch as d, fetchAuthMode as f, throwResponseError as g, parseApiResponse as h, fetchPluginSettings as i, API_BASE as l, isTerminalRequestError as m, enablePlugin as n, plugins_exports as o, fetchManifest as p, fetchPlugin as r, setPluginMcpEnabled as s, disablePlugin as t, ApiResponseError as u };
//# sourceMappingURL=plugins-BPVhvih_.js.map