import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/defs.ts
var defs_exports = /* @__PURE__ */ __exportAll({
	assessmentSubjectSchema: () => assessmentSubjectSchema,
	coverageSchema: () => coverageSchema,
	currentAssessmentViewSchema: () => currentAssessmentViewSchema,
	labelDefinitionSchema: () => labelDefinitionSchema,
	labelerPolicySchema: () => labelerPolicySchema,
	manualDecisionSchema: () => manualDecisionSchema,
	modelDescriptorSchema: () => modelDescriptorSchema,
	publicApiSchema: () => publicApiSchema,
	publicAssessmentSchema: () => publicAssessmentSchema,
	publicFindingSchema: () => publicFindingSchema,
	reasonCodeDefinitionSchema: () => reasonCodeDefinitionSchema,
	signedLabelSchema: () => signedLabelSchema,
	subjectPolicySchema: () => subjectPolicySchema
});
const _assessmentSubjectSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#assessmentSubject")),
	cid: /* @__PURE__ */ v.cidString(),
	kind: /* @__PURE__ */ v.string(),
	uri: /* @__PURE__ */ v.resourceUriString()
});
const _coverageSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#coverage")),
	links: /* @__PURE__ */ v.string(),
	media: /* @__PURE__ */ v.string(),
	text: /* @__PURE__ */ v.string()
});
const _currentAssessmentViewSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#currentAssessmentView")),
	get activeLabels() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(signedLabelSchema), [/* @__PURE__ */ v.arrayLength(0, 16)]);
	},
	get assessment() {
		return publicAssessmentSchema;
	},
	src: /* @__PURE__ */ v.didString(),
	get subject() {
		return assessmentSubjectSchema;
	}
});
const _labelDefinitionSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#labelDefinition")),
	issuanceModes: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(/* @__PURE__ */ v.string()), [/* @__PURE__ */ v.arrayLength(1, 3)]),
	officialEffect: /* @__PURE__ */ v.string(),
	subjectKinds: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(/* @__PURE__ */ v.string()), [/* @__PURE__ */ v.arrayLength(1, 2)]),
	value: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)])
});
const _labelerPolicySchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#labelerPolicy")),
	assessmentSchemaVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1)]),
	effectiveAt: /* @__PURE__ */ v.datetimeString(),
	labelerDid: /* @__PURE__ */ v.didString(),
	get labels() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(labelDefinitionSchema), [/* @__PURE__ */ v.arrayLength(1, 16)]);
	},
	get models() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(modelDescriptorSchema), [/* @__PURE__ */ v.arrayLength(0, 4)]);
	},
	parserVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	policyVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	get publicApi() {
		return publicApiSchema;
	},
	get reasonCodes() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(reasonCodeDefinitionSchema), [/* @__PURE__ */ v.arrayLength(0, 64)]);
	},
	schemaVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 1)]),
	get supportedSubjects() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(subjectPolicySchema), [/* @__PURE__ */ v.arrayLength(1, 2)]);
	}
});
const _manualDecisionSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#manualDecision")),
	decidedAt: /* @__PURE__ */ v.datetimeString(),
	outcome: /* @__PURE__ */ v.string(),
	reasonCode: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)])
});
const _modelDescriptorSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#modelDescriptor")),
	modelId: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 256)]),
	modelVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	promptHash: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	provider: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 64)]),
	purpose: /* @__PURE__ */ v.string()
});
const _publicApiSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#publicApi")),
	baseUrl: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 2048)]),
	getAssessmentNsid: /* @__PURE__ */ v.nsidString(),
	getCurrentAssessmentNsid: /* @__PURE__ */ v.nsidString(),
	getPolicyNsid: /* @__PURE__ */ v.nsidString(),
	listAssessmentsNsid: /* @__PURE__ */ v.nsidString()
});
const _publicAssessmentSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#publicAssessment")),
	assessmentSchemaVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1)]),
	completedAt: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.datetimeString()),
	get coverage() {
		return coverageSchema;
	},
	createdAt: /* @__PURE__ */ v.datetimeString(),
	get findings() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(publicFindingSchema), [/* @__PURE__ */ v.arrayLength(0, 32)]);
	},
	id: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 100)]),
	get labels() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(signedLabelSchema), [/* @__PURE__ */ v.arrayLength(0, 16)]);
	},
	get manualDecision() {
		return /* @__PURE__ */ v.optional(manualDecisionSchema);
	},
	get models() {
		return /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(modelDescriptorSchema), [/* @__PURE__ */ v.arrayLength(0, 4)]);
	},
	parserVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	policyVersion: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	reasonCodes: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)])), [/* @__PURE__ */ v.arrayLength(0, 32)]),
	src: /* @__PURE__ */ v.didString(),
	state: /* @__PURE__ */ v.string(),
	get subject() {
		return assessmentSubjectSchema;
	},
	summary: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 1024)])),
	supersededByAssessmentId: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 100)]))
});
const _publicFindingSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#publicFinding")),
	category: /* @__PURE__ */ v.string(),
	reasonCode: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)]),
	summary: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 512)])
});
const _reasonCodeDefinitionSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#reasonCodeDefinition")),
	code: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)]),
	description: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 512)])
});
const _signedLabelSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#signedLabel")),
	cid: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.cidString()),
	cts: /* @__PURE__ */ v.datetimeString(),
	exp: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.datetimeString()),
	neg: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	sig: /* @__PURE__ */ v.bytes(),
	src: /* @__PURE__ */ v.didString(),
	uri: /* @__PURE__ */ v.genericUriString(),
	val: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 128)]),
	ver: /* @__PURE__ */ v.integer()
});
const _subjectPolicySchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.labeler.defs#subjectPolicy")),
	collection: /* @__PURE__ */ v.nsidString(),
	kind: /* @__PURE__ */ v.string()
});
const assessmentSubjectSchema = _assessmentSubjectSchema;
const coverageSchema = _coverageSchema;
const currentAssessmentViewSchema = _currentAssessmentViewSchema;
const labelDefinitionSchema = _labelDefinitionSchema;
const labelerPolicySchema = _labelerPolicySchema;
const manualDecisionSchema = _manualDecisionSchema;
const modelDescriptorSchema = _modelDescriptorSchema;
const publicApiSchema = _publicApiSchema;
const publicAssessmentSchema = _publicAssessmentSchema;
const publicFindingSchema = _publicFindingSchema;
const reasonCodeDefinitionSchema = _reasonCodeDefinitionSchema;
const signedLabelSchema = _signedLabelSchema;
const subjectPolicySchema = _subjectPolicySchema;

//#endregion
export { assessmentSubjectSchema, coverageSchema, currentAssessmentViewSchema, labelDefinitionSchema, labelerPolicySchema, manualDecisionSchema, modelDescriptorSchema, publicApiSchema, publicAssessmentSchema, publicFindingSchema, reasonCodeDefinitionSchema, signedLabelSchema, subjectPolicySchema, defs_exports as t };
//# sourceMappingURL=defs.js.map