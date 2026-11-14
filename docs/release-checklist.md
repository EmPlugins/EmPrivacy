<!-- SPDX-License-Identifier: MIT -->

# Release checklist

Checks for an EmPrivacy release. Publish auth is npm trusted publishing from `release.yml`, not an npm token. Use the first list before merging Version Packages, and the second list after Release finishes.

## Before Version Packages merge (agent or human)

- [ ] Pending changesets in `.changeset/` match intent (no stale major/minor).
- [ ] Version bump matches conforming (**patch**) vs API/peer changes (**minor**/**major**).
- [ ] CI green on the compatibility PR.
- [ ] `peerDependencies.emdash` still correct (`^1.0.1`; do not lower the floor to support EmDash 0.x).
- [ ] `npm trust list @emplugins/emprivacy` shows repository `EmPlugins/EmPrivacy`, workflow `release.yml`, and permission `publish`.
- [ ] `release.yml` has `id-token: write` and does not pass `NPM_TOKEN` or `NODE_AUTH_TOKEN`.
- [ ] Release installs Node.js from `scripts/ci-toolchain.sh` and fails if npm is older than 11.5.1.

## After Version Packages merge

- [ ] [Release workflow](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml) succeeded.
- [ ] Release log contains `+ @emplugins/emprivacy@<version>`. The registry URL for that exact version may 404 for several minutes while npm scans the tarball; poll it for up to 15 minutes before treating publish as failed.
- [ ] The package page shows a provenance attestation for that version.
- [ ] After the first successful OIDC publish, any leftover `NPM_TOKEN` Actions secret is deleted and the matching npm token is revoked. Package publishing access requires 2FA and disallows tokens.
- [ ] Package appears under [emplugins packages](https://www.npmjs.com/settings/emplugins/packages).
- [ ] GitHub Release created for the `v*` tag on [EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).
- [ ] `EMDASH_COMPAT.md` / README list the CI-tested EmDash version.

## Optional staging smoke

- [ ] Install `@emplugins/emprivacy@<new>` on a staging EmDash site at the tested version.
- [ ] Banner, policy links, analytics/marketing consent paths (see [TESTING.md](./TESTING.md)).

If publish failed, see [maintainer-release.md](./maintainer-release.md).
