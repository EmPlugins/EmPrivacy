import { ClientResponseError } from "@atcute/client";

//#region src/listing-policy.ts
/** Return true only when the aggregator proves one complete observed release history. */
function isProvenFirstRelease(evidence) {
	return evidence.releaseHistoryComplete === true && Number.isSafeInteger(evidence.historicalReleaseCount) && evidence.historicalReleaseCount === 1;
}
function normalizeAcceptLabelers(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
function registryLabelerPolicy(acceptLabelers) {
	const normalized = normalizeAcceptLabelers(acceptLabelers);
	return normalized === void 0 ? { enforcement: "required" } : {
		enforcement: "required",
		acceptLabelers: normalized
	};
}
function registryLabelerPolicyKey(policy) {
	return `${policy.enforcement}\u0000${normalizeAcceptLabelers(policy.acceptLabelers) ?? "aggregator-default"}`;
}
async function mapListingStatus(request) {
	try {
		return {
			status: "passed",
			value: await request
		};
	} catch (error) {
		if (error instanceof ClientResponseError && error.error === "ListingUnavailable") return {
			status: "unavailable",
			reason: "listing-unavailable"
		};
		throw error;
	}
}

//#endregion
export { isProvenFirstRelease, mapListingStatus, registryLabelerPolicy, registryLabelerPolicyKey };
//# sourceMappingURL=listing-policy.js.map