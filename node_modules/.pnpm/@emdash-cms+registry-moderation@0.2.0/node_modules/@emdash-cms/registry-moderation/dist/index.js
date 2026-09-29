import { C as assertCanonicalCid, D as parseInstant, E as parseAtUri, S as subjectKindFromUri, T as isDid, _ as PROFILE_COLLECTION, a as isModerationFindingCategory, b as listingLabelKey, c as integerValue, d as optionalString, f as record, g as LISTING_LABELS, h as stringValue, i as assertListingModerationPolicy, l as optionalBoolean, m as stringArray, n as MODERATION_FINDING_CATEGORIES, o as stateSources, p as runtimeSchema, r as STATE_LABEL_VALUES, s as dictionary, t as ListingModerationPolicySchema, u as optionalInteger, v as RELEASE_COLLECTION, w as assertDid, x as reduceListingLabels, y as isListingLabelActive } from "./policy-CL5r2RQH.js";
import { encode, toBytes } from "@atcute/cbor";
import { P256PrivateKey, P256PublicKey, parsePublicMultikey } from "@atcute/crypto";
import { fromBase64Url, toBase64Url } from "@atcute/multibase";

//#region src/label-crypto.ts
const verifiedListingLabel = Symbol("verifiedListingLabel");
const verifiedListingLabels = /* @__PURE__ */ new WeakSet();
var InvalidListingLabelSignatureError = class extends TypeError {
	constructor(message) {
		super(message);
		this.name = "InvalidListingLabelSignatureError";
	}
};
const P256_ORDER = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");
const LABEL_FIELDS = new Set([
	"ver",
	"src",
	"uri",
	"cid",
	"val",
	"neg",
	"cts",
	"exp"
]);
const SIGNED_LABEL_FIELDS = new Set([...LABEL_FIELDS, "sig"]);
const PRINTABLE_LABEL_VALUE = /^[^\p{Cc}]{1,128}$/u;
const BASE64URL = /^[A-Za-z0-9_-]+$/;
function scalarToBigInt(bytes) {
	let value = 0n;
	for (const byte of bytes) value = value << 8n | BigInt(byte);
	return value;
}
function utf8Length(value) {
	let length = 0;
	for (let index = 0; index < value.length; index++) {
		const codeUnit = value.charCodeAt(index);
		if (codeUnit <= 127) length++;
		else if (codeUnit <= 2047) length += 2;
		else if (codeUnit >= 55296 && codeUnit <= 56319 && value.charCodeAt(index + 1) >= 56320 && value.charCodeAt(index + 1) <= 57343) {
			length += 4;
			index++;
		} else length += 3;
	}
	return length;
}
function validateLabelValue(value) {
	if (typeof value !== "string" || value.length === 0 || !PRINTABLE_LABEL_VALUE.test(value) || utf8Length(value) > 128) throw new TypeError("label.val must be a non-empty printable string of at most 128 UTF-8 bytes");
}
function validateLabelUri(value) {
	if (isDid(value)) return;
	const subject = parseAtUri(value, "label.uri");
	if (subject.collection !== PROFILE_COLLECTION && subject.collection !== RELEASE_COLLECTION) throw new TypeError("label.uri must identify a plugin profile or release record");
}
function getField(value, field) {
	return Object.getOwnPropertyDescriptor(value, field)?.value;
}
function validateLabelObject(value, signed) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError("label must be an object");
	const fields = signed ? SIGNED_LABEL_FIELDS : LABEL_FIELDS;
	for (const field of Object.keys(value)) if (!fields.has(field)) throw new TypeError(`label contains unsupported field: ${field}`);
	if (getField(value, "ver") !== 1) throw new TypeError("label.ver must be 1");
	const src = getField(value, "src");
	const uri = getField(value, "uri");
	const cid = getField(value, "cid");
	const val = getField(value, "val");
	const neg = getField(value, "neg");
	const cts = getField(value, "cts");
	const exp = getField(value, "exp");
	assertDid(src, "label.src");
	validateLabelUri(uri);
	validateLabelValue(val);
	if (typeof cts !== "string") throw new TypeError("label.cts must be a valid RFC 3339 timestamp");
	parseInstant(cts, "label.cts");
	if (cid !== void 0) assertCanonicalCid(cid, "label.cid");
	if (isDid(uri) && cid !== void 0) throw new TypeError("DID-scoped labels must not have a CID");
	if (neg !== void 0 && typeof neg !== "boolean") throw new TypeError("label.neg must be a boolean");
	if (exp !== void 0) {
		if (typeof exp !== "string") throw new TypeError("label.exp must be a valid RFC 3339 timestamp");
		parseInstant(exp, "label.exp");
	}
	const canonical = {
		ver: 1,
		src,
		uri,
		...cid === void 0 ? {} : { cid },
		val,
		...neg === true ? { neg: true } : {},
		cts,
		...exp === void 0 ? {} : { exp }
	};
	if (!signed) return canonical;
	const sig = getField(value, "sig");
	if (!(sig instanceof Uint8Array) || sig.length !== 64) throw new TypeError("label.sig must be a 64-byte compact P-256 signature");
	return {
		...canonical,
		sig: Uint8Array.from(sig)
	};
}
function canonicalLabelBytes(label) {
	return encode(validateLabelObject(label, false));
}
function parseListingLabel(value) {
	return validateLabelObject(value, false);
}
function parseSignedListingLabel(value) {
	return validateLabelObject(value, true);
}
function encodeSignedListingLabel(label) {
	const { sig, ...unsigned } = parseSignedListingLabel(label);
	return encode({
		...unsigned,
		sig: toBytes(sig)
	});
}
function importPrivateScalar(value) {
	if (!BASE64URL.test(value)) throw new TypeError("privateKey must be canonical unpadded base64url");
	let bytes;
	try {
		bytes = fromBase64Url(value);
	} catch {
		throw new TypeError("privateKey must be canonical unpadded base64url");
	}
	if (bytes.length !== 32 || toBase64Url(bytes) !== value) throw new TypeError("privateKey must be canonical unpadded base64url for exactly 32 bytes");
	const scalar = scalarToBigInt(bytes);
	if (scalar === 0n || scalar >= P256_ORDER) throw new TypeError("privateKey must be in the P-256 scalar range");
	return P256PrivateKey.importRaw(bytes);
}
function normalizedMethodId(documentId, methodId) {
	return methodId.startsWith("#") ? `${documentId}${methodId}` : methodId;
}
async function resolveLabelPublicKey(did, resolveDid) {
	const document = await resolveDid(did);
	assertDid(document.id, "DID document id");
	if (document.id !== did) throw new TypeError("DID document id does not match label source");
	const ids = /* @__PURE__ */ new Set();
	let signingMethod;
	for (const method of document.verificationMethod ?? []) {
		const id = normalizedMethodId(document.id, method.id);
		if (ids.has(id)) throw new TypeError("DID document has duplicate verification method ids");
		ids.add(id);
		if (id === `${did}#atproto_label`) signingMethod = {
			...method,
			id
		};
	}
	if (!signingMethod) throw new TypeError("DID document has no #atproto_label verification method");
	if (signingMethod.type !== "Multikey" || signingMethod.controller !== did) throw new TypeError("#atproto_label verification method must be a controller-owned Multikey");
	let parsed;
	try {
		parsed = parsePublicMultikey(signingMethod.publicKeyMultibase);
	} catch {
		throw new TypeError("#atproto_label verification method has an invalid Multikey");
	}
	if (parsed.type !== "p256" || parsed.publicKeyBytes.length !== 33 || ![2, 3].includes(parsed.publicKeyBytes[0])) throw new TypeError("#atproto_label verification method must contain a compressed P-256 key");
	const key = await P256PublicKey.importRaw(parsed.publicKeyBytes);
	if (await key.exportPublicKey("multikey") !== signingMethod.publicKeyMultibase) throw new TypeError("#atproto_label verification method uses a non-canonical P-256 Multikey");
	return key;
}
async function createListingLabelSigner(input) {
	assertDid(input.issuerDid, "issuerDid");
	const key = await importPrivateScalar(input.privateKey);
	const resolved = await resolveLabelPublicKey(input.issuerDid, input.resolveDid);
	if (await key.exportPublicKey("multikey") !== await resolved.exportPublicKey("multikey")) throw new TypeError("privateKey does not match the issuer DID #atproto_label verification method");
	return {
		issuerDid: input.issuerDid,
		async sign(label) {
			const unsigned = validateLabelObject({
				...label,
				src: input.issuerDid
			}, false);
			return {
				...unsigned,
				sig: await key.sign(canonicalLabelBytes(unsigned))
			};
		}
	};
}
function brandVerifiedListingLabel(label) {
	const verified = {
		...label,
		[verifiedListingLabel]: true
	};
	Object.defineProperty(verified, verifiedListingLabel, {
		value: true,
		enumerable: false
	});
	Object.freeze(verified);
	verifiedListingLabels.add(verified);
	return verified;
}
function isVerifiedListingLabel(value) {
	return typeof value === "object" && value !== null && verifiedListingLabels.has(value) && Object.getOwnPropertyDescriptor(value, verifiedListingLabel)?.value === true;
}
async function verifyListingLabelWithPublicKey(input) {
	assertDid(input.expectedSource, "expectedSource");
	const label = parseSignedListingLabel(input.label);
	if (label.src !== input.expectedSource) throw new TypeError("label.src does not match expectedSource");
	const { sig, ...unsigned } = label;
	if (!await input.publicKey.verify(sig, canonicalLabelBytes(unsigned))) throw new InvalidListingLabelSignatureError("label signature is invalid");
	return brandVerifiedListingLabel(unsigned);
}
async function verifyListingLabel(input) {
	const label = parseSignedListingLabel(input.label);
	const publicKey = await resolveLabelPublicKey(label.src, input.resolveDid);
	return verifyListingLabelWithPublicKey({
		label,
		expectedSource: label.src,
		publicKey
	});
}

