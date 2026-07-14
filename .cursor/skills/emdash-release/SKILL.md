---
name: emdash-release
description: >-
  Fully agent-driven EmDash compatibility upgrade for EmPrivacy: discover latest
  emdash, bump deps and CI matrix, run conformance, open and auto-merge the
  compat PR, merge the Version Packages PR, and verify npm + GitHub Release
  publish. Use when the user says "update to latest emdash release", "emdash
  compatibility release", "emdash conformance check", or asks to publish an
  EmPrivacy release after an EmDash upgrade.
---

# EmDash release workflow (EmPrivacy)

Execute every step. Do not only advise. Do not stop for manual approval — this repo is configured for end-to-end agent publish.

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

```bash
git add -A
git commit -m "chore: test against emdash@<version>"
git push -u origin HEAD
env -u GITHUB_TOKEN gh pr create --title "chore: emdash@<version> compatibility" --body "..."
```

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

When the Version Packages PR is open and checks are green (or no required checks):

```bash
env -u GITHUB_TOKEN gh pr checks --watch
env -u GITHUB_TOKEN gh pr merge --squash --auto
```

Merging triggers `.github/workflows/release.yml` → `pnpm release:publish` → npm + GitHub Release (`NPM_TOKEN` repo secret).

### 8. Verify publish

Poll until done:

```bash
env -u GITHUB_TOKEN gh run list --workflow=release.yml --branch=main --limit 1
env -u GITHUB_TOKEN gh run watch
npm view emprivacy version
env -u GITHUB_TOKEN gh release list --limit 3
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
