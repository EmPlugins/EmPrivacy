import { fromString, toString } from "@atcute/cid";

//#region src/validation.ts
const DID_METHOD = "[a-z0-9]+";
const DID_ID_SEGMENT = "(?:[A-Za-z0-9._-]|%[0-9A-Fa-f]{2})+";
const DID = new RegExp(`^did:${DID_METHOD}:${DID_ID_SEGMENT}(?::${DID_ID_SEGMENT})*$`);
const RECORD_KEY = /^[A-Za-z0-9._~:-]{1,512}$/;
const RFC3339 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/;
function isDid(value) {
	return typeof value === "string" && DID.test(value);
}
function assertDid(value, field) {
	if (!isDid(value)) throw new TypeError(`${field} must be a valid DID`);
}
function assertCanonicalCid(value, field) {
	if (typeof value !== "string") throw new TypeError(`${field} must be a canonical CID`);
	try {
		if (toString(fromString(value)) !== value) throw new TypeError();
	} catch {
		throw new TypeError(`${field} must be a canonical CID`);
	}
}
function parseAtUri(value, field) {
	if (typeof value !== "string" || !value.startsWith("at://")) throw new TypeError(`${field} must be an at:// record URI`);
	const path = value.slice(5);
	const firstSlash = path.indexOf("/");
	const secondSlash = path.indexOf("/", firstSlash + 1);
	if (firstSlash <= 0 || secondSlash <= firstSlash + 1 || path.slice(secondSlash + 1).includes("/")) throw new TypeError(`${field} must include one collection and record key`);
	const authority = path.slice(0, firstSlash);
	const collection = path.slice(firstSlash + 1, secondSlash);
	const rkey = path.slice(secondSlash + 1);
	assertDid(authority, `${field} authority`);
	if (!RECORD_KEY.test(rkey) || rkey === "." || rkey === "..") throw new TypeError(`${field} must have a valid record key`);
	return {
		authority,
		collection,
		rkey
	};
}
function daysFromCivil(year, month, day) {
	const adjustedYear = year - (month <= 2n ? 1n : 0n);
	const era = (adjustedYear >= 0n ? adjustedYear : adjustedYear - 399n) / 400n;
	const yearOfEra = adjustedYear - era * 400n;
	const dayOfYear = (153n * (month + (month > 2n ? -3n : 9n)) + 2n) / 5n + day - 1n;
	const dayOfEra = yearOfEra * 365n + yearOfEra / 4n - yearOfEra / 100n + dayOfYear;
	return era * 146097n + dayOfEra - 719468n;
}
function isLeapYear(year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function parseInstant(value, field) {
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) throw new TypeError(`${field} must be a valid timestamp`);
		return {
			seconds: BigInt(Math.floor(value.getTime() / 1e3)),
			fraction: `${value.getMilliseconds()}`.padStart(3, "0")
		};
	}
	const match = RFC3339.exec(value);
	if (!match) throw new TypeError(`${field} must be a valid RFC 3339 timestamp`);
	const [, yearText, monthText, dayText, hourText, minuteText, secondText, fraction = "", zone] = match;
	const year = Number(yearText);
	const month = Number(monthText);
	const day = Number(dayText);
	const hour = Number(hourText);
	const minute = Number(minuteText);
	const second = Number(secondText);
	const monthLengths = [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	if (year === 0 || month < 1 || month > 12 || day < 1 || day > monthLengths[month - 1] || hour > 23 || minute > 59 || second > 59) throw new TypeError(`${field} must be a valid RFC 3339 timestamp`);
	let offset = 0n;
	if (zone !== "Z") {
		const zoneText = zone;
		const offsetHours = Number(zoneText.slice(1, 3));
		const offsetMinutes = Number(zoneText.slice(4, 6));
		if (offsetHours > 23 || offsetMinutes > 59 || zoneText === "-00:00") throw new TypeError(`${field} must be a valid RFC 3339 timestamp`);
		offset = BigInt(offsetHours * 3600 + offsetMinutes * 60) * (zoneText[0] === "+" ? 1n : -1n);
	}
	return {
		seconds: daysFromCivil(BigInt(year), BigInt(month), BigInt(day)) * 86400n + BigInt(hour * 3600 + minute * 60 + second) - offset,
		fraction
	};
}
function compareInstants(left, right) {
	if (left.seconds !== right.seconds) return left.seconds < right.seconds ? -1 : 1;
	const length = Math.max(left.fraction.length, right.fraction.length);
	for (let index = 0; index < length; index++) {
		const leftDigit = left.fraction[index] ?? "0";
		const rightDigit = right.fraction[index] ?? "0";
		if (leftDigit !== rightDigit) return leftDigit < rightDigit ? -1 : 1;
	}
	return 0;
}

