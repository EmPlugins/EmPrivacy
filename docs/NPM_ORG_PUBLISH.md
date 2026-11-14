<!-- SPDX-License-Identifier: MIT -->

# Publishing EmPrivacy under the emplugins npm org

EmPrivacy publishes as **`@emplugins/emprivacy`** to the [emplugins](https://www.npmjs.com/org/emplugins) organization. Source of truth: [github.com/EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).

This matches EmPost (`@emplugins/emdash-plugin-md-draft`, etc.).

## Publish access

Release publishes from GitHub Actions with npm trusted publishing. The package already trusts `EmPlugins/EmPrivacy` workflow `release.yml` to run `npm publish`. `release.yml` sets `id-token: write`. `scripts/npm-auth-publish.mjs` does not read `NPM_TOKEN`.

Do not create a granular token that bypasses 2FA, and do not add an `NPM_TOKEN` Actions secret for publish. A local publish uses `npm login`, which stores the session in `~/.npmrc`.

```bash
npm trust list @emplugins/emprivacy
```

The listed publisher must be repository `EmPlugins/EmPrivacy`, file `release.yml`, with permission `publish`.

## One-time GitHub setup ([EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy))

1. Org/repo **Actions** settings: allow GitHub Actions to **create and approve pull requests** so Changesets can open Version Packages PRs automatically.
2. Do **not** create a custom `GITHUB_TOKEN` secret. Actions provides it automatically.

## After code lands on main

Merging the scoped-package PR + Version Packages PR triggers [Release](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml) → `pnpm release:publish` → npm + GitHub Release.

Manual re-run options:

```bash
# Preferred once workflow_dispatch is on main
env -u GITHUB_TOKEN gh workflow run release.yml --ref main --repo EmPlugins/EmPrivacy

# Or re-run a failed job
env -u GITHUB_TOKEN gh run list --workflow=release.yml --repo EmPlugins/EmPrivacy --limit 3
env -u GITHUB_TOKEN gh run rerun <run-id> --failed --repo EmPlugins/EmPrivacy
```

## Verify

```bash
npm view @emplugins/emprivacy version
npm view @emplugins/emprivacy repository.url
# expect: https://github.com/EmPlugins/EmPrivacy.git
env -u GITHUB_TOKEN gh release list --repo EmPlugins/EmPrivacy --limit 3
```

Confirm the package appears under [emplugins packages](https://www.npmjs.com/settings/emplugins/packages).

## Deprecate the legacy unscoped package (optional)

Old installs used unscoped `emprivacy`. After `@emplugins/emprivacy` is live:

```bash
npm deprecate emprivacy@"*" "Package moved to @emplugins/emprivacy — see https://github.com/EmPlugins/EmPrivacy"
```

Consumers should switch:

```bash
npm uninstall emprivacy
npm install @emplugins/emprivacy
```

```ts
import { emprivacyPlugin } from "@emplugins/emprivacy";
```

Runtime plugin id (`emprivacy`), cookie name (`emprivacy_cc`), and routes are unchanged.
