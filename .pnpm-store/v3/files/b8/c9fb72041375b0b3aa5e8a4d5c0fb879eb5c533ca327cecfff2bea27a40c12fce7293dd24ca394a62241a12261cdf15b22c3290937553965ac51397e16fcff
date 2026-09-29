import { RegistryLabelerPolicy } from "./listing-policy.js";
import { ValidatedReleaseView } from "./discovery/index.js";
import { ReleaseWithdrawalResult } from "@emdash-cms/registry-moderation";

//#region src/withdrawal.d.ts
interface RegistryReleaseWithdrawalResult extends ReleaseWithdrawalResult {
  malformed: boolean;
}
interface RegistryReleaseWithdrawalOptions {
  evaluatedAt?: Date | string;
}
/**
 * Evaluates hydrated release-withdrawal labels through the shared moderation
 * policy. Malformed hydrated labels fail closed instead of being skipped.
 */
declare function evaluateRegistryReleaseWithdrawal(release: Pick<ValidatedReleaseView, "uri" | "cid" | "labels">, policy: RegistryLabelerPolicy, options?: RegistryReleaseWithdrawalOptions): RegistryReleaseWithdrawalResult;
//#endregion
export { RegistryReleaseWithdrawalOptions, RegistryReleaseWithdrawalResult, evaluateRegistryReleaseWithdrawal };
//# sourceMappingURL=withdrawal.d.ts.map