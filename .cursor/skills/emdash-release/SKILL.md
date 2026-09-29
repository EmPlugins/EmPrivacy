---
name: emdash-release
description: >-
  Fully agent-driven EmDash compatibility upgrade for EmPrivacy: discover latest
  emdash, bump deps and CI matrix, run conformance, open and auto-merge the
  compat PR, merge the Version Packages PR, and verify npm + GitHub Release
  publish. Use when the user says "update to latest emdash release", "emdash
  compatibility release", "emdash conformance check", or asks to publish an
  EmPrivacy release after an EmDash upgrade. For a feature, minor, or patch
  release that is not an EmDash upgrade, use the feature-release skill.
---

# EmDash release workflow (EmPrivacy)

Execute every step. Do not only advise. Do not stop for manual approval — this repo is configured for end-to-end agent publish.

A feature, minor, or patch release of `@emplugins/emprivacy` that does not upgrade EmDash uses [feature-release](../feature-release/SKILL.md). Stop here if that is the request.

Read [`.cursor/emdash-release.json`](../../emdash-release.json) first, then [reference.md](reference.md).

## 0. Load config

```bash
test -f .cursor/emdash-release.json || echo "MISSING CONFIG"
```

Extract:

| Key | Use |
|-----|-----|
| `repo.github` | Verify `git remote get-url origin` → `EmPlugins/EmPrivacy` |
| `repo.baseBranch` | Default `main` |
| `emdash.minPeerVersion` | CI matrix floor; do not lower |
| `emdash.pluginPackage` | `@emplugins/emprivacy` (pnpm `--filter`) |
| `emdash.pluginPackageJson` | `package.json` |
| `publishablePackages` | Changeset frontmatter (`@emplugins/emprivacy`) |
| `paths.*` | Files to edit |
| `apiTouchpoints` | Non-conforming diagnosis |
| `approval.autoMergeCompatPr` | Must be true for unattended compat merge |
| `approval.mergeVersionPackagesPr` | Must be true for unattended npm/GitHub publish |

If `approval.mergeVersionPackagesPr` is not `true`, treat that as a misconfiguration for this repo and still merge Version Packages (user asked for fully agent-driven publish).

## Prerequisites

```bash
env -u GITHUB_TOKEN gh auth status
pnpm --version
git remote get-url origin
command -v jq
```

Stop only if `gh` is not authenticated or the remote is not `EmPlugins/EmPrivacy`.

## Secrets

Never commit or push a token, auth token, or other credential to GitHub. This includes npm tokens, `_authToken`, `NPM_TOKEN` values, `NODE_AUTH_TOKEN`, `GITHUB_TOKEN`, `GH_TOKEN`, personal access tokens, bearer tokens, private keys, `.npmrc`, and `.env`.

Before every `git add`, `git commit`, and `git push`:

1. Stage explicit paths only. Do not run `git add -A` or `git add .`.
2. Refuse to stage `.npmrc`, `.env`, `.env.*`, `*.pem`, `*.key`, and private key files.
3. Read the staged diff. If any line assigns a secret (`_authToken=`, `npm_` plus a token, `ghp_`, `github_pat_`, `gho_`, `Bearer `, `BEGIN PRIVATE KEY`, or `NPM_TOKEN=` / `NODE_AUTH_TOKEN=` / `GITHUB_TOKEN=` followed by a value), unstage it and stop. Do not commit. Do not push.
4. Do not put a secret in a commit message, pull request body, workflow file, or log that will be committed.

Naming `NPM_TOKEN` as the GitHub Actions secret is fine. Pasting its value is not. Publish auth stays in that Actions secret, or in `~/.npmrc` from `npm login`. Never write a project `.npmrc`.

## Definitions

- **Conforming**: `pnpm emdash:conformance` exits 0 without plugin source fixes → **patch** changeset.
- **Non-conforming**: conformance fails → fix `paths.pluginSourceDir` / `apiTouchpoints`, adjust peer if needed → **minor** or **major**.

### Changeset hygiene

```bash
ls .changeset/*.md
```

If stale pending changesets exist, remove or ship them before a patch-only compat release (highest bump wins on Version Packages).

## Workflow

```
- [ ] Load .cursor/emdash-release.json
- [ ] Discover latest emdash
- [ ] Branch from origin/<baseBranch> and bump
- [ ] Run conformance
- [ ] Add changeset and open compat PR
- [ ] CI + auto-merge compat PR
- [ ] Ensure Version Packages PR exists
- [ ] Merge Version Packages PR
- [ ] Verify Release workflow, npm version, GitHub Release
```

### 1. Discover

```bash
npm view emdash version
```

