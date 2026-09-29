import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import { publicAssessmentSchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/listAssessments.ts
var listAssessments_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema });
const _mainSchema = /* @__PURE__ */ v.query("com.emdashcms.experimental.labeler.listAssessments", {
	params: /* @__PURE__ */ v.object({
		cid: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.cidString()),
		cursor: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 1024)])),
		kind: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.string()),
		limit: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 100)]), 50),
		state: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.string()),
		uri: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.resourceUriString())
	}),
	output: {
		type: "lex",
		schema: /* @__PURE__ */ v.object({
			get assessments() {
				return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(publicAssessmentSchema), [/* @__PURE__ */ v.arrayLength(0, 100)]);
			},
			cursor: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 1024)]))
		})
	}
});
const mainSchema = _mainSchema;

//#endregion
export { mainSchema, listAssessments_exports as t };
//# sourceMappingURL=listAssessments.js.map