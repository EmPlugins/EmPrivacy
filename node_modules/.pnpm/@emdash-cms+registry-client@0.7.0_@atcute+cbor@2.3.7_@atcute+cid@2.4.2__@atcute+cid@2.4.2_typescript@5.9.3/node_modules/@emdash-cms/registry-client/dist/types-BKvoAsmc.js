import { NSID, PackageRelease, PackageReleaseExtension } from "@emdash-cms/registry-lexicons";
import { safeParse } from "@atcute/lexicons";
import { fromBase32, toBase32 } from "@atcute/multibase";

//#region src/release-service/source-record.ts
const SOURCE_ARTIFACT_KEYS = new Set([
	"$type",
	"package",
	"icon",
	"banner",
	"screenshots"
]);
const IMAGE_CONTENT_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp"
]);
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isHttpsUrl(value) {
	if (typeof value !== "string") return false;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.username === "" && url.password === "" && url.hash === "";
	} catch {
		return false;
	}
}
function isCanonicalSha256Multihash(value) {
	if (typeof value !== "string" || !value.startsWith("b")) return false;
	try {
		const bytes = fromBase32(value.slice(1));
		return bytes.length === 34 && bytes[0] === 18 && bytes[1] === 32 && `b${toBase32(bytes)}` === value;
	} catch {
		return false;
	}
}
function validSourceArtifact(value, image) {
	if (!isRecord(value) || Object.hasOwn(value, "blob") || Object.hasOwn(value, "requiresAuth") || !isHttpsUrl(value["url"]) || !isCanonicalSha256Multihash(value["checksum"])) return false;
	const contentType = value["contentType"];
	return contentType === void 0 ? true : image ? typeof contentType === "string" && IMAGE_CONTENT_TYPES.has(contentType) : contentType === "application/gzip";
}
function validSourceArtifacts(value) {
	if (!isRecord(value) || Object.keys(value).some((key) => !SOURCE_ARTIFACT_KEYS.has(key)) || !validSourceArtifact(value["package"], false) || value["icon"] !== void 0 && !validSourceArtifact(value["icon"], true) || value["banner"] !== void 0 && !validSourceArtifact(value["banner"], true)) return false;
	const screenshots = value["screenshots"];
	return screenshots === void 0 || Array.isArray(screenshots) && screenshots.every((artifact) => validSourceArtifact(artifact, true));
}
function isDelegatedReleaseSourceRecord(release, envelope) {
	if (Object.hasOwn(release, "auth") || !validSourceArtifacts(release.artifacts) || envelope !== void 0 && (release.package !== envelope.packageSlug || release.version !== envelope.version) || !isRecord(release.extensions)) return false;
	const extension = safeParse(PackageReleaseExtension.mainSchema, release.extensions[NSID.packageReleaseExtension]);
	return extension.ok && extension.value.provenance !== void 0 && isHttpsUrl(extension.value.provenance.url) && isCanonicalSha256Multihash(extension.value.provenance.checksum);
}
function parseDelegatedReleaseSourceRecord(value, envelope) {
	const release = safeParse(PackageRelease.mainSchema, value);
	return release.ok && isDelegatedReleaseSourceRecord(release.value, envelope) ? release.value : null;
}

//#endregion
//#region src/release-service/types.ts
const TERMINAL_RELEASE_INTENT_STATES = new Set([
	"published",
	"invalid",
	"rejected",
	"cancelled",
	"expired",
	"failed",
	"conflict"
]);

//#endregion
export { parseDelegatedReleaseSourceRecord as n, TERMINAL_RELEASE_INTENT_STATES as t };
//# sourceMappingURL=types-BKvoAsmc.js.map