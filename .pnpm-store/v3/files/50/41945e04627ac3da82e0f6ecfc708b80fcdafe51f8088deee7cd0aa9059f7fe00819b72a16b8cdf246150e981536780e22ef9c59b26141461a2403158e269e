import { R as ListingLabelEvent, a as ListingVisibilityState, r as ListingSubjectRevision } from "../evaluate-Cz319zzU.js";

//#region src/fixtures/inputs.d.ts
declare const FIXTURE_PUBLISHER_DID = "did:plc:listingfixture000000000000";
declare const FIXTURE_PROFILE_URI = "at://did:plc:listingfixture000000000000/com.emdashcms.experimental.package.profile/gallery";
declare const FIXTURE_RELEASE_URI = "at://did:plc:listingfixture000000000000/com.emdashcms.experimental.package.release/gallery:1.2.3";
declare const FIXTURE_PROFILE_CID = "bafyreiabaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibae";
declare const FIXTURE_RELEASE_CID = "bafyreiacaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcai";
declare const PROFILE_MODERATION_INPUT_FIXTURE: {
  readonly schemaVersion: 1;
  readonly subject: {
    readonly uri: "at://did:plc:listingfixture000000000000/com.emdashcms.experimental.package.profile/gallery";
    readonly cid: "bafyreiabaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibae";
    readonly kind: "profile";
  };
  readonly publisherDid: "did:plc:listingfixture000000000000";
  readonly slug: "gallery";
  readonly name: "Gallery";
  readonly description: "A media gallery for EmDash.";
  readonly keywords: readonly ["gallery", "media"];
  readonly license: "MIT";
  readonly sections: {
    readonly description: "## Gallery\n\nBuild galleries.";
    readonly installation: "Install from the plugin registry.";
    readonly faq: "Frequently asked questions.";
    readonly changelog: "Version history.";
    readonly security: "Report security issues privately.";
  };
  readonly authors: readonly [{
    readonly name: "Example Publisher";
    readonly url: "https://publisher.example/about";
    readonly email: "plugins@publisher.example";
  }];
  readonly security: readonly [{
    readonly url: "https://publisher.example/security";
    readonly email: "security@publisher.example";
  }];
  readonly lastUpdated: "2026-08-24T00:00:00.000Z";
};
declare const RELEASE_MODERATION_INPUT_FIXTURE: {
  readonly schemaVersion: 1;
  readonly subject: {
    readonly uri: "at://did:plc:listingfixture000000000000/com.emdashcms.experimental.package.release/gallery:1.2.3";
    readonly cid: "bafyreiacaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcaibaeaqcai";
    readonly kind: "release";
  };
  readonly publisherDid: "did:plc:listingfixture000000000000";
  readonly packageSlug: "gallery";
  readonly version: "1.2.3";
  readonly repositoryUrl: "https://code.example/publisher/gallery";
  readonly requires: {
    readonly "env:emdash": ">=0.9.0";
    readonly "env:astro": ">=6.0.0";
  };
  readonly sbom: {
    readonly format: "cyclonedx";
    readonly url: "https://downloads.example/gallery/sbom.json";
  };
  readonly media: readonly [{
    readonly kind: "icon";
    readonly index: 0;
    readonly id: "icon";
    readonly url: "https://media.example/gallery/icon.png";
    readonly checksum: "bafkiconchecksum";
    readonly contentType: "image/png";
    readonly width: 512;
    readonly height: 512;
    readonly language: "en";
    readonly verified: {
      readonly sha256: string;
      readonly mimeType: "image/png";
      readonly byteLength: 1024;
      readonly width: 512;
      readonly height: 512;
      readonly contentRef: "quarantine://media/icon";
    };
  }, {
    readonly kind: "banner";
    readonly index: 0;
    readonly url: "https://media.example/gallery/banner.webp";
    readonly checksum: "bafkbannerchecksum";
  }, {
    readonly kind: "screenshot";
    readonly index: 0;
    readonly url: "https://media.example/gallery/screenshot-1.webp";
    readonly checksum: "bafkscreenshotchecksum";
  }];
};
declare const MODERATION_INPUT_FIELDS_FIXTURE: {
  readonly profile: readonly ["slug", "name", "description", "keywords", "license", "sections", "authors.name", "authors.url", "authors.email", "security.url", "security.email", "lastUpdated"];
  readonly release: readonly ["packageSlug", "version", "repositoryUrl", "requires.keys", "requires.constraints", "sbom.format", "sbom.url", "media.icon", "media.banner", "media.screenshot"];
};
//#endregion
//#region src/fixtures/policy.d.ts
declare const FIXTURE_LABELER_DID = "did:web:listing-labeler.emdashcms.test";
declare const FIXTURE_STATE_DID = "did:web:state-labeler.emdashcms.test";
declare const FIXTURE_REDACTION_DID = "did:web:redaction-labeler.emdashcms.test";
declare const INITIAL_LISTING_POLICY_FIXTURE: {
  readonly schemaVersion: 1;
  readonly policyVersion: "listing-metadata-v1";
  readonly effectiveAt: "2026-08-24T00:00:00.000Z";
  readonly requiredPositiveSources: readonly ["did:web:listing-labeler.emdashcms.test"];
  readonly acceptedStateSources: readonly ["did:web:state-labeler.emdashcms.test"];
  readonly redactionSources: readonly ["did:web:redaction-labeler.emdashcms.test"];
  readonly autoPass: "disabled";
  readonly prohibitedCategories: readonly ["explicit-sexual-content", "hateful-or-dehumanizing-content", "graphic-violence", "phishing-or-credential-solicitation", "material-impersonation", "scam-or-spam", "malicious-or-deceptive-link", "misleading-media-or-claims", "moderation-manipulation"];
};
//#endregion
//#region src/fixtures/prohibited-inputs.d.ts
declare const PROHIBITED_ASSESSMENT_INPUTS_FIXTURE: {
  readonly neverFetch: readonly ["profile.authors[].url", "profile.security[].url", "release.repo", "release.artifacts.package.url", "release.sbom.url", "release.provenance.url", "release.sourceArchive.url", "markdown.links[]"];
  readonly neverModel: readonly ["release.artifacts.package", "release.manifest", "release.declaredAccess", "release.sbom.checksum", "release.sbom.document", "release.provenance", "release.sourceArchive", "release.sourceRepository.content", "release.provides", "release.suggests", "release.auth", "release.extensions"];
  readonly descriptorOnly: readonly ["profile.authors[].url", "profile.security[].url", "release.repo", "release.sbom.format", "release.sbom.url"];
};
//#endregion
//#region src/fixtures/transitions.d.ts
declare const FIXTURE_NEW_PROFILE_CID = "bafyreiadambqgaydambqgaydambqgaydambqgaydambqgaydambqgaydam";
interface ListingTransitionFixture {
  id: string;
  subject: ListingSubjectRevision;
  labels: readonly ListingLabelEvent[];
  expectedState: ListingVisibilityState;
}
declare const LISTING_TRANSITION_FIXTURES: readonly ListingTransitionFixture[];
declare const LABEL_TRANSITION_RULES_FIXTURE: readonly [{
  readonly actor: "automation";
  readonly action: "start";
  readonly issues: readonly ["listing-pending"];
  readonly negatesForExactCid: readonly [];
  readonly preserves: readonly ["listing-passed", "listing-blocked", "listing-overridden", "!takedown"];
}, {
  readonly actor: "automation";
  readonly action: "complete-pass";
  readonly issues: readonly ["listing-passed"];
  readonly negatesForExactCid: readonly ["listing-pending", "listing-review", "listing-error"];
  readonly preserves: readonly ["listing-blocked", "listing-overridden", "!takedown"];
}, {
  readonly actor: "automation";
  readonly action: "complete-review";
  readonly issues: readonly ["listing-review"];
  readonly negatesForExactCid: readonly ["listing-pending", "listing-passed", "listing-error"];
  readonly preserves: readonly ["listing-blocked", "listing-overridden", "!takedown"];
}, {
  readonly actor: "automation";
  readonly action: "complete-error";
  readonly issues: readonly ["listing-error"];
  readonly negatesForExactCid: readonly ["listing-pending", "listing-passed", "listing-review"];
  readonly preserves: readonly ["listing-blocked", "listing-overridden", "!takedown"];
}, {
  readonly actor: "reviewer";
  readonly action: "approve";
  readonly issues: readonly ["listing-passed", "listing-overridden"];
  readonly negatesForExactCid: readonly ["listing-review", "listing-error", "listing-blocked"];
  readonly preserves: readonly ["!takedown"];
}, {
  readonly actor: "reviewer";
  readonly action: "block";
  readonly issues: readonly ["listing-blocked"];
  readonly negatesForExactCid: readonly ["listing-passed", "listing-overridden"];
  readonly preserves: readonly ["!takedown"];
}, {
  readonly actor: "admin";
  readonly action: "takedown";
  readonly issues: readonly ["!takedown"];
  readonly negatesForExactCid: readonly [];
  readonly preserves: readonly [];
}, {
  readonly actor: "admin";
  readonly action: "retract-takedown";
  readonly issues: readonly [];
  readonly negatesForExactCid: readonly [];
  readonly negatesForSubject: readonly ["!takedown"];
  readonly preserves: readonly [];
}];
//#endregion
export { FIXTURE_LABELER_DID, FIXTURE_NEW_PROFILE_CID, FIXTURE_PROFILE_CID, FIXTURE_PROFILE_URI, FIXTURE_PUBLISHER_DID, FIXTURE_REDACTION_DID, FIXTURE_RELEASE_CID, FIXTURE_RELEASE_URI, FIXTURE_STATE_DID, INITIAL_LISTING_POLICY_FIXTURE, LABEL_TRANSITION_RULES_FIXTURE, LISTING_TRANSITION_FIXTURES, ListingTransitionFixture, MODERATION_INPUT_FIELDS_FIXTURE, PROFILE_MODERATION_INPUT_FIXTURE, PROHIBITED_ASSESSMENT_INPUTS_FIXTURE, RELEASE_MODERATION_INPUT_FIXTURE };
//# sourceMappingURL=index.d.ts.map