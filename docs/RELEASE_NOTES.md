<!-- SPDX-License-Identifier: MIT -->

# Unreleased

## Changes

No unreleased changes.

# emprivacy v3.2.0

## Changes

- **Script host allowlist** — Custom, Umami, and marketing script hosts must be listed. An empty list does not load those scripts. Built-in presets (Cloudflare, Plausible, Fathom, Simple Analytics, GA4, GTM, Clarity, UET) are unchanged. Sites that already saved custom or marketing URLs need each hostname on the list before those scripts load again.
- **Subresource Integrity** — Custom and marketing lines require a `sha256-`, `sha384-`, or `sha512-` hash. A line without one is rejected on save and is not injected. Umami needs an allowlisted host and does not require a hash.
- **Embed link hosts** — Mastodon and link previews become links only when the hostname is listed. YouTube, Vimeo, X, Bluesky, and GitHub Gist keep their built-in checks. A `data-emprivacy-embed` attribute on the page is not enough to allow an arbitrary URL.
- **Non-public hosts** — Loopback, private, link-local, and other non-public addresses are rejected for script and embed URLs.
- **Settings** — Opening or saving EmPrivacy settings requires a signed-in admin.
- **Consent log** — Anonymous writes use EmDash’s platform client address: about 30 per address per UTC hour, and about 60 per hour for the whole site. Requests with no platform address share one 30/hour bucket. No IP is stored in the consent row.
- **Embed iframes** — YouTube and Vimeo `sandbox` is unchanged. The iframe `allow` list no longer includes clipboard access.
- **Publish** — npm credentials are written to a temporary user config outside the repo. A project `.npmrc` is refused at publish time.

# emprivacy v3.1.0

## Changes

- **Banner position** — Admin setting places the fixed consent banner at the bottom (default) or top of the viewport. Markup still renders through `EmDashBodyEnd`.
- **Banner themes** — New installs use the Slate profile. Admin can choose Paper, Ink, Indigo, Primer, or Custom colors. Custom opens with the colors already in effect. A profile stores that palette’s fixed colors. Custom colors still accept hex only.
- **Global Privacy Control** — When the browser sets `navigator.globalPrivacyControl`, Marketing stays denied, including after Accept all. The optional server log stores `gpc: true` and `marketing: false`. Analytics is not forced off. No geolocation.
- **Cookie cleanup** — Denying Analytics or Marketing expires a fixed list of first-party cookie names used by the presets EmPrivacy injects. The consent cookie is not deleted. HttpOnly and third-party cookies are unchanged.
- **Keyboard** — Focus moves into the banner, Tab stays inside it, and Escape closes the reopen panel. The first visit stays until the visitor chooses.
- **Consent log download** — Signed-in admins can GET `/_emdash/api/plugins/emprivacy/consent-export` (CSV, no IP). Formula characters in cells are neutralized.
- **Microsoft presets** — Clarity loads only after Analytics consent (`www.clarity.ms`). UET loads only after Marketing consent (`bat.bing.com`). Both queue a denied consent signal before the tag is injected.

# emprivacy v3.0.0

## Changes

- **EmDash 1.0 baseline** — Requires **`emdash@^1.0.1`** (tested with **`1.0.1`**). EmDash 0.x is not supported. Sites still on EmDash 0.38 should stay on `@emplugins/emprivacy@2`.
- Remains a **native** plugin: `format: "native"`, named `createPlugin()`, `page:fragments`, and Portable Text embed placeholders. Register `emprivacyPlugin()` in `plugins: []`. The official plugin registry only accepts sandboxed plugins, so this package stays on npm.

# emprivacy v2.1.0

## Changes

- **Publisher consent features** — Functional category (`f` in `emprivacy_cc`; older cookies without `f` re-prompt), `window.emprivacy` API, gated official EmDash embed placeholders (`@emplugins/emprivacy/astro`), banner i18n + hex theme tokens, analytics presets (Plausible, Fathom, Umami, Simple Analytics, GA4, GTM), generated vendor list (admin + public `/vendors` route). Cookie JSON is now `{ v, f, a, m }`. Admin shows installed vs latest npm version.
- **Security hardening** — Client re-validates embed `data-src` and script URLs before inject; tighter YouTube/Vimeo iframe `sandbox`; GTM loads under **Marketing**; optional script host allowlist + SRI on Custom/Marketing URLs; configurable consent cookie TTL (default 180 days); soft-consent opens preferences instead of silently granting; `/record` requires Origin or `Sec-Fetch-Site: same-origin`, fails closed on storage errors, and rate-limits writes. CSP notes in [PLUGIN_SETTINGS](./PLUGIN_SETTINGS.md#content-security-policy).

# emprivacy v2.0.0

## Changes

- Compatibility: targets **EmDash `^0.38.0`** (tested with **`0.38.0`**); Node.js **`>= 22.16`**.
- **Native plugin** — Switched from standard/sandbox entry packaging to EmDash’s native contract: `format: "native"`, named **`createPlugin()`** export, single-argument **`RouteContext`** route handlers, and no `./sandbox` export. Register **`emprivacyPlugin()`** from **`@emplugins/emprivacy`** in **`plugins: []`** (required for `page:fragments`).
- Docs/README updated for scoped package install, `import emdash from "emdash/astro"`, layout page context, and native trust boundary.

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