//#endregion
//#region src/evaluate.ts
const TERMINAL_VALUES = new Set([
	LISTING_LABELS.passed,
	LISTING_LABELS.pending,
	LISTING_LABELS.review,
	LISTING_LABELS.error
]);
function validateSubject(subject) {
	assertDid(subject.publisherDid, "subject.publisherDid");
	assertCanonicalCid(subject.cid, "subject.cid");
	const parsed = parseAtUri(subject.uri, "subject.uri");
	if (parsed.authority !== subject.publisherDid) throw new TypeError("subject.uri authority must match subject.publisherDid");
	const expectedCollection = subject.kind === "profile" ? PROFILE_COLLECTION : RELEASE_COLLECTION;
	if (parsed.collection !== expectedCollection) throw new TypeError("subject.uri collection must match subject.kind");
	if (subject.profileUri !== void 0) {
		const profile = parseAtUri(subject.profileUri, "subject.profileUri");
		if (profile.authority !== subject.publisherDid || profile.collection !== PROFILE_COLLECTION) throw new TypeError("subject.profileUri must identify the publisher's profile record");
	}
}
function appliesToRevision(label, subject) {
	return label.uri === subject.uri && label.cid === subject.cid;
}
function result(state, reasonCodes, positiveSources, missingPositiveSources, applicableLabels) {
	return {
		visible: state === "passed",
		state,
		reasonCodes,
		positiveSources,
		missingPositiveSources,
		applicableLabels
	};
}
function evaluateListingVisibilityCore(input) {
	assertListingModerationPolicy(input.policy);
	validateSubject(input.subject);
	if (input.subject.deleted) return result("deleted", ["publisher-deleted"], [], input.policy.requiredPositiveSources, []);
	if (input.subject.tombstoned) return result("tombstoned", ["publisher-tombstoned"], [], input.policy.requiredPositiveSources, []);
	const reduction = reduceListingLabels(input.labels, input.evaluatedAt);
	const acceptedStates = stateSources(input.policy);
	const active = reduction.states.filter((state) => state.active).map((state) => state.winner);
	const collisionCandidates = reduction.states.flatMap((state) => state.collision).filter((label) => isListingLabelActive(label, input.evaluatedAt));
	const enforcementCandidates = [...active, ...collisionCandidates];
	const redactionUris = new Set([
		input.subject.uri,
		input.subject.profileUri,
		input.subject.publisherDid
	].filter((value) => value !== void 0));
	const takedowns = enforcementCandidates.filter((label) => label.val === LISTING_LABELS.takedown && input.policy.redactionSources.includes(label.src) && redactionUris.has(label.uri) && (label.cid === void 0 || label.uri === input.subject.uri && label.cid === input.subject.cid));
	if (takedowns.length > 0) return result("takedown", ["active-takedown"], [], input.policy.requiredPositiveSources, takedowns);
	const applicable = active.filter((label) => acceptedStates.has(label.src) && appliesToRevision(label, input.subject));
	const collisionApplicable = collisionCandidates.filter((label) => acceptedStates.has(label.src) && appliesToRevision(label, input.subject));
	if ([...applicable, ...collisionApplicable].filter((label) => label.val === LISTING_LABELS.blocked).length > 0) return result("blocked", ["exact-cid-block"], [], input.policy.requiredPositiveSources, [...applicable, ...collisionApplicable]);
	const collisions = reduction.states.filter((state) => state.collision.length > 0 && state.collision.some((label) => isListingLabelActive(label, input.evaluatedAt) && acceptedStates.has(label.src) && appliesToRevision(label, input.subject)));
	const terminalValues = new Set(applicable.filter((label) => TERMINAL_VALUES.has(label.val)).map((label) => label.val));
	if (collisions.length > 0 || terminalValues.size > 1) return result("conflict", ["conflicting-terminal-state"], [], input.policy.requiredPositiveSources, applicable);
	const positiveSources = input.policy.requiredPositiveSources.filter((source) => applicable.some((label) => label.src === source && label.val === LISTING_LABELS.passed));
	const missingPositiveSources = input.policy.requiredPositiveSources.filter((source) => !positiveSources.includes(source));
	if (missingPositiveSources.length === 0) return result("passed", ["required-positive-labels"], positiveSources, [], applicable);
	const reasonCodes = ["missing-required-positive-label"];
	if (applicable.some((label) => label.val === LISTING_LABELS.pending)) reasonCodes.push("listing-pending");
	if (applicable.some((label) => label.val === LISTING_LABELS.review)) reasonCodes.push("listing-review");
	if (applicable.some((label) => label.val === LISTING_LABELS.error)) reasonCodes.push("listing-error");
	if (applicable.some((label) => label.val === LISTING_LABELS.overridden)) reasonCodes.push("override-without-pass");
	return result("unavailable", reasonCodes, positiveSources, missingPositiveSources, applicable);
}
function evaluateListingVisibility(input) {
	for (const label of input.labels) if (!isVerifiedListingLabel(label)) throw new TypeError("labels must be verified by verifyListingLabel before visibility evaluation");
	return evaluateListingVisibilityCore(input);
}
/**
* Evaluates structurally validated labels loaded from an already authenticated store.
* This function does not verify signatures and must never receive network or client input.
*/
function evaluateHydratedListingVisibility(input) {
	return evaluateListingVisibilityCore({
		...input,
		labels: input.labels.map((label) => parseListingLabel(label))
	});
}
function selectLatestApprovedRevision(input) {
	if (input.currentDeleted) return null;
	return input.revisions.filter((revision) => evaluateListingVisibility({
		subject: revision,
		policy: input.policy,
		labels: input.labels,
		evaluatedAt: input.evaluatedAt
	}).visible).toSorted((left, right) => right.observedAt.localeCompare(left.observedAt))[0] ?? null;
}
/** Selects from labels whose signatures were verified before persistence. */
function selectLatestHydratedApprovedRevision(input) {
	if (input.currentDeleted) return null;
	return input.revisions.filter((revision) => evaluateHydratedListingVisibility({
		subject: revision,
		policy: input.policy,
		labels: input.labels,
		evaluatedAt: input.evaluatedAt
	}).visible).toSorted((left, right) => right.observedAt.localeCompare(left.observedAt))[0] ?? null;
}

