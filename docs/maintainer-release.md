<!-- SPDX-License-Identifier: MIT -->

# Maintainer release guide

How EmPrivacy versions and publishes [`@emplugins/emprivacy`](https://www.npmjs.com/package/@emplugins/emprivacy) to the [emplugins](https://www.npmjs.com/org/emplugins) npm org and GitHub Releases on [EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).

## Agent-driven EmDash upgrades

Config: [`.cursor/emdash-release.json`](../.cursor/emdash-release.json)  
Skill: [`.cursor/skills/emdash-release/`](../.cursor/skills/emdash-release/SKILL.md)

In Cursor, say:

```
update to latest emdash release
```

The agent discovers the latest `emdash`, bumps deps/CI/docs, runs `pnpm emdash:conformance`, opens and merges the compatibility PR, merges the **Version Packages** PR, and verifies npm + GitHub Release. No manual merge gate (`approval.mergeVersionPackagesPr: true`).

## Agent-driven feature releases

Skill: [`.cursor/skills/feature-release/`](../.cursor/skills/feature-release/SKILL.md)

In Cursor, ask to publish a minor or patch release. The agent:

1. Commits features with one changeset. It does **not** bump `package.json`, `src/version.ts`, or `CHANGELOG.md` (a pre-bump plus a changeset skips a version). Maintainer notes go in [RELEASE_NOTES.md](./RELEASE_NOTES.md).
2. Squash-merges a feature PR after CI is green.
3. Merges **Version Packages** without waiting on that PR’s checks.
4. Confirms the Release log line `+ @emplugins/emprivacy@<version>`, then polls the registry until that exact version returns HTTP 200.

## Overview

| Step | What happens |
|------|----------------|
| 1. Changeset on a PR | Describe bump in `.changeset/<slug>.md` |
| 2. Merge to `main` | Release workflow opens Version Packages when a changeset is pending |
| 3. Version Packages PR | Bumps version + changelog |
| 4. Merge Version Packages | `release.yml` runs `pnpm release:publish` → npm trusted publishing + GitHub Release |

A push to `main` with no pending changeset publishes the version already in `package.json`. A docs-only merge does that too. See [NPM_ORG_PUBLISH.md](./NPM_ORG_PUBLISH.md).

## Prerequisites

| Credential | Where | Notes |
|------------|-------|-------|
| Trusted publisher | npm package settings | `EmPlugins/EmPrivacy` workflow `release.yml` may `npm publish`. See [NPM_ORG_PUBLISH.md](./NPM_ORG_PUBLISH.md). |
| `gh auth login` | Maintainer machine | Open and merge pull requests. `git push origin main` is rejected. |
| Org: Actions create PRs | GitHub org/repo settings | Automatic Version Packages pull requests |

### GitHub CLI and `GITHUB_TOKEN`

```bash
env -u GITHUB_TOKEN gh auth status
env -u GITHUB_TOKEN gh pr create ...
```

### npm auth

Release publishes with npm trusted publishing. `release.yml` sets `id-token: write` and does not pass an npm token. `scripts/npm-auth-publish.mjs` removes `NPM_TOKEN` and `NODE_AUTH_TOKEN`, then runs `npm publish`. Provenance is attached for this public package. Full setup, the trusted-publisher fields, and the token shutdown steps are in [NPM_ORG_PUBLISH.md](./NPM_ORG_PUBLISH.md).

Do not create a project `.npmrc`. The publish script exits when one is present.

A local `pnpm release:publish` uses `~/.npmrc` from `npm login` and can prompt for 2FA. It publishes the npm package only. The GitHub Release is created in Actions. Prefer the Release workflow.

## Release workflow details

Config: [`.github/workflows/release.yml`](../.github/workflows/release.yml)

```yaml
version: pnpm release:version   # do NOT use inline && in changesets/action
publish: pnpm release:publish
```

`changesets/action` misparses inline shell chains. Always use the `release:version` / `release:publish` scripts.

### CI pnpm setup

CI and Release install Node.js from [`scripts/ci-toolchain.sh`](../scripts/ci-toolchain.sh). That script pins Node.js 26.13.0, checks the linux tarball checksum, and activates pnpm 9.15.4. The package allows Node `>= 22.16`, so the test job uses this same Node. Release then runs `npm -v` and stops if npm is older than 11.5.1. Trusted publishing needs that CLI. Node 22 bundles npm 10 and fails the check.

The EmPlugins organization allows only Actions defined in this repository (`local_only`). `ci.yml` and `release.yml` must not `uses:` marketplace actions such as `actions/checkout` or `changesets/action`. Checkout is a local `git fetch`, and Version Packages / npm publish / GitHub Release are `scripts/release-or-version.mjs`.

Do **not** set `version:` on a pnpm setup action when `package.json` has `"packageManager": "pnpm@…"`. `scripts/ci-toolchain.sh` prepares that exact pnpm.

## Changeset hygiene

```bash
ls .changeset/*.md
```

All pending changesets are consumed together; the **highest** bump wins. Clear stale files before a patch-only compat release.

## Manual equivalent

```bash
npm view emdash version
pnpm emdash:conformance
# bump package.json emdash, CI matrix, EMDASH_COMPAT.md, README.md
# add .changeset/emdash-<version>-compat.md
# open PR, merge when green → merge Version Packages → watch Release
```

## Troubleshooting

### Version Packages CI stuck on action_required

Expected. The Release workflow opens that PR with `GITHUB_TOKEN`, so GitHub does not start its CI until a maintainer approves the run. Merge the PR anyway. `pnpm release:publish` runs typecheck, test, build, `verify:exports`, and audit before `npm publish`.

### npm version 404 after a successful publish

Expected for several minutes, sometimes longer. npm scans the tarball before it is installable. The Release log line `+ @emplugins/emprivacy@<version>` means publish was accepted. Poll:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://registry.npmjs.org/@emplugins/emprivacy/<version>
```

Wait up to 15 minutes for `200`. Do not publish the same version again while the scan is pending.

### Version Packages PR not created

Release may push `changeset-release/main` without opening a PR if Actions cannot create PRs.

```bash
env -u GITHUB_TOKEN gh pr create --base main --head changeset-release/main \
  --title "Version Packages" --body "Version bump from changesets."
```

### Publish failed after Version Packages merge

1. Check [Actions → Release](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml).
2. Common causes: `npm` older than 11.5.1, missing `id-token: write`, trusted publisher filename other than `release.yml`, a project `.npmrc`, or an `NPM_TOKEN` passed into the job.
3. Do not put `NPM_TOKEN` back. Fix the workflow or publisher with a pull request from `origin/main`, merge it, and re-run Release only if that version was not already accepted.

### Local publish fallback

```bash
git fetch origin main && git checkout main && git pull origin main
npm login
pnpm install
pnpm release:publish
```

This publishes to npm and can prompt for 2FA. It does not create the GitHub Release and it does not update `main`.

### Verify publish

```bash
# Release log must contain: + @emplugins/emprivacy@<version>
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://registry.npmjs.org/@emplugins/emprivacy/<version>
env -u GITHUB_TOKEN gh release view v<version> --json tagName,url,name
```

`npm view @emplugins/emprivacy version` can keep showing the previous version until the scan finishes. Use the exact-version URL above.

## npm publish access

See [NPM_ORG_PUBLISH.md](./NPM_ORG_PUBLISH.md). Release uses the trusted publisher on the [emplugins](https://www.npmjs.com/org/emplugins) org. Do not add an `NPM_TOKEN` secret to the Release workflow.

## Related

- [NPM_ORG_PUBLISH.md](./NPM_ORG_PUBLISH.md) — trusted publisher and publish check
- [release-checklist.md](./release-checklist.md)
- [RELEASES.md](./RELEASES.md) — semver policy
- [`.cursor/skills/feature-release/`](../.cursor/skills/feature-release/SKILL.md) — agent-driven minor/patch publish
- [EMDASH_COMPAT.md](../EMDASH_COMPAT.md)
