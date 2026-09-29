import { PluginDescriptor } from "emdash";
//#region src/runtime.d.ts
export declare function createPlugin(): import("emdash").ResolvedPlugin<{
  consentEvents: {
    indexes: string[];
  };
}>;
//#endregion
//#region src/vendors.d.ts
type ConsentCategory = "essential" | "functional" | "analytics" | "marketing";
interface VendorRow {
  id: string;
  name: string;
  category: ConsentCategory;
  purpose: string;
  /** First-party docs we control the URL for — never taken from admin HTML */
  policyUrl?: string;
}
type AnalyticsLoader = {
  type: "none";
} | {
  type: "cloudflare";
  token: string;
} | {
  type: "custom";
  scripts: {
    src: string;
    integrity: string | null;
  }[];
} | {
  type: "plausible";
  src: string;
  domain: string;
} | {
  type: "fathom";
  src: string;
  siteId: string;
} | {
  type: "umami";
  src: string;
  websiteId: string;
} | {
  type: "simpleanalytics";
  src: string;
} | {
  type: "ga4";
  measurementId: string;
} |
/** Loaded only after Marketing consent — GTM can fire advertising tags. */
{
  type: "gtm";
  containerId: string;
};
export declare function buildAnalyticsLoader(cfg: EmprivacyConfig): AnalyticsLoader;
export declare function buildVendorList(cfg: EmprivacyConfig): VendorRow[];
//#endregion
//#region src/i18n.d.ts
interface EmprivacyChromeStrings {
  acceptAll: string;
  rejectNonEssential: string;
  customize: string;
  saveChoices: string;
  close: string;
  essential: string;
  functional: string;
  analytics: string;
  marketing: string;
  essentialNote: string;
  privacyPolicy: string;
  cookiePolicy: string;
  cookieSettings: string;
  loadEmbed: string;
  embedBlocked: string;
  embedNeedConsent: string;
  vendorsHeading: string;
  whatWeUse: string;
}
interface EmprivacyLocaleCopy {
  bannerTitle: string;
  bannerMessage: string;
}
type LocaleOverrides = Record<string, Partial<EmprivacyLocaleCopy>>;
//#endregion
//#region src/theme.d.ts
interface EmprivacyTheme {
  bg: string;
  text: string;
  accent: string;
  radiusPx: number;
}
//#endregion
//#region src/config.d.ts
export declare const KV_KEY: "consent:config";
export declare const COOKIE_NAME: "emprivacy_cc";
type AnalyticsProvider = "cloudflare" | "none" | "custom" | "plausible" | "fathom" | "umami" | "simpleanalytics" | "ga4" | "gtm";
type EmbedCategory = "functional" | "marketing";
interface EmprivacyConfig {
  bannerTitle: string;
  bannerMessage: string;
  /**
   * Privacy policy location: full `https://…` URL **or** a root-relative path to an EmDash **Page**
   * (e.g. `/privacy`) resolved with `ctx.url()` on the server.
   */
  privacyPolicyUrl: string;
  /** Optional cookie policy: same rules as `privacyPolicyUrl` (https URL or path like `/cookies`) */
  cookiePolicyUrl: string;
  /** When true, analytics/marketing/functional require explicit opt-in in the UI */
  strictDefaults: boolean;
  /** Bump to invalidate client consent cookies and re-show the banner */
  policyVersion: string;
  /**
   * Analytics when `cloudflare` — **site token** from Cloudflare → Web Analytics (injected with `data-cf-beacon`).
   * Public in the same way as a normal site embed. Empty means no Cloudflare script until a token is saved.
   */
  cloudflareWebAnalyticsToken: string;
  analyticsProvider: AnalyticsProvider;
  /** Provider-specific id (domain, site id, G-…, GTM-…). */
  analyticsId: string;
  /** Required when `analyticsProvider` is `umami` — https script src only. */
  umamiScriptUrl: string;
  /** When `analyticsProvider` is `custom`, these https script URLs load after analytics consent. */
  analyticsScriptUrls: string[];
  /** Third-party script URLs loaded only after marketing consent (https only) */
  marketingScriptUrls: string[];
  /** Optional SRI hashes keyed by script src (sha256/384/512-…) */
  scriptIntegrity: Record<string, string>;
  /**
   * When non-empty, Custom analytics and marketing script hosts must be on this list.
   * Preset CDN hosts remain allowed for built-in providers.
   */
  scriptHostAllowlist: string[];
  /** Consent cookie Max-Age in days (1–365, default 180) */
  cookieMaxAgeDays: number;
  /** Emit Google Consent Mode v2 defaults (denied) in head; updates after choice */
  googleConsentMode: boolean;
  /** POST consent snapshots to the plugin record route and optional storage */
  logConsentToServer: boolean;
  /** Category that official embed placeholders require */
  embedCategory: EmbedCategory;
  /** When true, EmPrivacy Portable Text components gate official embed blocks */
  gateEmbeds: boolean;
  /** Hide the first-visit banner on privacy/cookie policy paths */
  hideBannerOnPolicyPages: boolean;
  defaultLocale: string;
  localeOverrides: LocaleOverrides;
  theme: EmprivacyTheme;
}
export declare const DEFAULT_CONFIG: EmprivacyConfig;
/** Reject characters that would break JSON or attributes; allow typical Cloudflare site token strings. */
export declare function assertValidCloudflareToken(t: string): void;
/**
 * Root-relative public path (EmDash page route), e.g. `/privacy`.
 * Rejects protocol-relative URLs (`//…`) and whitespace.
 */
