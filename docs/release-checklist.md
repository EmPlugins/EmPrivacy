<!-- SPDX-License-Identifier: MIT -->

# Release checklist

Used by the EmDash release skill after publish (and for manual verification).

## Before Version Packages merge (agent or human)

- [ ] Pending changesets in `.changeset/` match intent (no stale major/minor).
- [ ] Version bump matches conforming (**patch**) vs API/peer changes (**minor**/**major**).
- [ ] CI green on the compatibility PR.
- [ ] `peerDependencies.emdash` still correct (`^1.0.1`; do not lower the floor to support EmDash 0.x).
- [ ] `NPM_TOKEN` repo secret can publish `@emplugins/*` under the [emplugins](https://www.npmjs.com/org/emplugins) org.

## After Version Packages merge

- [ ] [Release workflow](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml) succeeded.
- [ ] Release log contains `+ @emplugins/emprivacy@<version>`. The registry URL for that exact version may 404 for several minutes while npm scans the tarball; poll it for up to 15 minutes before treating publish as failed.
- [ ] Package appears under [emplugins packages](https://www.npmjs.com/settings/emplugins/packages).
- [ ] GitHub Release created for the `v*` tag on [EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).
- [ ] `EMDASH_COMPAT.md` / README list the CI-tested EmDash version.

## Optional staging smoke

- [ ] Install `@emplugins/emprivacy@<new>` on a staging EmDash site at the tested version.
- [ ] Banner, policy links, analytics/marketing consent paths (see [TESTING.md](./TESTING.md)).

If publish failed, see [maintainer-release.md](./maintainer-release.md).
