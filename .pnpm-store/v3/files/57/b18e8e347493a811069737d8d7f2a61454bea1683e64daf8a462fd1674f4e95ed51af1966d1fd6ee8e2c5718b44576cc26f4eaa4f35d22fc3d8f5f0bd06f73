import { evaluateHydratedReleaseWithdrawal, parseListingLabel } from "@emdash-cms/registry-moderation";

//#region src/withdrawal.ts
function acceptedSources(policy) {
	if (!policy.acceptLabelers) return void 0;
	return policy.acceptLabelers.split(",").map((entry) => entry.trim().split(";", 1)[0]).filter((source) => Boolean(source));
}
/**
* Evaluates hydrated release-withdrawal labels through the shared moderation
* policy. Malformed hydrated labels fail closed instead of being skipped.
*/
function evaluateRegistryReleaseWithdrawal(release, policy, options = {}) {
	const labels = [];
	try {
		for (const label of release.labels ?? []) labels.push(parseListingLabel(label));
	} catch {
		return {
			withdrawn: true,
			applicableLabels: [],
			malformed: true
		};
	}
	return {
		...evaluateHydratedReleaseWithdrawal({
			uri: release.uri,
			cid: release.cid,
			labels,
			evaluatedAt: options.evaluatedAt ?? /* @__PURE__ */ new Date(),
			acceptedSources: acceptedSources(policy)
		}),
		malformed: false
	};
}

//#endregion
export { evaluateRegistryReleaseWithdrawal };
//# sourceMappingURL=withdrawal.js.map