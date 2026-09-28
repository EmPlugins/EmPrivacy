#!/usr/bin/env bash
# SPDX-License-Identifier: MIT
# Install a pinned Node.js and the repo's pnpm. No marketplace actions:
# the EmPlugins org allows only actions defined in this repository.
set -euo pipefail

NODE_VERSION="v22.23.3"
TARBALL="node-${NODE_VERSION}-linux-x64.tar.xz"
SHA256="df450af89261115ef9f9e3830c3eeb2cc9213b63c720b1af623cb5dcbe2e02de"
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
