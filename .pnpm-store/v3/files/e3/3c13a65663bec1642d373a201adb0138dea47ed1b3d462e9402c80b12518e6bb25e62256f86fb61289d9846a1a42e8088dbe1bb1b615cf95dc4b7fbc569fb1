import { A as createListingLabelSigner, B as ListingLabelValue, C as InvalidListingLabelSignatureError, D as ListingLabelVerificationInput, E as ListingLabelSigner, F as verifyListingLabel, G as isListingLabelActive, H as PROFILE_COLLECTION, I as verifyListingLabelWithPublicKey, J as subjectKindFromUri, K as listingLabelKey, L as LISTING_LABELS, M as isVerifiedListingLabel, N as parseListingLabel, O as SignedListingLabel, P as parseSignedListingLabel, R as ListingLabelEvent, S as DidVerificationMethod, T as LabelDidResolver, U as RELEASE_COLLECTION, V as ListingSubjectKind, W as ReducedListingLabel, _ as assertListingModerationPolicy, a as ListingVisibilityState, b as RuntimeSchema, c as evaluateHydratedListingVisibility, d as selectLatestHydratedApprovedRevision, f as ListingModerationPolicy, g as STATE_LABEL_VALUES, h as ModerationFindingCategory, i as ListingVisibility, j as encodeSignedListingLabel, k as VerifiedListingLabel, l as evaluateListingVisibility, m as MODERATION_FINDING_CATEGORIES, n as EvaluateListingVisibilityInput, o as SelectApprovedRevisionInput, p as ListingModerationPolicySchema, q as reduceListingLabels, r as ListingSubjectRevision, s as SelectHydratedApprovedRevisionInput, t as EvaluateHydratedListingVisibilityInput, u as selectLatestApprovedRevision, v as isModerationFindingCategory, w as LabelDidDocument, x as CreateListingLabelSignerInput, y as stateSources, z as ListingLabelReduction } from "./evaluate-Cz319zzU.js";

//#region src/findings.d.ts
interface NormalizedModerationFinding {
  category: ModerationFindingCategory;
  recommendation: "none" | "review";
  confidence: number;
  summary: string;
  evidenceRefs: string[];
}
interface ModerationCoverage {
  text: "complete" | "not-present" | "unavailable";
  links: "complete" | "not-present" | "unavailable";
  media: "complete" | "not-present" | "partial" | "unavailable";
}
declare const NormalizedModerationFindingSchema: RuntimeSchema<NormalizedModerationFinding>;
//#endregion
//#region src/inputs.d.ts
interface ModerationSubject {
  uri: string;
  cid: string;
  kind: ListingSubjectKind;
}
interface CanonicalAuthorInput {
  name: string;
  url?: string;
  email?: string;
}
interface CanonicalContactInput {
  url?: string;
  email?: string;
}
interface CanonicalProfileModerationInput {
  schemaVersion: 1;
  subject: ModerationSubject & {
    kind: "profile";
  };
  publisherDid: string;
  slug: string;
  name?: string;
  description?: string;
  keywords: readonly string[];
  license: string;
  sections: Readonly<Record<string, string>>;
  authors: readonly CanonicalAuthorInput[];
  security: readonly CanonicalContactInput[];
  lastUpdated?: string;
}
type DisplayMediaKind = "icon" | "banner" | "screenshot";
declare const RENDERED_PROFILE_SECTION_KEYS: readonly ["description", "installation", "faq", "changelog", "security"];
interface CanonicalMediaDescriptor {
  kind: DisplayMediaKind;
  index: number;
  id?: string;
  url: string;
  checksum: string;
  contentType?: string;
  requiresAuth?: boolean;
  releaseAsset?: boolean;
  width?: number;
  height?: number;
  language?: string;
  verified?: {
    sha256: string;
    mimeType: string;
    byteLength: number;
    width: number;
    height: number;
    contentRef: string;
  };
}
interface CanonicalReleaseModerationInput {
  schemaVersion: 1;
  subject: ModerationSubject & {
    kind: "release";
  };
  publisherDid: string;
  packageSlug: string;
  version: string;
  repositoryUrl?: string;
  requires: Readonly<Record<string, string>>;
  sbom?: {
    format?: string;
    url?: string;
  };
  media: readonly CanonicalMediaDescriptor[];
}
declare const CanonicalProfileModerationInputSchema: RuntimeSchema<CanonicalProfileModerationInput>;
declare const CanonicalReleaseModerationInputSchema: RuntimeSchema<CanonicalReleaseModerationInput>;
//#endregion
//#region src/withdrawal.d.ts
declare const LEGACY_RELEASE_WITHDRAWAL_LABEL = "security:yanked";
declare const RELEASE_WITHDRAWAL_LABEL = "security-yanked";
interface ReleaseWithdrawalInput<Label extends ListingLabelEvent> {
  uri: string;
  cid: string;
  labels: readonly Label[];
  evaluatedAt: Date | string;
  acceptedSources?: readonly string[];
}
interface ReleaseWithdrawalResult {
  withdrawn: boolean;
  applicableLabels: readonly ListingLabelEvent[];
}
declare function evaluateReleaseWithdrawal(input: ReleaseWithdrawalInput<VerifiedListingLabel>): ReleaseWithdrawalResult;
/** Evaluates labels loaded from a store that authenticated them before persistence. */
declare function evaluateHydratedReleaseWithdrawal(input: ReleaseWithdrawalInput<ListingLabelEvent>): ReleaseWithdrawalResult;
//#endregion
export { CanonicalAuthorInput, CanonicalContactInput, CanonicalMediaDescriptor, CanonicalProfileModerationInput, CanonicalProfileModerationInputSchema, CanonicalReleaseModerationInput, CanonicalReleaseModerationInputSchema, CreateListingLabelSignerInput, DidVerificationMethod, DisplayMediaKind, EvaluateHydratedListingVisibilityInput, EvaluateListingVisibilityInput, InvalidListingLabelSignatureError, LEGACY_RELEASE_WITHDRAWAL_LABEL, LISTING_LABELS, LabelDidDocument, LabelDidResolver, ListingLabelEvent, ListingLabelReduction, ListingLabelSigner, ListingLabelValue, ListingLabelVerificationInput, ListingModerationPolicy, ListingModerationPolicySchema, ListingSubjectKind, ListingSubjectRevision, ListingVisibility, ListingVisibilityState, MODERATION_FINDING_CATEGORIES, ModerationCoverage, ModerationFindingCategory, ModerationSubject, NormalizedModerationFinding, NormalizedModerationFindingSchema, PROFILE_COLLECTION, RELEASE_COLLECTION, RELEASE_WITHDRAWAL_LABEL, RENDERED_PROFILE_SECTION_KEYS, ReducedListingLabel, ReleaseWithdrawalInput, ReleaseWithdrawalResult, type RuntimeSchema, STATE_LABEL_VALUES, SelectApprovedRevisionInput, SelectHydratedApprovedRevisionInput, SignedListingLabel, VerifiedListingLabel, assertListingModerationPolicy, createListingLabelSigner, encodeSignedListingLabel, evaluateHydratedListingVisibility, evaluateHydratedReleaseWithdrawal, evaluateListingVisibility, evaluateReleaseWithdrawal, isListingLabelActive, isModerationFindingCategory, isVerifiedListingLabel, listingLabelKey, parseListingLabel, parseSignedListingLabel, reduceListingLabels, selectLatestApprovedRevision, selectLatestHydratedApprovedRevision, stateSources, subjectKindFromUri, verifyListingLabel, verifyListingLabelWithPublicKey };
//# sourceMappingURL=index.d.ts.map