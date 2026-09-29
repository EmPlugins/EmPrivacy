import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/package/profileExtension.ts
var profileExtension_exports = /* @__PURE__ */ __exportAll({
	mainSchema: () => mainSchema,
	releasePolicySchema: () => releasePolicySchema
});
const _mainSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.profileExtension")),
	get releasePolicy() {
		return /* @__PURE__ */ v.optional(releasePolicySchema);
	},
	repository: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 1024)])
});
const _releasePolicySchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.profileExtension#releasePolicy")),
	approvers: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(/* @__PURE__ */ v.didString()), [/* @__PURE__ */ v.arrayLength(0, 32)])),
	confirmation: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.string()),
	requireProvenance: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean())
});
const mainSchema = _mainSchema;
const releasePolicySchema = _releasePolicySchema;

//#endregion
export { mainSchema, releasePolicySchema, profileExtension_exports as t };
//# sourceMappingURL=profileExtension.js.map