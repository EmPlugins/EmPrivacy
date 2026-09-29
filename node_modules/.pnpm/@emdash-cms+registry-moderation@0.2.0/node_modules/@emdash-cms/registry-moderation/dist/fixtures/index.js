import { g as LISTING_LABELS, n as MODERATION_FINDING_CATEGORIES } from "../policy-CL5r2RQH.js";

//#region src/fixtures/inputs.ts
const FIXTURE_PUBLISHER_DID = "did:plc:listingfixture000000000000";
const FIXTURE_PROFILE_URI = `at://${FIXTURE_PUBLISHER_DID}/com.emdashcms.experimental.package.profile/gallery`;
const FIXTURE_RELEASE_URI = `at://${FIXTURE_PUBLISHER_DID}/com.emdashcms.experimental.package.release/gallery:1.2.3`;
const FIXTURE_PROFILE_CID = "bafyreiabaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibae";
const FIXTURE_RELEASE_CID = "bafyreiacaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcai";
const PROFILE_MODERATION_INPUT_FIXTURE = {
	schemaVersion: 1,
	subject: {
		uri: FIXTURE_PROFILE_URI,
		cid: FIXTURE_PROFILE_CID,
		kind: "profile"
	},
	publisherDid: FIXTURE_PUBLISHER_DID,
	slug: "gallery",
	name: "Gallery",
	description: "A media gallery for EmDash.",
	keywords: ["gallery", "media"],
	license: "MIT",
	sections: {
		description: "## Gallery\n\nBuild galleries.",
		installation: "Install from the plugin registry.",
		faq: "Frequently asked questions.",
		changelog: "Version history.",
		security: "Report security issues privately."
	},
	authors: [{
		name: "Example Publisher",
		url: "https://publisher.example/about",
		email: "plugins@publisher.example"
	}],
	security: [{
		url: "https://publisher.example/security",
		email: "security@publisher.example"
	}],
	lastUpdated: "2026-08-24T00:00:00.000Z"
};
const RELEASE_MODERATION_INPUT_FIXTURE = {
	schemaVersion: 1,
	subject: {
		uri: FIXTURE_RELEASE_URI,
		cid: FIXTURE_RELEASE_CID,
		kind: "release"
	},
	publisherDid: FIXTURE_PUBLISHER_DID,
	packageSlug: "gallery",
	version: "1.2.3",
	repositoryUrl: "https://code.example/publisher/gallery",
	requires: {
		"env:emdash": ">=0.9.0",
		"env:astro": ">=6.0.0"
	},
	sbom: {
		format: "cyclonedx",
		url: "https://downloads.example/gallery/sbom.json"
	},
	media: [
		{
			kind: "icon",
			index: 0,
			id: "icon",
			url: "https://media.example/gallery/icon.png",
			checksum: "bafkiconchecksum",
			contentType: "image/png",
			width: 512,
			height: 512,
			language: "en",
			verified: {
				sha256: "11".repeat(32),
				mimeType: "image/png",
				byteLength: 1024,
				width: 512,
				height: 512,
				contentRef: "quarantine://media/icon"
			}
		},
		{
			kind: "banner",
			index: 0,
			url: "https://media.example/gallery/banner.webp",
			checksum: "bafkbannerchecksum"
		},
		{
			kind: "screenshot",
			index: 0,
			url: "https://media.example/gallery/screenshot-1.webp",
			checksum: "bafkscreenshotchecksum"
		}
	]
};
const MODERATION_INPUT_FIELDS_FIXTURE = {
	profile: [
		"slug",
		"name",
		"description",
		"keywords",
		"license",
		"sections",
		"authors.name",
		"authors.url",
		"authors.email",
		"security.url",
		"security.email",
		"lastUpdated"
	],
	release: [
		"packageSlug",
		"version",
		"repositoryUrl",
		"requires.keys",
		"requires.constraints",
		"sbom.format",
		"sbom.url",
		"media.icon",
		"media.banner",
		"media.screenshot"
	]
};

//#endregion
//#region src/fixtures/policy.ts
const FIXTURE_LABELER_DID = "did:web:listing-labeler.emdashcms.test";
const FIXTURE_STATE_DID = "did:web:state-labeler.emdashcms.test";
const FIXTURE_REDACTION_DID = "did:web:redaction-labeler.emdashcms.test";
const INITIAL_LISTING_POLICY_FIXTURE = {
	schemaVersion: 1,
	policyVersion: "listing-metadata-v1",
	effectiveAt: "2026-08-24T00:00:00.000Z",
	requiredPositiveSources: [FIXTURE_LABELER_DID],
	acceptedStateSources: [FIXTURE_STATE_DID],
	redactionSources: [FIXTURE_REDACTION_DID],
	autoPass: "disabled",
	prohibitedCategories: MODERATION_FINDING_CATEGORIES
};

