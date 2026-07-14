<!-- SPDX-License-Identifier: MIT -->

# Publishing EmPrivacy under the emplugins npm org

EmPrivacy publishes as **`@emplugins/emprivacy`** to the [emplugins](https://www.npmjs.com/org/emplugins) organization. Source of truth: [github.com/EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).

This matches EmPost (`@emplugins/emdash-plugin-md-draft`, etc.).

## One-time npm setup

1. Sign in to npm as a user who is a **member of [emplugins](https://www.npmjs.com/org/emplugins)** with permission to publish (typically Owner or a role with package publish).
2. Open [Access Tokens](https://www.npmjs.com/settings/~/tokens) → **Generate New Token**.
3. Create a **Granular Access Token** (Automation tokens are gone):
   - **Packages and scopes**: **Read and write**
   - Select **All packages** (required to *create* a new package like `@emplugins/emprivacy` the first time).  
     Selecting only existing packages (e.g. EmPost’s) often causes a misleading npm `404` on publish.
   - **Bypass two-factor authentication**: **checked** (required for CI with account 2FA; npm will warn — that is expected)
   - Organizations: optional; org access alone does **not** grant publish rights
4. Copy the token once.

### Optional: confirm locally

```bash
NPM_CONFIG_TOKEN='paste-token-here' npm whoami --registry=https://registry.npmjs.org
```

You should see your npm username (must be allowed to publish under **emplugins**).

## One-time GitHub setup ([EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy))

1. Repo → **Settings** → **Secrets and variables** → **Actions**.
2. Create or update secret:
   - Name: `NPM_TOKEN`
   - Value: the Automation/granular token from above

CLI:

```bash
env -u GITHUB_TOKEN gh secret set NPM_TOKEN --repo EmPlugins/EmPrivacy
```

3. (Recommended) Org/repo **Actions** settings: allow GitHub Actions to **create and approve pull requests** so Changesets can open Version Packages PRs automatically.
4. Do **not** create a custom `GITHUB_TOKEN` secret — Actions provides it automatically.

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
