<!-- SPDX-License-Identifier: MIT -->

# Unreleased

# @emplugins/emprivacy v1.0.0 (pending Version Packages)

## Breaking

- **npm package renamed** — Install and import **`@emplugins/emprivacy`** ( [emplugins](https://www.npmjs.com/org/emplugins) org ). Legacy unscoped `emprivacy` is no longer the publish target.
- **Sandbox entrypoint** — Descriptor uses `@emplugins/emprivacy/sandbox` (update only if you referenced the old entry string directly).

## Unchanged

- Runtime plugin id `emprivacy`, cookie `emprivacy_cc`, and API routes.
- Source repository: [EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).

# emprivacy v0.3.0

## Changes

- **EmDash `>=0.14.0` required** — peer and dev dependency minimum raised from `^0.9.0`. Sites on EmDash 0.9–0.13 should stay on **emprivacy 0.2.x**.
- **Plugin entry** — `src/sandbox-entry.ts` now default-exports a bare `{ hooks, routes } satisfies SandboxedPlugin` object (types from `emdash/plugin`), matching EmDash 0.13+ standard-format plugins and `@emdash-cms/plugin-audit-log`. No runtime `definePlugin()` import.
- **CI** — matrix targets **EmDash `0.14.0`**.
- **Kysely override** — Bumped to **`0.29.2`** so `npm audit` stays clean with `emdash@0.14.x` (see [docs/DEVELOPMENT.md](DEVELOPMENT.md)).

# emprivacy v0.2.1

## Changes

- **Repository** — Canonical GitHub URLs now use **[EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy)** (`package.json` `repository` / `bugs` / `homepage`, admin plugin settings doc link, and permalinks in this file). No runtime behavior change.

# emprivacy v0.1.6

## Changes

- Compatibility: CI and manual QA verified with **EmDash `0.7.0`**.

# emprivacy v0.1.5

## Changes

- Fix Cloudflare Web Analytics when consent is granted from the initial banner by reloading after persisting choices (ensures the beacon runs in a normal page lifecycle).

# emprivacy v0.1.4

## Changes

- **Re-open consent** — After the first choice, a floating **cookie** control (bottom-left) re-opens the consent panel. Changing choices and saving **reloads** the page so analytics/marketing script loading matches the new consent (including when revoking). Duplicate `<script src>` tags for the same URL on one page are avoided when possible.
- **Analytics platforms** — Admin **radio**: **Cloudflare Web Analytics** (default), **None**, or **Custom** script URLs. For Cloudflare, paste the **site token** from the dashboard; EmPrivacy injects `https://static.cloudflareinsights.com/beacon.min.js` with `defer` and `data-cf-beacon='{"token":"…"}'` after analytics consent. Legacy configs with only `analyticsScriptUrls` in KV are treated as **Custom**.

# emprivacy v0.1.3

## Changes

- Pin **Kysely** to a patched version via `overrides` so `npm audit` reports **0** high-severity issues from the `emdash` dev dependency tree (Kysely advisories).
- Add `npm run audit` to CI and to `prepublishOnly` / `preversion` so releases fail if new audit findings appear.
- New [docs/DEVELOPMENT.md](https://github.com/EmPlugins/EmPrivacy/blob/v0.1.3/docs/DEVELOPMENT.md) (dependency, audit, and deprecation context for maintainers).

# emprivacy v0.1.2

## Changes

- `verify:exports` script: fail the release if `main` / `exports` paths are missing from `dist/` after build.
- `publishConfig.access: "public"` for explicit npm visibility.
- Documented safe-publishing workflow in `docs/RELEASES.md`; CI runs `verify:exports` after `build`.

# emprivacy v0.1.1

## Changes

- Packaging/release safety improvements for npm publishing (publish-time checks + version sync).
- Added CI workflow to run `typecheck`, `test`, and `build` on PRs/pushes.

# emprivacy v0.1.0 — initial release

First published **npm** release of **EmPrivacy**, an open source [EmDash](https://github.com/emdash-cms/emdash) plugin for cookie consent, category-based choices (essential / analytics / marketing), and **client-side** loading of third-party scripts only after consent.

## Highlights

- **Banner + categories** — Visitors choose analytics and marketing; essential is informational.
- **Policy links** — Privacy (and optional cookie) policy as an EmDash **Page** path (e.g. `/privacy`) or external `https://` URL; paths resolved with EmDash `ctx.url()`.
- **Script gating** — Only `https://` script URLs you configure in admin; injected as `<script src>` after consent (no arbitrary admin HTML on the public site).
- **Consent cookie** — `emprivacy_cc` with JSON `{ v, a, m }` (policy/consent version, analytics, marketing).
- **Optional server logging** — `POST /_emdash/api/plugins/emprivacy/record` and recent records in admin (no IP in v1).
- **Optional Google Consent Mode v2** — Denied defaults in `<head>` and updates after choice (validate with [Google’s documentation](https://support.google.com/tagmanager/answer/13695607)).

## Requirements

- **EmDash** `^0.5.0` — test on the minor you deploy.
- **Trusted plugins** in `astro.config` (`plugins: []`); EmPrivacy needs injection/fragments (not sandbox-only marketplace mode). See [EmDash plugin overview](https://docs.emdashcms.com/plugins/overview/).
- **Node.js** `>= 20`.

## Install

```bash
npm install emprivacy@^0.1.0
```

Register `emprivacyPlugin()` early in `emdash({ plugins: [...] })` and wire EmDash layout components (`EmDashHead`, body slots, etc.). Full quick start: [README](https://github.com/EmPlugins/EmPrivacy/blob/v0.1.0/README.md).

## Documentation

- [Getting started](https://github.com/EmPlugins/EmPrivacy/blob/v0.1.0/docs/GETTING_STARTED.md)
- [Testing / pre-deploy checklist](https://github.com/EmPlugins/EmPrivacy/blob/v0.1.0/docs/TESTING.md)
- [Releases & semver](https://github.com/EmPlugins/EmPrivacy/blob/v0.1.0/docs/RELEASES.md)

## Legal

EmPrivacy is a **technical** CMP-style building block. It is **not legal advice**. You remain responsible for notices, vendors, and compliance in your jurisdictions.