//#endregion
//#region src/fixtures/prohibited-inputs.ts
const PROHIBITED_ASSESSMENT_INPUTS_FIXTURE = {
	neverFetch: [
		"profile.authors[].url",
		"profile.security[].url",
		"release.repo",
		"release.artifacts.package.url",
		"release.sbom.url",
		"release.provenance.url",
		"release.sourceArchive.url",
		"markdown.links[]"
	],
	neverModel: [
		"release.artifacts.package",
		"release.manifest",
		"release.declaredAccess",
		"release.sbom.checksum",
		"release.sbom.document",
		"release.provenance",
		"release.sourceArchive",
		"release.sourceRepository.content",
		"release.provides",
		"release.suggests",
		"release.auth",
		"release.extensions"
	],
	descriptorOnly: [
		"profile.authors[].url",
		"profile.security[].url",
		"release.repo",
		"release.sbom.format",
		"release.sbom.url"
	]
};

//#endregion
//#region src/fixtures/transitions.ts
const FIXTURE_NEW_PROFILE_CID = "bafyreiadambqgaydambqgaydambqgaydambqgaydambqgaydambqgaydam";
const OLD_PROFILE = {
	uri: FIXTURE_PROFILE_URI,
	cid: FIXTURE_PROFILE_CID,
	kind: "profile",
	publisherDid: FIXTURE_PUBLISHER_DID
};
const NEW_PROFILE = {
	...OLD_PROFILE,
	cid: FIXTURE_NEW_PROFILE_CID
};
function label(val, cts, options = {}) {
	return {
		ver: 1,
		src: FIXTURE_LABELER_DID,
		uri: FIXTURE_PROFILE_URI,
		cid: FIXTURE_PROFILE_CID,
		val,
		cts,
		...options
	};
}
const OLD_PASS = label(LISTING_LABELS.passed, "2026-08-24T00:00:01.000Z");
const NEW_PENDING = label(LISTING_LABELS.pending, "2026-08-24T00:00:02.000Z", { cid: FIXTURE_NEW_PROFILE_CID });
const NEW_REVIEW = label(LISTING_LABELS.review, "2026-08-24T00:00:03.000Z", { cid: FIXTURE_NEW_PROFILE_CID });
const NEW_ERROR = label(LISTING_LABELS.error, "2026-08-24T00:00:03.000Z", { cid: FIXTURE_NEW_PROFILE_CID });
const NEW_BLOCK = label(LISTING_LABELS.blocked, "2026-08-24T00:00:04.000Z", { cid: FIXTURE_NEW_PROFILE_CID });
const NEW_PASS = label(LISTING_LABELS.passed, "2026-08-24T00:00:05.000Z", { cid: FIXTURE_NEW_PROFILE_CID });
const NEGATE_NEW_PASS = label(LISTING_LABELS.passed, "2026-08-24T00:00:06.000Z", {
	cid: FIXTURE_NEW_PROFILE_CID,
	neg: true
});
const LISTING_TRANSITION_FIXTURES = [
	{
		id: "unlabelled",
		subject: OLD_PROFILE,
		labels: [],
		expectedState: "unavailable"
	},
	{
		id: "override-alone",
		subject: OLD_PROFILE,
		labels: [label(LISTING_LABELS.overridden, "2026-08-24T00:00:01.000Z")],
		expectedState: "unavailable"
	},
	{
		id: "old-pass",
		subject: OLD_PROFILE,
		labels: [OLD_PASS],
		expectedState: "passed"
	},
	{
		id: "old-pass-new-pending-old-view",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, NEW_PENDING],
		expectedState: "passed"
	},
	{
		id: "old-pass-new-pending-new-view",
		subject: NEW_PROFILE,
		labels: [OLD_PASS, NEW_PENDING],
		expectedState: "unavailable"
	},
	{
		id: "old-pass-new-review-old-view",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, NEW_REVIEW],
		expectedState: "passed"
	},
	{
		id: "old-pass-new-error-old-view",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, NEW_ERROR],
		expectedState: "passed"
	},
	{
		id: "new-review-unavailable",
		subject: NEW_PROFILE,
		labels: [OLD_PASS, NEW_REVIEW],
		expectedState: "unavailable"
	},
	{
		id: "new-error-unavailable",
		subject: NEW_PROFILE,
		labels: [OLD_PASS, NEW_ERROR],
		expectedState: "unavailable"
	},
	{
		id: "old-pass-new-block-old-view",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, NEW_BLOCK],
		expectedState: "passed"
	},
	{
		id: "new-pass-supersedes-old",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, NEW_PASS],
		expectedState: "unavailable"
	},
	{
		id: "new-pass-visible",
		subject: NEW_PROFILE,
		labels: [OLD_PASS, NEW_PASS],
		expectedState: "passed"
	},
	{
		id: "manual-approval-pass-and-override",
		subject: NEW_PROFILE,
		labels: [
			OLD_PASS,
			NEW_PASS,
			label(LISTING_LABELS.overridden, "2026-08-24T00:00:05.000Z", { cid: FIXTURE_NEW_PROFILE_CID })
		],
		expectedState: "passed"
	},
	{
		id: "blocking-new-pass-does-not-revive-old",
		subject: OLD_PROFILE,
		labels: [
			OLD_PASS,
			NEW_PASS,
			NEGATE_NEW_PASS,
			NEW_BLOCK
		],
		expectedState: "unavailable"
	},
	{
		id: "exact-cid-block",
		subject: NEW_PROFILE,
		labels: [
			OLD_PASS,
			NEW_PASS,
			NEW_BLOCK
		],
		expectedState: "blocked"
	},
	{
		id: "conflicting-terminal-state",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, label(LISTING_LABELS.review, "2026-08-24T00:00:02.000Z", { src: FIXTURE_STATE_DID })],
		expectedState: "conflict"
	},
	{
		id: "publisher-takedown",
		subject: OLD_PROFILE,
		labels: [OLD_PASS, label(LISTING_LABELS.takedown, "2026-08-24T00:00:02.000Z", {
			src: FIXTURE_REDACTION_DID,
			uri: FIXTURE_PUBLISHER_DID,
			cid: void 0
		})],
		expectedState: "takedown"
	},
	{
		id: "deleted",
		subject: {
			...OLD_PROFILE,
			deleted: true
		},
		labels: [OLD_PASS],
		expectedState: "deleted"
	},
	{
		id: "tombstoned",
		subject: {
			...OLD_PROFILE,
			tombstoned: true
		},
		labels: [OLD_PASS],
		expectedState: "tombstoned"
	}
];
const LABEL_TRANSITION_RULES_FIXTURE = [
	{
		actor: "automation",
		action: "start",
		issues: [LISTING_LABELS.pending],
		negatesForExactCid: [],
		preserves: [
			LISTING_LABELS.passed,
			LISTING_LABELS.blocked,
			LISTING_LABELS.overridden,
			LISTING_LABELS.takedown
		]
	},
	{
		actor: "automation",
		action: "complete-pass",
		issues: [LISTING_LABELS.passed],
		negatesForExactCid: [
			LISTING_LABELS.pending,
			LISTING_LABELS.review,
			LISTING_LABELS.error
		],
		preserves: [
			LISTING_LABELS.blocked,
			LISTING_LABELS.overridden,
			LISTING_LABELS.takedown
		]
	},
	{
		actor: "automation",
		action: "complete-review",
		issues: [LISTING_LABELS.review],
		negatesForExactCid: [
			LISTING_LABELS.pending,
			LISTING_LABELS.passed,
			LISTING_LABELS.error
		],
		preserves: [
			LISTING_LABELS.blocked,
			LISTING_LABELS.overridden,
			LISTING_LABELS.takedown
		]
	},
	{
		actor: "automation",
		action: "complete-error",
		issues: [LISTING_LABELS.error],
		negatesForExactCid: [
			LISTING_LABELS.pending,
			LISTING_LABELS.passed,
			LISTING_LABELS.review
		],
		preserves: [
			LISTING_LABELS.blocked,
			LISTING_LABELS.overridden,
			LISTING_LABELS.takedown
		]
	},
	{
		actor: "reviewer",
		action: "approve",
		issues: [LISTING_LABELS.passed, LISTING_LABELS.overridden],
		negatesForExactCid: [
			LISTING_LABELS.review,
			LISTING_LABELS.error,
			LISTING_LABELS.blocked
		],
		preserves: [LISTING_LABELS.takedown]
	},
	{
		actor: "reviewer",
		action: "block",
		issues: [LISTING_LABELS.blocked],
		negatesForExactCid: [LISTING_LABELS.passed, LISTING_LABELS.overridden],
		preserves: [LISTING_LABELS.takedown]
	},
	{
		actor: "admin",
		action: "takedown",
		issues: [LISTING_LABELS.takedown],
		negatesForExactCid: [],
		preserves: []
	},
	{
		actor: "admin",
		action: "retract-takedown",
		issues: [],
		negatesForExactCid: [],
		negatesForSubject: [LISTING_LABELS.takedown],
		preserves: []
	}
];

//#endregion
export { FIXTURE_LABELER_DID, FIXTURE_NEW_PROFILE_CID, FIXTURE_PROFILE_CID, FIXTURE_PROFILE_URI, FIXTURE_PUBLISHER_DID, FIXTURE_REDACTION_DID, FIXTURE_RELEASE_CID, FIXTURE_RELEASE_URI, FIXTURE_STATE_DID, INITIAL_LISTING_POLICY_FIXTURE, LABEL_TRANSITION_RULES_FIXTURE, LISTING_TRANSITION_FIXTURES, MODERATION_INPUT_FIELDS_FIXTURE, PROFILE_MODERATION_INPUT_FIXTURE, PROHIBITED_ASSESSMENT_INPUTS_FIXTURE, RELEASE_MODERATION_INPUT_FIXTURE };
//# sourceMappingURL=index.js.map