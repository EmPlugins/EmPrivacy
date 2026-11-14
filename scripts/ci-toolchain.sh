#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Install a pinned Node.js and the repo's pnpm. No marketplace actions:
# the EmPlugins org allows only actions defined in this repository.
set -euo pipefail

NODE_VERSION="v26.13.0"
TARBALL="node-${NODE_VERSION}-linux-x64.tar.xz"
SHA256="d28a96af6c38596f6d9d97c0ee531c13d238d757742387d1928de822d959e997"
PREFIX="${RUNNER_TEMP:-/tmp}/node-${NODE_VERSION}"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

curl -fsSL -o "${tmpdir}/${TARBALL}" "https://nodejs.org/dist/${NODE_VERSION}/${TARBALL}"
echo "${SHA256}  ${tmpdir}/${TARBALL}" | sha256sum -c -
mkdir -p "$PREFIX"
tar -xJf "${tmpdir}/${TARBALL}" -C "$PREFIX" --strip-components=1

if [[ -n "${GITHUB_PATH:-}" ]]; then
	echo "${PREFIX}/bin" >> "$GITHUB_PATH"
fi
export PATH="${PREFIX}/bin:${PATH}"

node --version
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm --version
