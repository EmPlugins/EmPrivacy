import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import { publicAssessmentSchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/getAssessment.ts
var getAssessment_exports = /* @__PURE__ */ __exportAll({ mainSchema: () => mainSchema });
const _mainSchema = /* @__PURE__ */ v.query("com.emdashcms.experimental.labeler.getAssessment", {
	params: /* @__PURE__ */ v.object({ id: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 100)]) }),
	output: {
		type: "lex",
		get schema() {
			return publicAssessmentSchema;
		}
	}
});
const mainSchema = _mainSchema;

//#endregion
export { mainSchema, getAssessment_exports as t };
//# sourceMappingURL=getAssessment.js.map