//#endregion
//#region src/labels.ts
const PROFILE_COLLECTION = "com.emdashcms.experimental.package.profile";
const RELEASE_COLLECTION = "com.emdashcms.experimental.package.release";
const LISTING_LABELS = {
	passed: "listing-passed",
	pending: "listing-pending",
	review: "listing-review",
	error: "listing-error",
	blocked: "listing-blocked",
	overridden: "listing-overridden",
	takedown: "!takedown"
};
function listingLabelKey(label) {
	return `${label.src}\u0000${label.uri}\u0000${label.val}`;
}
function sameEvent(left, right) {
	return left.ver === right.ver && left.src === right.src && left.uri === right.uri && left.cid === right.cid && left.val === right.val && left.neg === true === (right.neg === true) && left.cts === right.cts && left.exp === right.exp;
}
function isActiveAt(label, now) {
	return label.neg !== true && (label.exp === void 0 || compareInstants(parseInstant(label.exp, "label.exp"), now) > 0);
}
function isListingLabelActive(label, evaluatedAt) {
	return isActiveAt(label, parseInstant(evaluatedAt, "evaluatedAt"));
}
function reduceListingLabels(labels, evaluatedAt) {
	const now = parseInstant(evaluatedAt, "evaluatedAt");
	const streams = /* @__PURE__ */ new Map();
	for (const label of labels) {
		const key = listingLabelKey(label);
		const entry = {
			label,
			cts: parseInstant(label.cts, "label.cts")
		};
		const stream = streams.get(key);
		if (stream) stream.push(entry);
		else streams.set(key, [entry]);
	}
	const states = [];
	for (const [key, stream] of streams) {
		const winners = stream.filter((candidate) => stream.every((other) => compareInstants(candidate.cts, other.cts) >= 0));
		const winner = winners[0];
		if (!winner) continue;
		const collision = winners.some((candidate) => !sameEvent(candidate.label, winner.label)) ? winners.map((candidate) => candidate.label) : [];
		states.push({
			key,
			winner: winner.label,
			active: collision.length === 0 && isActiveAt(winner.label, now),
			collision
		});
	}
	states.sort((left, right) => left.key.localeCompare(right.key));
	return {
		states,
		byKey: new Map(states.map((state) => [state.key, state]))
	};
}
function subjectKindFromUri(uri) {
	let collection;
	try {
		collection = parseAtUri(uri, "subject.uri").collection;
	} catch {
		return null;
	}
	if (collection === PROFILE_COLLECTION) return "profile";
	if (collection === RELEASE_COLLECTION) return "release";
	return null;
}

//#endregion
//#region src/schema.ts
function runtimeSchema(parser) {
	return {
		parse: parser,
		safeParse(value) {
			try {
				return {
					success: true,
					data: parser(value)
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof TypeError ? error : new TypeError("Invalid value", { cause: error })
				};
			}
		}
	};
}
function record(value, field, allowed) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${field} must be an object`);
	const output = {};
	for (const key of Object.keys(value)) {
		if (!allowed.includes(key)) throw new TypeError(`${field} contains unsupported field: ${key}`);
		output[key] = Object.getOwnPropertyDescriptor(value, key)?.value;
	}
	return output;
}
function dictionary(value, field) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${field} must be an object`);
	const output = {};
	for (const key of Object.keys(value)) output[key] = Object.getOwnPropertyDescriptor(value, key)?.value;
	return output;
}
function stringValue(value, field, maxLength = 2e4) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength) throw new TypeError(`${field} must be a non-empty string of at most ${maxLength} characters`);
	return value;
}
function optionalString(value, field, maxLength) {
	return value === void 0 ? void 0 : stringValue(value, field, maxLength);
}
function stringArray(value, field, maxItems) {
	if (!Array.isArray(value) || value.length > maxItems) throw new TypeError(`${field} must be an array of at most ${maxItems} strings`);
	return value.map((item, index) => stringValue(item, `${field}[${index}]`));
}
function optionalInteger(value, field) {
	if (value === void 0) return void 0;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new TypeError(`${field} must be a non-negative integer`);
	return value;
}
function integerValue(value, field) {
	const parsed = optionalInteger(value, field);
	if (parsed === void 0) throw new TypeError(`${field} is required`);
	return parsed;
}
function optionalBoolean(value, field) {
	if (value === void 0) return void 0;
	if (typeof value !== "boolean") throw new TypeError(`${field} must be boolean`);
	return value;
}

