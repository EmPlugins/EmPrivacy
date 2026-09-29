//#region src/auth.ts
const UNSUPPORTED_AUTH_MESSAGE = "This release requires an authentication method the client does not support.";
function unsupportedAuthDetails(auth) {
	if (!isRecord(auth) || typeof auth.hint_url !== "string" || auth.hint_url.length > 2048) return;
	try {
		const url = new URL(auth.hint_url);
		if (url.protocol !== "https:" || url.username || url.password) return void 0;
		return { hintUrl: url.href };
	} catch {
		return;
	}
}
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

//#endregion
export { unsupportedAuthDetails as n, UNSUPPORTED_AUTH_MESSAGE as t };
//# sourceMappingURL=auth-B730dpJ4.js.map