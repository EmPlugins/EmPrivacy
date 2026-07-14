<!-- SPDX-License-Identifier: MIT -->

# Release checklist

Used by the EmDash release skill after publish (and for manual verification).

## Before Version Packages merge (agent or human)

- [ ] Pending changesets in `.changeset/` match intent (no stale major/minor).
- [ ] Version bump matches conforming (**patch**) vs API/peer changes (**minor**/**major**).
- [ ] CI green on the compatibility PR.
- [ ] `peerDependencies.emdash` still correct (`>=0.14.0` unless intentionally raised).
- [ ] `NPM_TOKEN` repo secret can publish `@emplugins/*` under the [emplugins](https://www.npmjs.com/org/emplugins) org.

## After Version Packages merge

- [ ] [Release workflow](https://github.com/EmPlugins/EmPrivacy/actions/workflows/release.yml) succeeded.
- [ ] `npm view @emplugins/emprivacy version` shows the new version.
- [ ] Package appears under [emplugins packages](https://www.npmjs.com/settings/emplugins/packages).
- [ ] GitHub Release created for the `v*` tag on [EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy).
- [ ] `EMDASH_COMPAT.md` / README list the CI-tested EmDash version.

## Optional staging smoke

- [ ] Install `@emplugins/emprivacy@<new>` on a staging EmDash site at the tested version.
- [ ] Banner, policy links, analytics/marketing consent paths (see [TESTING.md](./TESTING.md)).

If publish failed, see [maintainer-release.md](./maintainer-release.md).
