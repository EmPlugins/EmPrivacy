import { P256PublicKey } from "@atcute/crypto";

//#region src/labels.d.ts
declare const PROFILE_COLLECTION = "com.emdashcms.experimental.package.profile";
declare const RELEASE_COLLECTION = "com.emdashcms.experimental.package.release";
declare const LISTING_LABELS: {
  readonly passed: "listing-passed";
  readonly pending: "listing-pending";
  readonly review: "listing-review";
  readonly error: "listing-error";
  readonly blocked: "listing-blocked";
  readonly overridden: "listing-overridden";
  readonly takedown: "!takedown";
};
type ListingLabelValue = (typeof LISTING_LABELS)[keyof typeof LISTING_LABELS];
type ListingSubjectKind = "profile" | "release";
interface ListingLabelEvent {
  ver: 1;
  src: string;
  uri: string;
  val: ListingLabelValue | (string & {});
  cts: string;
  cid?: string;
  neg?: boolean;
  exp?: string;
}
interface ReducedListingLabel {
  key: string;
  winner: ListingLabelEvent;
  active: boolean;
  collision: readonly ListingLabelEvent[];
}
interface ListingLabelReduction {
  states: readonly ReducedListingLabel[];
  byKey: ReadonlyMap<string, ReducedListingLabel>;
}
declare function listingLabelKey(label: Pick<ListingLabelEvent, "src" | "uri" | "val">): string;
declare function isListingLabelActive(label: ListingLabelEvent, evaluatedAt: Date | string): boolean;
declare function reduceListingLabels(labels: readonly ListingLabelEvent[], evaluatedAt: Date | string): ListingLabelReduction;
declare function subjectKindFromUri(uri: string): ListingSubjectKind | null;
//#endregion
//#region src/label-crypto.d.ts
interface SignedListingLabel extends ListingLabelEvent {
  sig: Uint8Array;
}
declare const verifiedListingLabel: unique symbol;
type VerifiedListingLabel = Readonly<ListingLabelEvent> & {
  readonly [verifiedListingLabel]: true;
};
interface DidVerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}
interface LabelDidDocument {
  id: string;
  verificationMethod?: readonly DidVerificationMethod[];
}
type LabelDidResolver = (did: string) => Promise<LabelDidDocument>;
interface CreateListingLabelSignerInput {
  issuerDid: string;
  privateKey: string;
  resolveDid: LabelDidResolver;
}
interface ListingLabelSigner {
  readonly issuerDid: string;
  sign(label: Omit<ListingLabelEvent, "src">): Promise<SignedListingLabel>;
}
interface ListingLabelVerificationInput {
  label: SignedListingLabel;
  resolveDid: LabelDidResolver;
}
declare class InvalidListingLabelSignatureError extends TypeError {
  constructor(message: string);
}
declare function parseListingLabel(value: unknown): ListingLabelEvent;
declare function parseSignedListingLabel(value: unknown): SignedListingLabel;
declare function encodeSignedListingLabel(label: SignedListingLabel): Uint8Array;
declare function createListingLabelSigner(input: CreateListingLabelSignerInput): Promise<ListingLabelSigner>;
declare function isVerifiedListingLabel(value: unknown): value is VerifiedListingLabel;
declare function verifyListingLabelWithPublicKey(input: {
  label: SignedListingLabel;
  expectedSource: string;
  publicKey: P256PublicKey;
}): Promise<VerifiedListingLabel>;
declare function verifyListingLabel(input: ListingLabelVerificationInput): Promise<VerifiedListingLabel>;
//#endregion
//#region src/schema.d.ts
interface ParseSuccess<T> {
  success: true;
  data: T;
}
interface ParseFailure {
  success: false;
  error: TypeError;
}
interface RuntimeSchema<T> {
  parse(value: unknown): T;
  safeParse(value: unknown): ParseSuccess<T> | ParseFailure;
}
//#endregion
//#region src/policy.d.ts
interface ListingModerationPolicy {
  schemaVersion: 1;
  policyVersion: string;
  effectiveAt: string;
  requiredPositiveSources: readonly string[];
  acceptedStateSources: readonly string[];
  redactionSources: readonly string[];
  autoPass: "disabled" | "assisted";
  prohibitedCategories: readonly ModerationFindingCategory[];
}
declare const MODERATION_FINDING_CATEGORIES: readonly ["explicit-sexual-content", "hateful-or-dehumanizing-content", "graphic-violence", "phishing-or-credential-solicitation", "material-impersonation", "scam-or-spam", "malicious-or-deceptive-link", "misleading-media-or-claims", "moderation-manipulation"];
type ModerationFindingCategory = (typeof MODERATION_FINDING_CATEGORIES)[number];
declare function isModerationFindingCategory(value: unknown): value is ModerationFindingCategory;
declare const STATE_LABEL_VALUES: readonly ListingLabelValue[];
declare function stateSources(policy: ListingModerationPolicy): ReadonlySet<string>;
declare function assertListingModerationPolicy(value: ListingModerationPolicy): void;
declare const ListingModerationPolicySchema: RuntimeSchema<ListingModerationPolicy>;
//#endregion
//#region src/evaluate.d.ts
type ListingVisibilityState = "deleted" | "tombstoned" | "takedown" | "blocked" | "conflict" | "passed" | "unavailable";
interface ListingSubjectRevision {
  uri: string;
  cid: string;
  kind: ListingSubjectKind;
  publisherDid: string;
  profileUri?: string;
  deleted?: boolean;
  tombstoned?: boolean;
}
interface EvaluateListingVisibilityInput {
  subject: ListingSubjectRevision;
  policy: ListingModerationPolicy;
  labels: readonly VerifiedListingLabel[];
  evaluatedAt: Date | string;
}
interface EvaluateHydratedListingVisibilityInput extends Omit<EvaluateListingVisibilityInput, "labels"> {
  labels: readonly ListingLabelEvent[];
}
interface ListingVisibility {
  visible: boolean;
  state: ListingVisibilityState;
  reasonCodes: readonly string[];
  positiveSources: readonly string[];
  missingPositiveSources: readonly string[];
  applicableLabels: readonly ListingLabelEvent[];
}
declare function evaluateListingVisibility(input: EvaluateListingVisibilityInput): ListingVisibility;
/**
 * Evaluates structurally validated labels loaded from an already authenticated store.
 * This function does not verify signatures and must never receive network or client input.
 */