//#endregion
//#region src/policy.ts
const MODERATION_FINDING_CATEGORIES = [
	"explicit-sexual-content",
	"hateful-or-dehumanizing-content",
	"graphic-violence",
	"phishing-or-credential-solicitation",
	"material-impersonation",
	"scam-or-spam",
	"malicious-or-deceptive-link",
	"misleading-media-or-claims",
	"moderation-manipulation"
];
function isModerationFindingCategory(value) {
	return MODERATION_FINDING_CATEGORIES.some((category) => category === value);
}
const STATE_LABEL_VALUES = [
	LISTING_LABELS.passed,
	LISTING_LABELS.pending,
	LISTING_LABELS.review,
	LISTING_LABELS.error,
	LISTING_LABELS.blocked,
	LISTING_LABELS.overridden
];
function stateSources(policy) {
	return new Set([...policy.requiredPositiveSources, ...policy.acceptedStateSources]);
}
function assertListingModerationPolicy(value) {
	if (value.schemaVersion !== 1) throw new TypeError("policy.schemaVersion must be 1");
	if (!value.policyVersion) throw new TypeError("policy.policyVersion must not be empty");
	parseInstant(value.effectiveAt, "policy.effectiveAt");
	for (const [field, sources] of [
		["requiredPositiveSources", value.requiredPositiveSources],
		["acceptedStateSources", value.acceptedStateSources],
		["redactionSources", value.redactionSources]
	]) {
		if (new Set(sources).size !== sources.length) throw new TypeError(`policy.${field} must not contain duplicate sources`);
		for (const source of sources) assertDid(source, `policy.${field}`);
	}
	if (value.requiredPositiveSources.length === 0) throw new TypeError("policy.requiredPositiveSources must not be empty");
	if (value.autoPass !== "disabled" && value.autoPass !== "assisted") throw new TypeError("policy.autoPass must be disabled or assisted");
	if (new Set(value.prohibitedCategories).size !== value.prohibitedCategories.length) throw new TypeError("policy.prohibitedCategories must not contain duplicates");
	for (const category of value.prohibitedCategories) if (!MODERATION_FINDING_CATEGORIES.includes(category)) throw new TypeError(`policy contains unknown category: ${category}`);
}
function parsePolicy(value) {
	const policy = record(value, "policy", [
		"schemaVersion",
		"policyVersion",
		"effectiveAt",
		"requiredPositiveSources",
		"acceptedStateSources",
		"redactionSources",
		"autoPass",
		"prohibitedCategories"
	]);
	const autoPass = policy["autoPass"];
	if (autoPass !== "disabled" && autoPass !== "assisted") throw new TypeError("policy.autoPass must be disabled or assisted");
	if (policy["schemaVersion"] !== 1) throw new TypeError("policy.schemaVersion must be 1");
	const prohibitedValues = stringArray(policy["prohibitedCategories"], "policy.prohibitedCategories", MODERATION_FINDING_CATEGORIES.length);
	const prohibitedCategories = [];
	for (const category of prohibitedValues) {
		if (!isModerationFindingCategory(category)) throw new TypeError(`policy contains unknown category: ${category}`);
		prohibitedCategories.push(category);
	}
	const parsed = {
		schemaVersion: 1,
		policyVersion: stringValue(policy["policyVersion"], "policy.policyVersion", 128),
		effectiveAt: stringValue(policy["effectiveAt"], "policy.effectiveAt", 64),
		requiredPositiveSources: stringArray(policy["requiredPositiveSources"], "policy.requiredPositiveSources", 16),
		acceptedStateSources: stringArray(policy["acceptedStateSources"], "policy.acceptedStateSources", 16),
		redactionSources: stringArray(policy["redactionSources"], "policy.redactionSources", 16),
		autoPass,
		prohibitedCategories
	};
	assertListingModerationPolicy(parsed);
	return parsed;
}
const ListingModerationPolicySchema = runtimeSchema(parsePolicy);

//#endregion
export { assertCanonicalCid as C, parseInstant as D, parseAtUri as E, subjectKindFromUri as S, isDid as T, PROFILE_COLLECTION as _, isModerationFindingCategory as a, listingLabelKey as b, integerValue as c, optionalString as d, record as f, LISTING_LABELS as g, stringValue as h, assertListingModerationPolicy as i, optionalBoolean as l, stringArray as m, MODERATION_FINDING_CATEGORIES as n, stateSources as o, runtimeSchema as p, STATE_LABEL_VALUES as r, dictionary as s, ListingModerationPolicySchema as t, optionalInteger as u, RELEASE_COLLECTION as v, assertDid as w, reduceListingLabels as x, isListingLabelActive as y };
//# sourceMappingURL=policy-CL5r2RQH.js.map