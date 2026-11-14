<!-- SPDX-License-Identifier: MIT -->

# Publishing EmPrivacy under the emplugins npm org

`@emplugins/emprivacy` publishes to the [emplugins](https://www.npmjs.com/org/emplugins) organization from GitHub Actions. The Release workflow proves its identity to npm with OpenID Connect (OIDC). CI does not use a long-lived npm token.

Source of truth: [github.com/EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).

Read this if you are about to publish, rotate publish access, or the Release job fails before `+ @emplugins/emprivacy@<version>`.

## How a Release publish authenticates

[`.github/workflows/release.yml`](../.github/workflows/release.yml) runs on `ubuntu-latest` for every push to `main` and for `workflow_dispatch`. The job has `id-token: write`. That permission lets GitHub issue a short-lived OIDC token for the job. npm exchanges that token for a publish credential bound to this repository and workflow file.

[`scripts/ci-toolchain.sh`](../scripts/ci-toolchain.sh) installs the pinned Node.js release. Release then stops if `npm` is older than 11.5.1. Trusted publishing needs that CLI. Node.js 22 bundles npm 10, which cannot exchange the OIDC token.

[`scripts/npm-auth-publish.mjs`](../scripts/npm-auth-publish.mjs) is what `pnpm release:publish` calls. In Actions it:

- refuses to continue when a project `.npmrc` exists
- removes `NPM_TOKEN` and `NODE_AUTH_TOKEN` from the environment
- requires `ACTIONS_ID_TOKEN_REQUEST_URL` and `ACTIONS_ID_TOKEN_REQUEST_TOKEN`
- runs `npm publish`

It does not call `npm whoami`. That command does not accept the OIDC identity, so a `whoami` failure is not a failed publish.

npm attaches a provenance attestation for this public package from this public repository. Do not set `provenance` to `false`.

`package.json` must keep `repository.url` at `https://github.com/EmPlugins/EmPrivacy.git`. npm checks that URL against the GitHub repository that produced the OIDC token.

## Trusted publisher

The package trusts one GitHub Actions publisher:

| Field | Value |
|-------|--------|
| Organization and repository | `EmPlugins/EmPrivacy` |
| Workflow filename | `release.yml` |
| Direct `npm publish` | allowed |
| GitHub environment | none |

Confirm it before a release:

```bash
npm trust list @emplugins/emprivacy
```

You need an interactive npm login with 2FA. `npm trust` needs npm 11.15.0 or newer. A bypass-2FA token cannot create or list this configuration.

If the list is empty, or npm says the configuration expired, create it and complete one successful Release publish within 2 days:

```bash
npm trust github @emplugins/emprivacy \
  --repo EmPlugins/EmPrivacy \
  --file release.yml \
  --allow-publish
```

The filename is `release.yml` only, not a path. Leave the environment empty. The provider and filename cannot be edited later. Delete the old row with `npm trust revoke` and create a new one. Creating a second publisher that matches the same workflow returns HTTP 409.

A new publisher that only allows `npm stage publish` does not publish this package. The Release job runs `npm publish`. `npm stage approve` cannot use OIDC.

## What not to add

- Do not create a granular access token that bypasses 2FA, and do not put one in an `NPM_TOKEN` Actions secret.
- Do not pass `NPM_TOKEN` or `NODE_AUTH_TOKEN` into the Release job.
- Do not commit `.npmrc` or `_authToken`. The publish script exits when a project `.npmrc` is present.
- Do not use a self-hosted runner. Trusted publishing currently accepts GitHub-hosted runners.
- Do not set a GitHub environment on the trusted publisher unless `release.yml` sets the same `environment` name.
- Do not `git push origin main`. The repository ruleset accepts changes to `main` only through a pull request.

`GITHUB_TOKEN` is separate. Actions creates it for checkout, the Version Packages pull request, and the GitHub Release. Do not store your own `GITHUB_TOKEN` secret.

Allow GitHub Actions to create and approve pull requests so Release can open Version Packages.

## When `main` updates

A push to `main` runs Release.

- Pending files in `.changeset/` open or update the Version Packages pull request. That pull request does not publish.
- No pending changesets means Release publishes the version already in `package.json` and creates the GitHub Release.

A docs-only merge with no changeset still attempts that publish. If that version is already on npm, the publish fails and should not be retried with a new version number for the same commit.

## Local publish

Use the Release workflow. A local `pnpm release:publish` is only a fallback. Log in first:

```bash
npm login
pnpm release:publish
```

npm stores the session in `~/.npmrc` and can prompt for 2FA. That command publishes the npm package. It does not create the GitHub Release. [`scripts/release-or-version.mjs`](../scripts/release-or-version.mjs) does that, and it runs only in Actions.

## After the first OIDC publish succeeds

When the Release log contains `+ @emplugins/emprivacy@<version>` and that exact version returns HTTP 200:

1. Delete a leftover `NPM_TOKEN` Actions secret if the repo still has one.
2. Revoke that token at [Access Tokens](https://www.npmjs.com/settings/~/tokens).
3. On the package, set publishing access to **Require two-factor authentication and disallow tokens**.

OIDC publishing continues to work after tokens are disallowed.

## Verify

```bash
npm view @emplugins/emprivacy version
npm view @emplugins/emprivacy repository.url
# expect: https://github.com/EmPlugins/EmPrivacy.git
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://registry.npmjs.org/@emplugins/emprivacy/<version>
env -u GITHUB_TOKEN gh release view v<version> --repo EmPlugins/EmPrivacy --json tagName,url,name
```

npm can return 404 for several minutes while it scans the tarball. Wait up to 15 minutes. Do not publish that version again during the scan.

The package page shows the provenance attestation when the OIDC publish is public.

## Re-run Release

```bash
env -u GITHUB_TOKEN gh workflow run release.yml --ref main --repo EmPlugins/EmPrivacy
env -u GITHUB_TOKEN gh run list --workflow=release.yml --repo EmPlugins/EmPrivacy --limit 3
env -u GITHUB_TOKEN gh run rerun <run-id> --failed --repo EmPlugins/EmPrivacy
```

Re-running Release with no pending changeset publishes the current `package.json` version again. Do that only when that version is not already accepted.

## Deprecate the legacy unscoped package

Old installs used unscoped `emprivacy`. This command uses your local `npm login`, not the Release workflow:

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

The runtime plugin id (`emprivacy`), cookie name (`emprivacy_cc`), and routes stay the same.

## Next

Release steps and failure symptoms: [maintainer-release.md](./maintainer-release.md).
