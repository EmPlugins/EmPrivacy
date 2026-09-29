import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import * as v from "@atcute/lexicons/validations";
import * as ComAtprotoLabelDefs from "@atcute/atproto/types/label/defs";

//#region src/generated/types/com/emdashcms/experimental/aggregator/defs.ts
var defs_exports = /* @__PURE__ */ __exportAll({
	packageViewSchema: () => packageViewSchema,
	recordScopedBlobCacheSchema: () => recordScopedBlobCacheSchema,
	releaseViewSchema: () => releaseViewSchema
});
const _packageViewSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.aggregator.defs#packageView")),
	cid: /* @__PURE__ */ v.cidString(),
	did: /* @__PURE__ */ v.didString(),
	handle: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.handleString()),
	historicalReleaseCount: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.integer()),
	indexedAt: /* @__PURE__ */ v.datetimeString(),
	get labels() {
		return /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(ComAtprotoLabelDefs.labelSchema), [/* @__PURE__ */ v.arrayLength(0, 64)]));
	},
	latestVersion: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 64)])),
	profile: /* @__PURE__ */ v.unknown(),
	releaseHistoryComplete: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	slug: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)]),
	uri: /* @__PURE__ */ v.resourceUriString()
});
const _recordScopedBlobCacheSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.aggregator.defs#recordScopedBlobCache")),
	serviceEndpoint: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 2048)])
});
const _releaseViewSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.aggregator.defs#releaseView")),
	get artifactCaches() {
		return /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(/* @__PURE__ */ v.variant([recordScopedBlobCacheSchema])), [/* @__PURE__ */ v.arrayLength(0, 4)]));
	},
	cid: /* @__PURE__ */ v.cidString(),
	did: /* @__PURE__ */ v.didString(),
	indexedAt: /* @__PURE__ */ v.datetimeString(),
	get labels() {
		return /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(ComAtprotoLabelDefs.labelSchema), [/* @__PURE__ */ v.arrayLength(0, 64)]));
	},
	package: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)]),
	release: /* @__PURE__ */ v.unknown(),
	uri: /* @__PURE__ */ v.resourceUriString(),
	version: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)])
});
const packageViewSchema = _packageViewSchema;
const recordScopedBlobCacheSchema = _recordScopedBlobCacheSchema;
const releaseViewSchema = _releaseViewSchema;

//#endregion
export { packageViewSchema, recordScopedBlobCacheSchema, releaseViewSchema, defs_exports as t };
//# sourceMappingURL=defs.js.map