//#endregion
//#region src/findings.ts
function parseFinding(value) {
	const finding = record(value, "finding", [
		"category",
		"recommendation",
		"confidence",
		"summary",
		"evidenceRefs"
	]);
	const category = finding["category"];
	if (!isModerationFindingCategory(category)) throw new TypeError("finding.category is not recognized");
	if (finding["recommendation"] !== "none" && finding["recommendation"] !== "review") throw new TypeError("finding.recommendation must be none or review");
	if (typeof finding["confidence"] !== "number" || !Number.isFinite(finding["confidence"]) || finding["confidence"] < 0 || finding["confidence"] > 1) throw new TypeError("finding.confidence must be between zero and one");
	return {
		category,
		recommendation: finding["recommendation"],
		confidence: finding["confidence"],
		summary: stringValue(finding["summary"], "finding.summary", 500),
		evidenceRefs: stringArray(finding["evidenceRefs"], "finding.evidenceRefs", 32)
	};
}
const NormalizedModerationFindingSchema = runtimeSchema(parseFinding);

//#endregion
//#region src/inputs.ts
const RENDERED_PROFILE_SECTION_KEYS = [
	"description",
	"installation",
	"faq",
	"changelog",
	"security"
];
function parseSubject(value, kind, publisherDid) {
	const subject = record(value, "subject", [
		"uri",
		"cid",
		"kind"
	]);
	const uri = stringValue(subject["uri"], "subject.uri", 2048);
	const cid = stringValue(subject["cid"], "subject.cid", 256);
	if (subject["kind"] !== kind) throw new TypeError(`subject.kind must be ${kind}`);
	const expectedCollection = kind === "profile" ? PROFILE_COLLECTION : RELEASE_COLLECTION;
	const parsed = parseAtUri(uri, "subject.uri");
	if (parsed.authority !== publisherDid) throw new TypeError("subject.uri authority must match publisherDid");
	if (parsed.collection !== expectedCollection) throw new TypeError(`subject.uri must target ${expectedCollection}`);
	assertCanonicalCid(cid, "subject.cid");
	return {
		uri,
		cid,
		kind
	};
}
function parsePublisherDid(value) {
	const publisherDid = stringValue(value, "publisherDid", 256);
	assertDid(publisherDid, "publisherDid");
	return publisherDid;
}
function parseAuthors(value) {
	if (!Array.isArray(value) || value.length === 0 || value.length > 32) throw new TypeError("authors must contain between 1 and 32 entries");
	return value.map((entry, index) => {
		const author = record(entry, `authors[${index}]`, [
			"name",
			"url",
			"email"
		]);
		return {
			name: stringValue(author["name"], `authors[${index}].name`, 256),
			url: optionalString(author["url"], `authors[${index}].url`, 1024),
			email: optionalString(author["email"], `authors[${index}].email`, 256)
		};
	});
}
function parseContacts(value) {
	if (!Array.isArray(value) || value.length === 0 || value.length > 8) throw new TypeError("security must contain between 1 and 8 entries");
	return value.map((entry, index) => {
		const contact = record(entry, `security[${index}]`, ["url", "email"]);
		const parsed = {
			url: optionalString(contact["url"], `security[${index}].url`, 1024),
			email: optionalString(contact["email"], `security[${index}].email`, 256)
		};
		if (!parsed.url && !parsed.email) throw new TypeError(`security[${index}] must contain url or email`);
		return parsed;
	});
}
function parseStringRecord(value, field, maxItems, allowedKeys) {
	const source = dictionary(value, field);
	const entries = Object.entries(source);
	if (entries.length > maxItems) throw new TypeError(`${field} has too many entries`);
	if (allowedKeys && entries.some(([key]) => !allowedKeys.includes(key))) throw new TypeError(`${field} contains a field that official clients do not render`);
	return Object.fromEntries(entries.map(([key, item]) => [stringValue(key, `${field} key`, 128), stringValue(item, `${field}.${key}`)]));
}
function parseProfile(value) {
	const profile = record(value, "profile input", [
		"schemaVersion",
		"subject",
		"publisherDid",
		"slug",
		"name",
		"description",
		"keywords",
		"license",
		"sections",
		"authors",
		"security",
		"lastUpdated"
	]);
	if (profile["schemaVersion"] !== 1) throw new TypeError("schemaVersion must be 1");
	const publisherDid = parsePublisherDid(profile["publisherDid"]);
	const subject = parseSubject(profile["subject"], "profile", publisherDid);
	const slug = stringValue(profile["slug"], "slug", 64);
	if (parseAtUri(subject.uri, "subject.uri").rkey !== slug) throw new TypeError("slug must match the profile record key");
	return {
		schemaVersion: 1,
		subject,
		publisherDid,
		slug,
		name: optionalString(profile["name"], "name", 1024),
		description: optionalString(profile["description"], "description", 1024),
		keywords: stringArray(profile["keywords"], "keywords", 5),
		license: stringValue(profile["license"], "license", 256),
		sections: parseStringRecord(profile["sections"], "sections", RENDERED_PROFILE_SECTION_KEYS.length, RENDERED_PROFILE_SECTION_KEYS),
		authors: parseAuthors(profile["authors"]),
		security: parseContacts(profile["security"]),
		lastUpdated: optionalString(profile["lastUpdated"], "lastUpdated", 64)
	};
}
function parseVerifiedMedia(value, field) {
	if (value === void 0) return void 0;
	const verified = record(value, field, [
		"sha256",
		"mimeType",
		"byteLength",
		"width",
		"height",
		"contentRef"
	]);
	return {
		sha256: stringValue(verified["sha256"], `${field}.sha256`, 128),
		mimeType: stringValue(verified["mimeType"], `${field}.mimeType`, 256),
		byteLength: integerValue(verified["byteLength"], `${field}.byteLength`),
		width: integerValue(verified["width"], `${field}.width`),
		height: integerValue(verified["height"], `${field}.height`),
		contentRef: stringValue(verified["contentRef"], `${field}.contentRef`, 512)
	};
}
function parseMedia(value) {
	if (!Array.isArray(value) || value.length > 10) throw new TypeError("media must be an array of at most 10 entries");
	const parsed = value.map((entry, index) => {
		const field = `media[${index}]`;
		const media = record(entry, field, [
			"kind",
			"index",
			"id",
			"url",
			"checksum",
			"contentType",
			"requiresAuth",
			"releaseAsset",
			"width",
			"height",
			"language",
			"verified"
		]);
		const kind = media["kind"];
		if (!isDisplayMediaKind(kind)) throw new TypeError(`${field}.kind is not display media`);
		return {
			kind,
			index: integerValue(media["index"], `${field}.index`),
			id: optionalString(media["id"], `${field}.id`, 128),
			url: stringValue(media["url"], `${field}.url`, 2048),
			checksum: stringValue(media["checksum"], `${field}.checksum`, 256),
			contentType: optionalString(media["contentType"], `${field}.contentType`, 256),
			requiresAuth: optionalBoolean(media["requiresAuth"], `${field}.requiresAuth`),
			releaseAsset: optionalBoolean(media["releaseAsset"], `${field}.releaseAsset`),
			width: optionalInteger(media["width"], `${field}.width`),
			height: optionalInteger(media["height"], `${field}.height`),
			language: optionalString(media["language"], `${field}.language`, 64),
			verified: parseVerifiedMedia(media["verified"], `${field}.verified`)
		};
	});
	const keys = parsed.map((media) => `${media.kind}:${media.index}`);
	if (new Set(keys).size !== keys.length) throw new TypeError("media entries must be unique");
	if (parsed.filter((media) => media.kind === "icon").length > 1) throw new TypeError("media may contain at most one icon");
	if (parsed.filter((media) => media.kind === "banner").length > 1) throw new TypeError("media may contain at most one banner");
	if (parsed.filter((media) => media.kind === "screenshot").length > 8) throw new TypeError("media may contain at most eight screenshots");
	if (parsed.some((media) => media.kind !== "screenshot" && media.index !== 0)) throw new TypeError("icon and banner media indices must be zero");
	return parsed;
}
function parseRelease(value) {
	const release = record(value, "release input", [
		"schemaVersion",
		"subject",
		"publisherDid",
		"packageSlug",
		"version",
		"repositoryUrl",
		"requires",
		"sbom",
		"media"
	]);
	if (release["schemaVersion"] !== 1) throw new TypeError("schemaVersion must be 1");
	const publisherDid = parsePublisherDid(release["publisherDid"]);
	const subject = parseSubject(release["subject"], "release", publisherDid);
	const packageSlug = stringValue(release["packageSlug"], "packageSlug", 64);
	const version = stringValue(release["version"], "version", 64);
	if (parseAtUri(subject.uri, "subject.uri").rkey !== `${packageSlug}:${version}`) throw new TypeError("packageSlug and version must match the release record key");
	let sbom;
	if (release["sbom"] !== void 0) {
		const source = record(release["sbom"], "sbom", ["format", "url"]);
		sbom = {
			format: optionalString(source["format"], "sbom.format", 32),
			url: optionalString(source["url"], "sbom.url", 2048)
		};
	}
	return {
		schemaVersion: 1,
		subject,
		publisherDid,
		packageSlug,
		version,
		repositoryUrl: optionalString(release["repositoryUrl"], "repositoryUrl", 1024),
		requires: parseStringRecord(release["requires"], "requires", 64),
		sbom,
		media: parseMedia(release["media"])
	};
}
const CanonicalProfileModerationInputSchema = runtimeSchema(parseProfile);
const CanonicalReleaseModerationInputSchema = runtimeSchema(parseRelease);
function isDisplayMediaKind(value) {
	return value === "icon" || value === "banner" || value === "screenshot";
}

