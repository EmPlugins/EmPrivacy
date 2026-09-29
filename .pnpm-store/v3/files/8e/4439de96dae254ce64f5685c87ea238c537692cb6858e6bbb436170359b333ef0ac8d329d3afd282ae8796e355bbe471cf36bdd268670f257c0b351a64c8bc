import * as v from 'valibot';
export declare const rfc3968UriSchema: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>;
export declare const didRelativeUri: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
export declare const multibaseString: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, "must be a base58 multibase">]>;
export declare const didString: v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>;
export declare const verificationMethod: v.SchemaWithPipe<readonly [v.LooseObjectSchema<{
    readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
    readonly type: v.StringSchema<undefined>;
    readonly controller: v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>;
    readonly publicKeyMultibase: v.OptionalSchema<v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, "must be a base58 multibase">]>, undefined>;
    readonly publicKeyJwk: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.UnknownSchema, undefined>, undefined>;
}, undefined>, v.BaseValidation<{
    id: string;
    type: string;
    controller: `did:${string}:${string}`;
    publicKeyMultibase?: string | undefined;
    publicKeyJwk?: {
        [x: string]: unknown;
    } | undefined;
} & {
    [key: string]: unknown;
}, {
    id: string;
    type: string;
    controller: `did:${string}:${string}`;
    publicKeyMultibase?: string | undefined;
    publicKeyJwk?: {
        [x: string]: unknown;
    } | undefined;
} & {
    [key: string]: unknown;
}, v.CheckIssue<{
    id: string;
    type: string;
    controller: `did:${string}:${string}`;
    publicKeyMultibase?: string | undefined;
    publicKeyJwk?: {
        [x: string]: unknown;
    } | undefined;
} & {
    [key: string]: unknown;
}>>]>;
export declare const service: v.LooseObjectSchema<{
    readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
    readonly type: v.UnionSchema<[v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>], undefined>;
    readonly serviceEndpoint: v.UnionSchema<[v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, v.RecordSchema<v.StringSchema<undefined>, v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>, v.ArraySchema<v.UnionSchema<[v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, v.RecordSchema<v.StringSchema<undefined>, v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>], undefined>, undefined>], undefined>;
}, undefined>;
export declare const didDocument: v.SchemaWithPipe<readonly [v.LooseObjectSchema<{
    readonly '@context': v.OptionalSchema<v.ArraySchema<v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>, undefined>;
    readonly id: v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>;
    readonly alsoKnownAs: v.OptionalSchema<v.SchemaWithPipe<readonly [v.ArraySchema<v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>, v.CheckAction<string[], "duplicate aka entries">]>, undefined>;
    readonly verificationMethod: v.OptionalSchema<v.SchemaWithPipe<readonly [v.ArraySchema<v.SchemaWithPipe<readonly [v.LooseObjectSchema<{
        readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
        readonly type: v.StringSchema<undefined>;
        readonly controller: v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>;
        readonly publicKeyMultibase: v.OptionalSchema<v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, "must be a base58 multibase">]>, undefined>;
        readonly publicKeyJwk: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.UnknownSchema, undefined>, undefined>;
    }, undefined>, v.BaseValidation<{
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }, {
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }, v.CheckIssue<{
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }>>]>, undefined>, v.CheckAction<({
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    })[], "duplicate verification method ids">]>, undefined>;
    readonly service: v.OptionalSchema<v.ArraySchema<v.LooseObjectSchema<{
        readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
        readonly type: v.UnionSchema<[v.StringSchema<undefined>, v.ArraySchema<v.StringSchema<undefined>, undefined>], undefined>;
        readonly serviceEndpoint: v.UnionSchema<[v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, v.RecordSchema<v.StringSchema<undefined>, v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>, v.ArraySchema<v.UnionSchema<[v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, v.RecordSchema<v.StringSchema<undefined>, v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a url">]>, undefined>], undefined>, undefined>], undefined>;
    }, undefined>, undefined>, undefined>;
    readonly controller: v.OptionalSchema<v.UnionSchema<[v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>, v.ArraySchema<v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>, undefined>], undefined>, undefined>;
    readonly authentication: v.OptionalSchema<v.ArraySchema<v.UnionSchema<[v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>, v.SchemaWithPipe<readonly [v.LooseObjectSchema<{
        readonly id: v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.CheckAction<string, "must be a did relative uri">]>;
        readonly type: v.StringSchema<undefined>;
        readonly controller: v.CustomSchema<`did:${string}:${string}`, v.ErrorMessage<v.CustomIssue> | undefined>;
        readonly publicKeyMultibase: v.OptionalSchema<v.SchemaWithPipe<readonly [v.StringSchema<undefined>, v.RegexAction<string, "must be a base58 multibase">]>, undefined>;
        readonly publicKeyJwk: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.UnknownSchema, undefined>, undefined>;
    }, undefined>, v.BaseValidation<{
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }, {
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }, v.CheckIssue<{
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }>>]>], undefined>, undefined>, undefined>;
}, undefined>, v.CheckAction<{
    '@context'?: string[] | undefined;
    id: `did:${string}:${string}`;
    alsoKnownAs?: string[] | undefined;
    verificationMethod?: ({
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    })[] | undefined;
    service?: ({
        id: string;
        type: string | string[];
        serviceEndpoint: string | (string | {
            [x: string]: string;
        })[] | {
            [x: string]: string;
        };
    } & {
        [key: string]: unknown;
    })[] | undefined;
    controller?: `did:${string}:${string}`[] | `did:${string}:${string}` | undefined;
    authentication?: (string | ({
        id: string;
        type: string;
        controller: `did:${string}:${string}`;
        publicKeyMultibase?: string | undefined;
        publicKeyJwk?: {
            [x: string]: unknown;
        } | undefined;
    } & {
        [key: string]: unknown;
    }))[] | undefined;
} & {
    [key: string]: unknown;
}, "duplicate service ids">]>;
export type VerificationMethod = v.InferOutput<typeof verificationMethod>;
export type Service = v.InferOutput<typeof service>;
export type DidDocument = v.InferOutput<typeof didDocument>;
