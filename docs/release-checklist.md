<!-- SPDX-License-Identifier: MIT -->

# Release checklist

Used by the EmDash release skill after publish (and for manual verification).

## Before Version Packages merge (agent or human)

- [ ] Pending changesets in `.changeset/` match intent (no stale major/minor).
- [ ] Version bump matches conforming (**patch**) vs API/peer changes (**minor**/**major**).
- [ ] CI green on the compatibility PR.
- [ ] `peerDependencies.emdash` still correct (`>=0.14.0` unless intentionally raised).
- [ ] `NPM_TOKEN` repo secret is set.

## After Version Packages merge

- [ ] [Release workflow](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml) succeeded.
- [ ] `npm view emprivacy version` shows the new version.
- [ ] GitHub Release created for the `v*` tag.
- [ ] `EMDASH_COMPAT.md` / README list the CI-tested EmDash version.

## Optional staging smoke

- [ ] Install `emprivacy@<new>` on a staging EmDash site at the tested version.
- [ ] Banner, policy links, analytics/marketing consent paths (see [TESTING.md](./TESTING.md)).

If publish failed, see [maintainer-release.md](./maintainer-release.md).
