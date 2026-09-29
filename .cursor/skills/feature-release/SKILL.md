---
name: feature-release
description: >-
  Publish an EmPrivacy feature, minor, or patch release to npm and GitHub.
  Use when the user asks to commit new EmPrivacy features and publish, cut a
  minor or patch release, or ship @emplugins/emprivacy. Not for EmDash
  compatibility upgrades (use the emdash-release skill for those).
---

# Feature release (EmPrivacy)

Execute every step. Do not only advise. This repo publishes by merging a **Version Packages** pull request. Do not run `pnpm release:publish` locally.

An EmDash upgrade (“update to latest emdash”, conformance, peer bump) uses [emdash-release](../emdash-release/SKILL.md) instead. Stop here if that is the request.

## Preconditions

```bash
env -u GITHUB_TOKEN gh auth status
git remote get-url origin
```

Run `gh`, `git commit`, and `git push` outside the sandbox. Commit signing and the `gh` keyring fail inside it. Prefix every `gh` command with `env -u GITHUB_TOKEN`.

Stop only if `gh` is not authenticated or `origin` is not `EmPlugins/EmPrivacy`.

`main` is not branch-protected. Still open a feature pull request so CI runs before publish.

## Version ownership

Changesets bumps the version when Version Packages merges. The feature commit must not change:

- `package.json` `"version"`
- `src/version.ts` `VERSION`
- `CHANGELOG.md`

A pre-bumped version plus a minor changeset publishes the **following** version (committed `3.1.0` + minor → published `3.2.0`) while `docs/RELEASE_NOTES.md` still says `3.1.0`. If the working tree already edited those three for the upcoming release, restore those hunks before committing. Keep any other edits in `package.json`.

Write maintainer notes only in `docs/RELEASE_NOTES.md`: a `# emprivacy vX.Y.Z` section above the previous release, with `## Changes` bullets. Leave the Unreleased section as “No unreleased changes.” `X.Y.Z` is the version Changesets will create from the current npm version plus the bump below.

## Bump

| User asked for | Changeset value |
|----------------|-----------------|
| minor, or new features with no named bump | `minor` |
| patch, or bugfix only | `patch` |
| major, or a breaking plugin/site contract | `major` |

If the diff is breaking and the user asked for minor or patch, stop and say so before opening the pull request.

One file, `.changeset/<slug>.md`. Pending changesets are consumed together and the **highest** bump wins. Remove stale files first.

```markdown
---
"@emplugins/emprivacy": minor
---

One paragraph describing what site managers can do after this release.
```

## Steps

```
- [ ] Restore any premature version bump
- [ ] Add one changeset; write docs/RELEASE_NOTES.md
- [ ] pnpm test && pnpm typecheck
- [ ] Feature PR, CI green, squash-merge
- [ ] Merge the Version Packages PR (do not wait for its CI)
- [ ] Release log shows + @emplugins/emprivacy@<version>
- [ ] Registry returns 200 for that exact version
- [ ] git pull --ff-only origin main
```

### 1. Branch and commit

Branch from `origin/main`. Commit the features, the changeset, docs, and `docs/RELEASE_NOTES.md`.

### 2. Feature pull request

```bash
git push -u origin HEAD
env -u GITHUB_TOKEN gh pr create --title "..." --body "..."
env -u GITHUB_TOKEN gh pr checks --watch
env -u GITHUB_TOKEN gh pr merge --squash --delete-branch
```

Watch **this** CI run. It is the test gate for the feature diff.

### 3. Version Packages

Pushing the merge to `main` runs `.github/workflows/release.yml`. With a pending changeset it opens a **Version Packages** pull request from `changeset-release/main`. That commit bumps `package.json`, `src/version.ts`, and `CHANGELOG.md`.

```bash
env -u GITHUB_TOKEN gh run list --workflow=release.yml --branch=main --limit 1
env -u GITHUB_TOKEN gh pr list --search "Version Packages" --state open
```

If the workflow succeeded but no pull request exists, and `changeset-release/main` does:

```bash
env -u GITHUB_TOKEN gh pr create --base main --head changeset-release/main \
  --title "Version Packages" --body "Version bump from changesets."
```

Confirm the pull request body version matches `docs/RELEASE_NOTES.md`. Then merge. Do not wait for checks:

```bash
env -u GITHUB_TOKEN gh pr merge <number> --squash
```

CI on that pull request usually finishes as `action_required` with no jobs. GitHub does that when `GITHUB_TOKEN` opened the pull request. `pnpm release:publish` on `main` already runs typecheck, test, build, `verify:exports`, and audit. Approving or watching that CI duplicates the publish job.

### 4. Verify

Watch the Release run for the Version Packages merge. Publish succeeded when the log contains:

```text
+ @emplugins/emprivacy@<version>
New tag: v<version>
```

and a GitHub Release URL. `npm notice` may also say the package is being processed and may take a few minutes.

npm scans a new version before it is installable. For up to 15 minutes, `npm view @emplugins/emprivacy version` and `https://registry.npmjs.org/@emplugins/emprivacy/<version>` can still show the previous version or HTTP 404. That delay is the scan. Do not republish. Do not debug `scripts/npm-auth-publish.mjs` while the Release log already shows `+ @emplugins/emprivacy@<version>`.

Poll the exact version:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://registry.npmjs.org/@emplugins/emprivacy/<version>
```

Stop when the code is `200`. Then:

```bash
env -u GITHUB_TOKEN gh release view v<version> --json tagName,url,name
git pull --ff-only origin main
```

Report the npm version, the GitHub Release URL, and the feature pull request URL.

If the Release job failed before the `+ @emplugins/emprivacy@` line, see [docs/maintainer-release.md](../../../docs/maintainer-release.md).

## Hard rules

1. Branch from `origin/main`.
2. Changesets owns `package.json` version, `src/version.ts`, and `CHANGELOG.md`.
3. One changeset; its bump is the one the user asked for.
4. Squash-merge the feature pull request only after its CI is green.
5. Merge Version Packages without waiting on its CI.
6. Treat a registry 404 as success-plus-scan until 15 minutes after the `+ @emplugins/emprivacy@` log line.
7. Finish through npm availability and the GitHub Release. Leave Version Packages unmerged only when merge is impossible (permissions or a missing `NPM_TOKEN`).