declare function evaluateHydratedListingVisibility(input: EvaluateHydratedListingVisibilityInput): ListingVisibility;
interface SelectApprovedRevisionInput {
  revisions: readonly (ListingSubjectRevision & {
    observedAt: string;
  })[];
  policy: ListingModerationPolicy;
  labels: readonly VerifiedListingLabel[];
  evaluatedAt: Date | string;
  currentDeleted?: boolean;
}
interface SelectHydratedApprovedRevisionInput extends Omit<SelectApprovedRevisionInput, "labels"> {
  labels: readonly ListingLabelEvent[];
}
declare function selectLatestApprovedRevision(input: SelectApprovedRevisionInput): ListingSubjectRevision | null;
/** Selects from labels whose signatures were verified before persistence. */
declare function selectLatestHydratedApprovedRevision(input: SelectHydratedApprovedRevisionInput): ListingSubjectRevision | null;
//#endregion
export { createListingLabelSigner as A, ListingLabelValue as B, InvalidListingLabelSignatureError as C, ListingLabelVerificationInput as D, ListingLabelSigner as E, verifyListingLabel as F, isListingLabelActive as G, PROFILE_COLLECTION as H, verifyListingLabelWithPublicKey as I, subjectKindFromUri as J, listingLabelKey as K, LISTING_LABELS as L, isVerifiedListingLabel as M, parseListingLabel as N, SignedListingLabel as O, parseSignedListingLabel as P, ListingLabelEvent as R, DidVerificationMethod as S, LabelDidResolver as T, RELEASE_COLLECTION as U, ListingSubjectKind as V, ReducedListingLabel as W, assertListingModerationPolicy as _, ListingVisibilityState as a, RuntimeSchema as b, evaluateHydratedListingVisibility as c, selectLatestHydratedApprovedRevision as d, ListingModerationPolicy as f, STATE_LABEL_VALUES as g, ModerationFindingCategory as h, ListingVisibility as i, encodeSignedListingLabel as j, VerifiedListingLabel as k, evaluateListingVisibility as l, MODERATION_FINDING_CATEGORIES as m, EvaluateListingVisibilityInput as n, SelectApprovedRevisionInput as o, ListingModerationPolicySchema as p, reduceListingLabels as q, ListingSubjectRevision as r, SelectHydratedApprovedRevisionInput as s, EvaluateHydratedListingVisibilityInput as t, selectLatestApprovedRevision as u, isModerationFindingCategory as v, LabelDidDocument as w, CreateListingLabelSignerInput as x, stateSources as y, ListingLabelReduction as z };
//# sourceMappingURL=evaluate-Cz319zzU.d.ts.map