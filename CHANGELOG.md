# emprivacy

## 2.1.0

### Minor Changes

- 076fc57: Show the installed EmPrivacy version and the latest npm release on the admin settings page.
- 076fc57: Add a public consent API, functional category, gated EmDash embeds, banner i18n and theme tokens, analytics presets, and a generated vendor list.
- 076fc57: Harden client embed/script injection, move GTM to Marketing, tighten /record CSRF and rate limits, and add host allowlist, SRI, and cookie TTL controls.

## 2.0.0

### Major Changes

- ec6b3e5: **EmDash `^0.38.0` native plugin** — Requires EmDash `^0.38.0` (tested with `0.38.0`) and Node.js `>= 22.16`. Switched from standard/sandbox packaging to EmDash’s native contract: `format: "native"`, named **`createPlugin()`** export, single-argument **`RouteContext`** route handlers, and **no** `./sandbox` export. Register **`emprivacyPlugin()`** from **`@emplugins/emprivacy`** in **`plugins: []`** (required for `page:fragments`; not `sandboxed: []`). Docs/README updated for scoped install, `import emdash from "emdash/astro"`, layout page context, and native trust boundary.

## 1.0.0

### Major Changes

- 3648ba0: Publish under the emplugins npm org as `@emplugins/emprivacy` (breaking import path). Source remains EmPlugins/EmPrivacy. Migrate from legacy unscoped `emprivacy`.

## 0.3.1

### Patch Changes

- d8c857e: Test against EmDash 0.29.0.

## 0.3.0

### Minor Changes

- Require EmDash `>=0.14.0` and migrate to the `SandboxedPlugin` export / `./sandbox` entry packaging used by EmDash 0.14+.

## 0.2.1

### Patch Changes

- Canonical GitHub URLs for **EmPlugins/EmPrivacy** (`package.json` `repository` / `bugs` / `homepage`, admin docs link). No runtime behavior change.

## 0.2.0

### Minor Changes

- Target EmDash `0.9.x` (`^0.9.0` peer/dev dependency). Capability renamed from deprecated `page:inject` to **`hooks.page-fragments:register`**.

## 0.1.6

### Patch Changes

- Compatibility: CI and manual QA verified with EmDash `0.7.0`. Hardening updates.

## 0.1.5

### Patch Changes

- Fix Cloudflare Web Analytics when consent is granted from the initial banner by reloading after persisting choices (ensures the beacon runs in a normal page lifecycle).

## 0.1.4

### Minor Changes

- **Re-open consent** — After the first choice, a floating cookie control (bottom-left) re-opens the consent panel. Changing choices and saving reloads the page so script loading matches the new consent. Duplicate `<script src>` tags for the same URL are avoided when possible.
- **Analytics platforms** — Admin radio: Cloudflare Web Analytics (default), None, or Custom `https` script URLs. Cloudflare injects `beacon.min.js` with `data-cf-beacon` after analytics consent. Legacy configs with only `analyticsScriptUrls` are treated as Custom.

## 0.1.3

### Patch Changes

- Pin Kysely via `overrides` so `npm audit` reports 0 high-severity issues from the `emdash` tree; add `npm run audit` to CI and publish hooks; add maintainer DEVELOPMENT docs.

## 0.1.2

### Patch Changes

- `verify:exports` script fails the release if `main` / `exports` paths are missing from `dist/` after build; `publishConfig.access: "public"`; document safe-publishing workflow; CI runs `verify:exports` after `build`.

## 0.1.1

### Patch Changes

- Packaging/release safety improvements for npm publishing (publish-time checks + version sync). CI workflow runs `typecheck`, `test`, and `build` on PRs/pushes.

## 0.1.0

### Major Changes

- Initial npm release: cookie consent banner, essential / analytics / marketing categories, client-side `https` script gating after consent, `emprivacy_cc` cookie (`{ v, a, m }`), optional server consent log, optional Google Consent Mode v2. Requires EmDash `^0.5.0` and trusted plugins in `plugins: []`.