//#endregion
//#region src/withdrawal.ts
const LEGACY_RELEASE_WITHDRAWAL_LABEL = "security:yanked";
const RELEASE_WITHDRAWAL_LABEL = "security-yanked";
const RELEASE_WITHDRAWAL_VALUES = new Set([LEGACY_RELEASE_WITHDRAWAL_LABEL, RELEASE_WITHDRAWAL_LABEL]);
function evaluateReleaseWithdrawal(input) {
	for (const label of input.labels) if (!isVerifiedListingLabel(label)) throw new TypeError("withdrawal labels must be verified before evaluation");
	return evaluateReleaseWithdrawalCore(input);
}
/** Evaluates labels loaded from a store that authenticated them before persistence. */
function evaluateHydratedReleaseWithdrawal(input) {
	return evaluateReleaseWithdrawalCore({
		...input,
		labels: input.labels.map((label) => parseListingLabel(label))
	});
}
function evaluateReleaseWithdrawalCore(input) {
	const acceptedSources = input.acceptedSources === void 0 ? null : new Set(input.acceptedSources);
	const applicableLabels = reduceListingLabels(input.labels, input.evaluatedAt).states.flatMap((state) => {
		return (state.collision.length > 0 ? state.collision : state.active ? [state.winner] : []).filter((label) => RELEASE_WITHDRAWAL_VALUES.has(label.val) && isListingLabelActive(label, input.evaluatedAt) && label.uri === input.uri && (label.cid === void 0 || label.cid === input.cid) && (acceptedSources === null || acceptedSources.has(label.src)));
	});
	return {
		withdrawn: applicableLabels.length > 0,
		applicableLabels
	};
}

//#endregion
export { CanonicalProfileModerationInputSchema, CanonicalReleaseModerationInputSchema, InvalidListingLabelSignatureError, LEGACY_RELEASE_WITHDRAWAL_LABEL, LISTING_LABELS, ListingModerationPolicySchema, MODERATION_FINDING_CATEGORIES, NormalizedModerationFindingSchema, PROFILE_COLLECTION, RELEASE_COLLECTION, RELEASE_WITHDRAWAL_LABEL, RENDERED_PROFILE_SECTION_KEYS, STATE_LABEL_VALUES, assertListingModerationPolicy, createListingLabelSigner, encodeSignedListingLabel, evaluateHydratedListingVisibility, evaluateHydratedReleaseWithdrawal, evaluateListingVisibility, evaluateReleaseWithdrawal, isListingLabelActive, isModerationFindingCategory, isVerifiedListingLabel, listingLabelKey, parseListingLabel, parseSignedListingLabel, reduceListingLabels, selectLatestApprovedRevision, selectLatestHydratedApprovedRevision, stateSources, subjectKindFromUri, verifyListingLabel, verifyListingLabelWithPublicKey };
//# sourceMappingURL=index.js.map