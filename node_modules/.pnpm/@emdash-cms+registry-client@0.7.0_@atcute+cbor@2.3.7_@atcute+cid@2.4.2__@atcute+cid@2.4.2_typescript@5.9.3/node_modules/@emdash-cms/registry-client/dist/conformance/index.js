import { Client, ClientResponseError, ok } from "@atcute/client";
import { NSID, getDelegatedReleasePermission } from "@emdash-cms/registry-lexicons";
import { fromBase32, toBase32 } from "@atcute/multibase";

//#region src/conformance/index.ts
const RUN_ID_PATTERN = /^[a-z0-9]{6,32}$/;
const SCOPE_ERROR_PATTERN = /^[A-Za-z][A-Za-z0-9]{0,63}$/;
const CONFORMANCE_PACKAGE = "emdash_g0_conformance";
const UNRELATED_COLLECTION = "com.emdashcms.experimental.conformance.probe";
const PACKAGE_MIME_TYPE = "application/gzip";
const IMAGE_MIME_TYPE = "image/png";
const UNRELATED_MIME_TYPE = "application/json";
function bytesFromBase64(value) {
	return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
const PACKAGE_BYTES = bytesFromBase64("H4sIAAAAAAAAAwMAAAAAAAAAAAA=");
const IMAGE_BYTES = bytesFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
const UNRELATED_BYTES = Uint8Array.of(123, 125);
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function expectedDenial(error, expectation) {
	return error.status === expectation.status && error.error === expectation.error;
}
async function probe(id, expectation, scopeDenial, operation, mimeType) {
	try {
		const value = await operation();
		return {
			id,
			expectation,
			outcome: "allowed",
			passed: expectation === "allow",
			...mimeType ? { mimeType } : {},
			...value?.uri ? { uri: value.uri } : {},
			...value?.cid ? { cid: value.cid } : {},
			...value?.blob ? { blob: value.blob } : {}
		};
	} catch (error) {
		if (error instanceof ClientResponseError) {
			const denied = expectedDenial(error, scopeDenial);
			return {
				id,
				expectation,
				outcome: denied ? "denied" : "error",
				passed: expectation === "deny" && denied,
				...mimeType ? { mimeType } : {},
				status: error.status,
				error: error.error,
				...error.description ? { description: error.description } : {}
			};
		}
		return {
			id,
			expectation,
			outcome: "error",
			passed: false,
			...mimeType ? { mimeType } : {},
			error: error instanceof Error ? error.name : "UnknownError",
			description: error instanceof Error ? error.message : "The probe failed unexpectedly."
		};
	}
}
async function checksum(bytes) {
	const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
	const multihash = new Uint8Array(digest.length + 2);
	multihash[0] = 18;
	multihash[1] = digest.length;
	multihash.set(digest, 2);
	return `b${toBase32(multihash)}`;
}
function checksumFromBlobCid(value) {
	if (!value.startsWith("b")) return null;
	try {
		const bytes = fromBase32(value.slice(1));
		return bytes.length === 36 && bytes[0] === 1 && bytes[1] === 85 ? `b${toBase32(bytes.slice(2))}` : null;
	} catch {
		return null;
	}
}
async function blobEvidence(blob, mimeType, bytes) {
	if (blob.$type !== "blob" || blob.mimeType !== mimeType || blob.size !== bytes.length || checksumFromBlobCid(blob.ref.$link) !== await checksum(bytes)) throw new TypeError("PDS returned invalid blob metadata");
	return {
		cid: blob.ref.$link,
		mimeType: blob.mimeType,
		size: blob.size
	};
}
function sameBlob(value, expected) {
	if (!isRecord(value)) return false;
	const ref = value["ref"];
	return value["$type"] === "blob" && value["mimeType"] === expected.mimeType && value["size"] === expected.size && isRecord(ref) && ref["$link"] === expected.cid;
}
function recordReferencesBlobs(value, packageBlob, imageBlob) {
	if (!isRecord(value) || !isRecord(value["artifacts"])) return false;
	const packageArtifact = value["artifacts"]["package"];
	const iconArtifact = value["artifacts"]["icon"];
	if (!isRecord(packageArtifact) || !isRecord(iconArtifact)) return false;
	return sameBlob(packageArtifact["blob"], packageBlob) && sameBlob(iconArtifact["blob"], imageBlob);
}
async function releaseRecord(version, packageBlob, imageBlob) {
	return {
		$type: NSID.packageRelease,
		package: CONFORMANCE_PACKAGE,
		version,
		artifacts: {
			package: {
				blob: packageBlob,
				checksum: await checksum(PACKAGE_BYTES),
				contentType: PACKAGE_MIME_TYPE
			},
			icon: {
				blob: imageBlob,
				checksum: await checksum(IMAGE_BYTES),
				contentType: IMAGE_MIME_TYPE,
				width: 1,
				height: 1
			}
		}
	};
}
async function cleanupRecord(client, scopeDenial, resource, repo, collection, rkey) {
	try {
		await ok(client.post("com.atproto.repo.deleteRecord", { input: {
			repo,
			collection,
			rkey
		} }));
		return {
			resource,
			outcome: "deleted"
		};
	} catch (error) {
		if (error instanceof ClientResponseError) return {
			resource,
			outcome: expectedDenial(error, scopeDenial) ? "denied" : "error",
			status: error.status,
			error: error.error,
			...error.description ? { description: error.description } : {}
		};
		return {
			resource,
			outcome: "error",
			error: error instanceof Error ? error.name : "UnknownError",
			description: error instanceof Error ? error.message : "Cleanup failed unexpectedly."
		};
	}
}
/**
* Exercise the authority granted to an authenticated session.
*
* A successful run leaves one release record in the dedicated conformance
* account. Deletion is an expected denial and the record is retained as the
* evidence of the create-only grant.
*/
async function runPdsScopeConformance(options) {
	if (!RUN_ID_PATTERN.test(options.runId)) throw new TypeError("runId must contain 6-32 lowercase ASCII letters or digits");
	if (options.scopeDenial.status !== 403 || !SCOPE_ERROR_PATTERN.test(options.scopeDenial.error)) throw new TypeError("scopeDenial must identify the exact HTTP 403 scope error");
	const client = new Client({ handler: options.handler });
	const permission = getDelegatedReleasePermission();
	const version = `0.0.0-g0.${options.runId}`;
	const rkey = `${CONFORMANCE_PACKAGE}:${version}`;
	const profileRkey = `emdash_g0_profile_${options.runId}`;
	const unrelatedRkey = `g0_${options.runId}`;
	let packageBlob = null;
	let imageBlob = null;
	let packageBlobReport = null;
	let imageBlobReport = null;
	let record = null;
	let profileCreated = false;
	let unrelatedCreated = false;
	const probes = [];
	probes.push(await probe("package-blob-upload", "allow", options.scopeDenial, async () => {
		const result = await ok(client.post("com.atproto.repo.uploadBlob", {
			headers: { "content-type": PACKAGE_MIME_TYPE },
			input: PACKAGE_BYTES
		}));
		packageBlob = result.blob;
		packageBlobReport = await blobEvidence(result.blob, PACKAGE_MIME_TYPE, PACKAGE_BYTES);
		return { blob: packageBlobReport };
	}, PACKAGE_MIME_TYPE));
	probes.push(await probe("image-blob-upload", "allow", options.scopeDenial, async () => {
		const result = await ok(client.post("com.atproto.repo.uploadBlob", {
			headers: { "content-type": IMAGE_MIME_TYPE },
			input: IMAGE_BYTES
		}));
		imageBlob = result.blob;
		imageBlobReport = await blobEvidence(result.blob, IMAGE_MIME_TYPE, IMAGE_BYTES);
		return { blob: imageBlobReport };
	}, IMAGE_MIME_TYPE));
	probes.push(await probe("unrelated-blob-upload", "deny", options.scopeDenial, async () => {
		return { blob: await blobEvidence((await ok(client.post("com.atproto.repo.uploadBlob", {
			headers: { "content-type": UNRELATED_MIME_TYPE },
			input: UNRELATED_BYTES
		}))).blob, UNRELATED_MIME_TYPE, UNRELATED_BYTES) };
	}, UNRELATED_MIME_TYPE));
	probes.push(await probe("release-create", "allow", options.scopeDenial, async () => {
		if (!packageBlob || !imageBlob) throw new TypeError("Required blob uploads failed");
		record = await releaseRecord(version, packageBlob, imageBlob);
		const result = await ok(client.post("com.atproto.repo.createRecord", { input: {
			repo: options.did,
			collection: permission.collection,
			rkey,
			record,
			validate: false
		} }));
		return {
			uri: result.uri,
			cid: result.cid
		};
	}));
	probes.push(await probe("release-readback", "allow", options.scopeDenial, async () => {
		if (!packageBlobReport || !imageBlobReport) throw new TypeError("Required blob evidence is unavailable");
		const result = await ok(client.get("com.atproto.repo.getRecord", { params: {
			repo: options.did,
			collection: permission.collection,
			rkey
		} }));
		if (!recordReferencesBlobs(result.value, packageBlobReport, imageBlobReport)) throw new TypeError("Release readback does not reference the uploaded blobs");
		return {
			uri: result.uri,
			...result.cid ? { cid: result.cid } : {}
		};
	}));
	probes.push(await probe("release-apply-update", "deny", options.scopeDenial, async () => {
		if (!record) throw new TypeError("Release record is unavailable");
		await ok(client.post("com.atproto.repo.applyWrites", { input: {
			repo: options.did,
			validate: false,
			writes: [{
				$type: "com.atproto.repo.applyWrites#update",
				collection: permission.collection,
				rkey,
				value: {
					...record,
					repo: `https://example.invalid/changed/${options.runId}`
				}
			}]
		} }));
	}));
	probes.push(await probe("release-apply-delete", "deny", options.scopeDenial, async () => {
		await ok(client.post("com.atproto.repo.applyWrites", { input: {
			repo: options.did,
			validate: false,
			writes: [{
				$type: "com.atproto.repo.applyWrites#delete",
				collection: permission.collection,
				rkey
			}]
		} }));
	}));
	probes.push(await probe("release-update", "deny", options.scopeDenial, async () => {
		if (!record) throw new TypeError("Release record is unavailable");
		const updatedRecord = {
			...record,
			repo: `https://example.invalid/changed/${options.runId}`
		};
		const result = await ok(client.post("com.atproto.repo.putRecord", { input: {
			repo: options.did,
			collection: permission.collection,
			rkey,
			record: updatedRecord,
			validate: false
		} }));
		return {
			uri: result.uri,
			cid: result.cid
		};
	}));
	probes.push(await probe("release-delete", "deny", options.scopeDenial, async () => {
		await ok(client.post("com.atproto.repo.deleteRecord", { input: {
			repo: options.did,
			collection: permission.collection,
			rkey
		} }));
	}));
	probes.push(await probe("profile-create", "deny", options.scopeDenial, async () => {
		const result = await ok(client.post("com.atproto.repo.createRecord", { input: {
			repo: options.did,
			collection: NSID.packageProfile,
			rkey: profileRkey,
			record: {
				$type: NSID.packageProfile,
				id: `at://${options.did}/${NSID.packageProfile}/${profileRkey}`,
				type: "emdash-plugin",
				license: "MIT",
				authors: [{ name: "EmDash G0 conformance" }],
				security: [{ url: "https://example.invalid/security" }]
			},
			validate: false
		} }));
		profileCreated = true;
		return {
			uri: result.uri,
			cid: result.cid
		};
	}));
	probes.push(await probe("unrelated-create", "deny", options.scopeDenial, async () => {
		const result = await ok(client.post("com.atproto.repo.createRecord", { input: {
			repo: options.did,
			collection: UNRELATED_COLLECTION,
			rkey: unrelatedRkey,
			record: {
				$type: UNRELATED_COLLECTION,
				runId: options.runId
			},
			validate: false
		} }));
		unrelatedCreated = true;
		return {
			uri: result.uri,
			cid: result.cid
		};
	}));
	const cleanup = [];
	if (profileCreated) cleanup.push(await cleanupRecord(client, options.scopeDenial, "profile-record", options.did, NSID.packageProfile, profileRkey));
	if (unrelatedCreated) cleanup.push(await cleanupRecord(client, options.scopeDenial, "unrelated-record", options.did, UNRELATED_COLLECTION, unrelatedRkey));
	return {
		version: 1,
		provider: options.provider,
		did: options.did,
		pds: options.pds,
		runId: options.runId,
		requestedScope: permission.scope,
		scopeDenial: options.scopeDenial,
		blobs: {
			package: packageBlobReport,
			image: imageBlobReport
		},
		release: {
			collection: permission.collection,
			rkey,
			package: CONFORMANCE_PACKAGE,
			version
		},
		probes,
		cleanup,
		passed: probes.every((item) => item.passed)
	};
}

//#endregion
export { runPdsScopeConformance };
//# sourceMappingURL=index.js.map