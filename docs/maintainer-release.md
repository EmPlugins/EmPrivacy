<!-- SPDX-License-Identifier: MIT -->

# Maintainer release guide

How EmPrivacy versions and publishes `emprivacy` to npm and GitHub Releases.

## Agent-driven EmDash upgrades

Config: [`.cursor/emdash-release.json`](../.cursor/emdash-release.json)  
Skill: [`.cursor/skills/emdash-release/`](../.cursor/skills/emdash-release/SKILL.md)

In Cursor, say:

```
update to latest emdash release
```

The agent discovers the latest `emdash`, bumps deps/CI/docs, runs `pnpm emdash:conformance`, opens and merges the compatibility PR, merges the **Version Packages** PR, and verifies npm + GitHub Release. No manual merge gate (`approval.mergeVersionPackagesPr: true`).

## Overview

| Step | What happens |
|------|----------------|
| 1. Changeset on a PR | Describe bump in `.changeset/<slug>.md` |
| 2. Merge to `main` | Release workflow runs `changesets/action` |
| 3. Version Packages PR | Bumps version + changelog |
| 4. Merge Version Packages | `release.yml` runs `pnpm release:publish` → npm + GitHub Release |

## Prerequisites

| Credential | Where | Notes |
|------------|-------|-------|
| `NPM_TOKEN` | GitHub repo secret | Automation/granular token; publish `emprivacy`; 2FA bypass for CI |
| `gh auth login` | Maintainer machine | PRs and agent merges |
| Org: Actions create PRs | GitHub org/repo settings | Automatic Version Packages PRs |

### GitHub CLI and `GITHUB_TOKEN`

```bash
env -u GITHUB_TOKEN gh auth status
env -u GITHUB_TOKEN gh pr create ...
```

### npm 2FA

- **CI publish** uses `NPM_TOKEN` — no OTP.
- **Local** `pnpm release:publish` may prompt for OTP; prefer CI.

## Release workflow details

Config: [`.github/workflows/release.yml`](../.github/workflows/release.yml)

```yaml
publish: pnpm release:publish   # do NOT use inline && in changesets/action
```

`changesets/action` misparses inline shell chains. Always use the `release:publish` script.

### CI pnpm setup

Do **not** set `version:` on `pnpm/action-setup` when `package.json` has `"packageManager": "pnpm@…"`. Let `packageManager` drive the version.

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

### Version Packages PR not created

Release may push `changeset-release/main` without opening a PR if Actions cannot create PRs.

```bash
env -u GITHUB_TOKEN gh pr create --base main --head changeset-release/main \
  --title "Version Packages" --body "Version bump from changesets."
```

### Publish failed after Version Packages merge

1. Check [Actions → Release](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml).
2. Common causes: inline publish command, missing/invalid `NPM_TOKEN`, 2FA on a non-automation token.
3. Fix with a **minimal PR from `origin/main`**, merge, re-run Release.

### Local publish fallback

```bash
git fetch origin main && git checkout main && git pull origin main
pnpm install
pnpm release:publish
```

### Verify publish

```bash
npm view emprivacy version
env -u GITHUB_TOKEN gh release list --limit 3
```

## Related

- [release-checklist.md](./release-checklist.md)
- [RELEASES.md](./RELEASES.md) — semver policy
- [EMDASH_COMPAT.md](../EMDASH_COMPAT.md)
