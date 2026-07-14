# Changesets

Publishable package: **`emprivacy`**

## Release flow

1. `pnpm changeset` — describe changes and bump type on a PR.
2. Merge to `main` — GitHub Actions opens a **Version Packages** PR (or publishes if that PR was merged).
3. Merge the Version Packages PR — CI publishes to npm and creates a GitHub Release.

See [docs/RELEASES.md](../docs/RELEASES.md) for maintainer details.