export declare function isRootRelativeSitePath(s: string): boolean;
/** For hooks: turn stored path or absolute URL into a public absolute URL. */
export declare function resolvePolicyHref(stored: string, ctx: {
  url: (path: string) => string;
}): string;
export declare function isValidPolicyHrefInput(s: string): boolean;
/** True when the public page is the configured privacy or cookie policy. */
export declare function isPolicyPagePath(pagePath: string, cfg: Pick<EmprivacyConfig, "privacyPolicyUrl" | "cookiePolicyUrl">): boolean;
export declare function normalizeConfig(raw: unknown): EmprivacyConfig;
interface ConsentRecordPayload {
  createdAt: string;
  policyVersion: string;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}
interface ConsentState {
  v: string;
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}
interface VendorPublicRow {
  id: string;
  name: string;
  category: "essential" | "functional" | "analytics" | "marketing";
  purpose: string;
  policyUrl?: string;
}
interface EmprivacyPublicRuntimeConfig {
  bannerTitle: string;
  bannerMessage: string;
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  strictDefaults: boolean;
  policyVersion: string;
  googleConsentMode: boolean;
  logConsent: boolean;
  recordPath: string;
  embedCategory: EmbedCategory;
  gateEmbeds: boolean;
  hideBanner: boolean;
  theme: EmprivacyTheme;
  ui: EmprivacyChromeStrings;
  loader: AnalyticsLoader;
  marketingScripts: {
    src: string;
    integrity: string | null;
  }[];
  scriptHostAllowlist: string[];
  scriptIntegrity: Record<string, string>;
  cookieMaxAge: number;
  vendors: VendorPublicRow[];
}
//#endregion
//#region src/public-api.d.ts
type EmprivacyCategory = "essential" | "functional" | "analytics" | "marketing";
/**
 * Public browser API attached to `window.emprivacy`.
 * Other plugins and themes should use this instead of reading the cookie directly.
 */
interface EmprivacyBrowserApi {
  get(): ConsentState | null;
  has(category: EmprivacyCategory): boolean;
  onChange(cb: (state: ConsentState) => void): () => void;
  open(): void;
}
declare global {
  interface Window {
    emprivacy?: EmprivacyBrowserApi;
  }
}
//#endregion
//#region src/astro/embed-resolve.d.ts
/**
 * Validate official EmDash embed block payloads and produce a first-party
 * placeholder plan. Never returns a URL we did not construct or allowlist.
 */
export declare const EMBED_BLOCK_TYPES: readonly ["youtube", "vimeo", "tweet", "bluesky", "mastodon", "linkPreview", "gist"];
type EmbedBlockType = (typeof EMBED_BLOCK_TYPES)[number];
type EmbedRenderMode = "iframe" | "link";
interface ResolvedEmbed {
  kind: EmbedBlockType;
  mode: EmbedRenderMode;
  /** https iframe src or link href — always produced by this module */
  src: string;
  label: string;
  poster: string | null;
}
export declare function resolveEmbed(node: {
  _type?: unknown;
  id?: unknown;
  poster?: unknown;
  title?: unknown;
}): ResolvedEmbed | null;
//#endregion
//#region src/index.d.ts
/**
 * EmDash native plugin descriptor — add to `plugins: []` in `emdash({ ... })` inside `astro.config`.
 *
 * EmPrivacy uses `page:fragments` (banner + consent scripts) and optional Portable Text
 * embed placeholders, which only run for **native** plugins in `plugins: []`.
 * Do not place this descriptor in `sandboxed: []`.
 */
export declare function emprivacyPlugin(): PluginDescriptor;
//#endregion
export { type AnalyticsLoader, type AnalyticsProvider, type ConsentRecordPayload, type ConsentState, type EmbedCategory, type EmprivacyBrowserApi, type EmprivacyCategory, type EmprivacyConfig, type EmprivacyPublicRuntimeConfig, type ResolvedEmbed, type VendorPublicRow, type VendorRow, createPlugin as default };