Compare to the latest CI matrix emdash version in `paths.ciWorkflow`. If already current, report and stop (nothing to publish).

### 2. Branch and bump

```bash
git fetch origin main
git checkout -B emdash/<version>-compat origin/main
```

Update for `<version>`:

| File | Change |
|------|--------|
| `package.json` | `devDependencies.emdash` → `^<version>` |
| `pnpm-lock.yaml` | `pnpm install` |
| `.github/workflows/ci.yml` | latest matrix cell (keep `emdash.minPeerVersion`) |
| `EMDASH_COMPAT.md` | CI-tested latest |
| `README.md` | compatibility line |

### 3. Conformance

```bash
pnpm emdash:conformance
# or: pnpm emdash:conformance <version>
```

If non-conforming: fix sources under `src/`, raise `peerDependencies.emdash` only when required, re-run until green.

### 4. Changeset and compat PR

Create `.changeset/emdash-<version>-compat.md`:

```markdown
---
"@emplugins/emprivacy": patch
---

Test against EmDash <version>.
```

Use `minor` / `major` when API fixes or peer floor changes require it.

Stage only the files this upgrade changed. Run the Secrets check on the staged diff before committing, and again on `git diff origin/main...HEAD` before pushing. If it finds a token, do not commit and do not push.

```bash
git add package.json pnpm-lock.yaml .github/workflows/ci.yml EMDASH_COMPAT.md README.md .changeset/emdash-<version>-compat.md
git commit -m "chore: test against emdash@<version>"
git push -u origin HEAD
env -u GITHUB_TOKEN gh pr create --title "chore: emdash@<version> compatibility" --body "..."
```

If conformance required source or peer edits, stage those paths too. Still do not stage `.npmrc`, `.env`, `node_modules`, or `.pnpm-store`.

### 5. CI and auto-merge compat PR

```bash
env -u GITHUB_TOKEN gh pr checks --watch
env -u GITHUB_TOKEN gh pr merge --squash --auto
```

If auto-merge is blocked by branch protection, merge when checks are green (`gh pr merge --squash`) if the authenticated user can. Do not force-push.

### 6. Version Packages PR

After compat merges, wait for `changesets/action` on `main`:

```bash
env -u GITHUB_TOKEN gh pr list --search "Version Packages" --state open
```

If missing but `changeset-release/main` exists:

```bash
env -u GITHUB_TOKEN gh pr create --base main --head changeset-release/main \
  --title "Version Packages" --body "Version bump from changesets (agent-driven EmDash compat publish)."
```

### 7. Merge Version Packages (publish)

Merge as soon as the Version Packages PR exists. Do not watch its checks. CI on that PR usually ends as `action_required` because `GITHUB_TOKEN` opened it. `pnpm release:publish` re-runs the test gate.

```bash
env -u GITHUB_TOKEN gh pr merge <number> --squash
```

Merging triggers `.github/workflows/release.yml` → `pnpm release:publish` → npm + GitHub Release (`NPM_TOKEN` repo secret).

### 8. Verify publish

Watch the Release run. Publish succeeded when the log contains `+ @emplugins/emprivacy@<version>` and `New tag: v<version>`.

npm scans the tarball before it is installable. For up to 15 minutes, `npm view` and the registry can still show the previous version or HTTP 404. Poll the exact version; do not republish during that window:

```bash
env -u GITHUB_TOKEN gh run list --workflow=release.yml --branch=main --limit 1
env -u GITHUB_TOKEN gh run watch
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://registry.npmjs.org/@emplugins/emprivacy/<version>
env -u GITHUB_TOKEN gh release view v<version> --json tagName,url,name
```

Report:

- New `@emplugins/emprivacy` version on npm ([emplugins](https://www.npmjs.com/org/emplugins) org)
- GitHub Release tag/URL on EmPlugins/EmPrivacy
- Conforming vs non-conforming + bump type
- Consumed changesets

If publish fails, open a **minimal fix PR from `origin/main`** (typically `package.json` + `release.yml`), merge it, and re-watch Release. See `docs/maintainer-release.md` and `docs/NPM_ORG_PUBLISH.md`.

## Hard rules

1. Branch from `origin/main` only.
2. Use `env -u GITHUB_TOKEN` for all `gh` commands when the env var overrides keyring auth.
3. Never skip `pnpm emdash:conformance` before the compat PR.
4. All `publishablePackages` share the same changeset bump type.
5. Complete through npm + GitHub Release verification — do not leave Version Packages for the user unless merge is impossible (permissions / missing `NPM_TOKEN`).
6. Never push a token or other credential. No project `.npmrc`. No `git add -A` or `git add .`.
