<!-- SPDX-License-Identifier: MIT -->
![EmPrivacy Logo](./artwork/logo/EmPrivacy.png)
# EmPrivacy

**EmPrivacy** is an open source [EmDash](https://github.com/emdash-cms/emdash) plugin that adds a cookie consent banner, category-based choices (essential / analytics / marketing), and **client-side** loading of third-party scripts only after consent. It aligns with common regulatory expectations when you configure it honestly and pair it with proper legal documents—but **this software is not legal advice** (see [Disclaimer](#legal-disclaimer)).

## Requirements

- **EmDash** `^0.38.0` (**tested with `0.38.0`**; re-test on your deployed minor when upgrading).
- **Node.js** `>= 22.16` (matches EmDash’s engine requirement).
- Register as a **native** plugin in **`astro.config`** via `plugins: []` (not `sandboxed: []`). EmPrivacy uses `page:fragments` for the public banner and scripts; that hook only runs for trusted in-process plugins. See [Page fragments](https://docs.emdashcms.com/plugins/creating-native-plugins/page-fragments/) and [Plugin overview](https://docs.emdashcms.com/plugins/overview/).

## Install

```bash
pnpm add @emplugins/emprivacy
# or
npm install @emplugins/emprivacy
```

Published under the [emplugins](https://www.npmjs.com/org/emplugins) npm org. Source: [github.com/EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy). See [EMDASH_COMPAT.md](./EMDASH_COMPAT.md) for EmDash version mapping.

Use a **semver range** if you want controlled upgrades, for example `@emplugins/emprivacy@^1.0.0`. Versioning: [docs/RELEASES.md](docs/RELEASES.md). Org publish: [docs/NPM_ORG_PUBLISH.md](docs/NPM_ORG_PUBLISH.md).

The legacy unscoped package `emprivacy` is deprecated; migrate imports to `@emplugins/emprivacy`.

## Quick start

1. **Register the plugin** in `astro.config.mjs` (or `.ts`) **before** other plugins that inject marketing or analytics, so consent runs first:

   ```ts
   import { defineConfig } from "astro/config";
   import emdash from "emdash/astro";
   import { emprivacyPlugin } from "@emplugins/emprivacy";

   export default defineConfig({
     integrations: [
       emdash({
         plugins: [emprivacyPlugin()],
       }),
     ],
   });
   ```

   Native descriptors belong in `plugins`, not `sandboxed`. EmDash loads the named `createPlugin()` export from the package at runtime.

2. **Use EmDash page integration** in your layout so fragments render: include `<EmDashHead />`, `<EmDashBodyStart />`, `<EmDashBodyEnd />` (or your theme’s equivalents), typically with a shared `createPublicPageContext({ Astro, … })`. See [EmDash page fragments](https://docs.emdashcms.com/plugins/creating-native-plugins/page-fragments/).

3. **Configure EmPrivacy in the admin** (shield → **EmPrivacy**):
   - **Privacy policy** — Point to your existing EmDash **Page** using its **public path** (what you see in the address bar when that Page is open, e.g. `/privacy`), **or** a full `https://…` URL if the policy is hosted elsewhere. Root-relative paths are resolved with EmDash `ctx.url()` so links stay correct across environments.
   - **Cookie policy** (optional) — Same rules: EmDash Page path or `https://…`.
   - Set banner copy, **Policy / consent version**, **Analytics** (Cloudflare site token, **None**, or **Custom** `https` URLs), and **Marketing** script URLs (`https`, one per line). See [GETTING_STARTED](docs/GETTING_STARTED.md#step-5--configure-emprivacy-in-the-admin).

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for a step-by-step path from “create a Page” to “verify the link in the banner.”

Visitors see a banner on first visit (or when you bump **Policy / consent version**). Configured analytics (e.g. Cloudflare beacon) and marketing scripts load only **after** the user consents to the matching category.

## Features

| Feature | Description |
|--------|-------------|
| Categories | Essential (informational), **Analytics**, **Marketing** |
| Privacy / cookie links | EmDash **Page** as a root path (e.g. `/privacy`) or external `https://` URL; paths resolve via `ctx.url()` in hooks so public URLs stay correct when the site origin changes |
| Analytics platforms | **Cloudflare Web Analytics** — enter your site token; the beacon is injected with `data-cf-beacon` after consent. **None** / **Custom** (`https` URLs) also supported; more platforms can be added over time |
| Marketing scripts | Only **https** URLs you list are injected as `<script src>` after marketing consent—no arbitrary admin HTML |
| Re-open preferences | After the first choice, a **cookie button** (bottom-left) re-opens the same options; saving from that panel **reloads** the page so script loading matches the latest consent (including revoking) |
| Consent cookie | `emprivacy_cc` (`path=/`, `SameSite=Lax`, `Secure` on HTTPS), JSON `{ v, a, m }` (version, analytics, marketing) |
| Optional server log | POST consent snapshots to `/_emdash/api/plugins/emprivacy/record` + optional storage rows (no IP in v1) |
| Google Consent Mode v2 | Optional denied defaults in `<head>` + `gtag('consent','update',…)` — validate with [Google’s docs](https://support.google.com/tagmanager/answer/13695607) |

## Capabilities

| Capability | Why |
|------------|-----|
| `hooks.page-fragments:register` | Public banner, styles, and consent bootstrap scripts |

Settings, KV, and declared plugin storage need no extra capability. Native plugins are not an isolation boundary: review and install this package like first-party site code.

## Legal disclaimer

EmPrivacy helps you implement **technical** consent UX and script loading patterns used for regulations such as **GDPR** and **CCPA/CIPA**. **You** remain responsible for:

- Privacy notices, cookie policies, and lawful bases  
- What data your analytics/marketing vendors collect  
- Whether your configuration meets obligations in your jurisdictions  

**This project does not provide legal advice.** If you need certainty, consult a qualified attorney or privacy professional.

## Registration order

Put **`emprivacyPlugin()` early** in the `plugins` array so `page:metadata` / `page:fragments` run before other plugins that add trackers or metadata.

## Development

```bash
pnpm install
pnpm run typecheck   # TypeScript
pnpm run build       # ESM + types in dist/
pnpm test            # Unit tests (see Testing)
pnpm run test:watch  # Vitest in watch mode (optional)
```

Outputs ESM under `dist/` with typings. Layout follows EmDash’s [native plugin packaging](https://docs.emdashcms.com/plugins/creating-native-plugins/distributing/) (`emprivacyPlugin()` descriptor + named `createPlugin()`).

Dependency, audit, and deprecation context: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Testing

### Automated (local or CI)

| Command | Purpose |
|---------|---------|
| `npm run typecheck` | Types against `emdash` and this package |
| `npm run build` | `tsdown` → `dist/` and `exports` |
| `npm test` | [Vitest](https://vitest.dev/) tests for `src/config.ts`: URL lists, `normalizeConfig`, policy **path vs https** validation, `resolvePolicyHref`, `jsonForHtmlScript` |

Automation does **not** start EmDash or a browser; it guards packaging and validation logic.

**Suggested CI:**

```bash
npm ci
npm run typecheck
npm run build
npm test
```

### Staging / manual (before production)

EmPrivacy uses EmDash KV, admin Block Kit, `page:fragments`, and plugin routes. Validate on a **real EmDash site** (staging) at the EmDash version you deploy.

- **[docs/TESTING.md](docs/TESTING.md)** — Full pre-deploy checklist, flows to exercise, limits of automation.  
- **No E2E in this repo** — nothing here launches EmDash or drives a browser.

### Acceptance checklist (manual QA)

Details: [docs/TESTING.md](docs/TESTING.md).

- [ ] `typecheck`, `build`, and `npm test` pass
- [ ] Banner when no cookie or **Policy / consent version** mismatch
- [ ] **Privacy (and cookie) links** open the right EmDash Page or external URL; paths match what you see in the browser for that Page
- [ ] Strict mode: no analytics/marketing scripts until consent (Network tab)
- [ ] Cookie persists; bumping policy version shows the banner again
- [ ] Admin save updates the public banner
- [ ] Optional: server logging + recent records in admin
- [ ] Optional: Google Consent Mode (Tag Assistant / [Google](https://support.google.com/tagmanager/answer/13695607))
- [ ] Native `plugins: []` registration (see [Requirements](#requirements))

## Releases

npm releases follow **[Semantic Versioning](https://semver.org/)** (`MAJOR.MINOR.PATCH`). Tags are `v`-prefixed (e.g. `v0.2.1`). See [docs/RELEASES.md](docs/RELEASES.md) for bump rules, `npm version` / `npm run release:*`, and publish checklist.

## License

MIT — see [LICENSE](LICENSE).
