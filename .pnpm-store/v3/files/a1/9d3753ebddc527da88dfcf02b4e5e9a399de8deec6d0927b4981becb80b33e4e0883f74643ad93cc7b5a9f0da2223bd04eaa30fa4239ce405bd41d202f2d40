import * as CAR from '@atcute/car';
import * as CBOR from '@atcute/cbor';
import * as CID from '@atcute/cid';
import { isNodeData } from '@atcute/mst';
import { RepoEntry, isCommit } from './types.js';
import { assert } from './utils.js';
import { MAX_NODE_ENTRIES, decodeMstKey, parseMstKey } from './utils/mst.js';
import Queue from './utils/queue.js';
export const repoEntryTransform = () => {
    const transform = new TransformStream();
    let repo;
    return {
        readable: new ReadableStream({
            async start(controller) {
                repo = fromStream(transform.readable);
                try {
                    for await (const entry of repo) {
                        controller.enqueue(entry);
                    }
                    await repo.dispose();
                    controller.close();
                }
                catch (err) {
                    controller.error(err);
                }
            },
            async cancel() {
                if (repo !== undefined) {
                    await repo.dispose();
                }
            },
        }),
        writable: transform.writable,
    };
};
export const fromStream = (stream) => {
    let missingBlocks = [];
    return {
        get missingBlocks() {
            return missingBlocks;
        },
        async dispose() {
            // does nothing for now
        },
        [Symbol.asyncDispose]() {
            return this.dispose();
        },
        async *[Symbol.asyncIterator]() {
            // await using car = CarReader.fromStream(stream);
            const car = CAR.fromStream(stream);
            try {
                const pending = new Map();
                const strays = new Map();
                const queue = new Queue();
                const request = (cid, meta) => {
                    const entry = strays.get(cid);
                    if (entry !== undefined) {
                        strays.delete(cid);
                        queue.enqueue({ c: cid, e: entry, m: meta });
                    }
                    else {
                        const metas = pending.get(cid);
                        if (metas !== undefined) {
                            metas.push(meta);
                        }
                        else {
                            pending.set(cid, [meta]);
                        }
                    }
                };
                {
                    const roots = await car.roots();
                    assert(roots.length >= 1, `expected at least 1 root in the car archive; got=${roots.length}`);
                    const rootCid = roots[0].$link;
                    request(rootCid, { t: 0 });
                }
                for await (const entry of car) {
                    const cid = CID.toString(entry.cid);
                    {
                        const metas = pending.get(cid);
                        if (metas !== undefined) {
                            pending.delete(cid);
                            for (let i = 0, il = metas.length; i < il; i++) {
                                queue.enqueue({ c: cid, e: entry, m: metas[i] });
                            }
                        }
                        else {
                            strays.set(cid, entry);
                        }
                    }
                    let task;
                    while ((task = queue.dequeue())) {
                        const { c: cid, e: entry, m: meta } = task;
                        switch (meta.t) {
                            case 0: {
                                const commit = CBOR.decode(entry.bytes);
                                assert(isCommit(commit), `expected commit block; cid=${cid}`);
                                request(commit.data.$link, { t: 1 });
                                break;
                            }
                            case 1: {
                                const node = CBOR.decode(entry.bytes);
                                assert(isNodeData(node), `expected mst node block; cid=${cid}`);
                                const entries = node.e;
                                const left = node.l;
                                assert(entries.length <= MAX_NODE_ENTRIES, `mst node has too many entries; count=${entries.length}`);
                                let lastKey = '';
                                if (left !== null) {
                                    request(left.$link, meta);
                                }
                                for (let i = 0, il = entries.length; i < il; i++) {
                                    const entry = entries[i];
                                    const next = entry.t;
                                    const key = decodeMstKey(lastKey, entry);
                                    lastKey = key;
                                    request(entry.v.$link, { t: 2, k: key });
                                    if (next !== null) {
                                        request(next.$link, { t: 1 });
                                    }
                                }
                                break;
                            }
                            case 2: {
                                const { collection, rkey } = parseMstKey(meta.k);
                                yield new RepoEntry(collection, rkey, CID.toCidLink(entry.cid), entry);
                                break;
                            }
                        }
                    }
                }
                {
                    const missing = [];
                    for (const [cid, metas] of pending) {
                        for (let i = 0, il = metas.length; i < il; i++) {
                            const meta = metas[i];
                            switch (meta.t) {
                                case 0: {
                                    missing.push({ cid, type: 'commit' });
                                    break;
                                }
                                case 1: {
                                    missing.push({ cid, type: 'mst-node' });
                                    break;
                                }
                                case 2: {
                                    missing.push({ cid, type: 'record', key: meta.k });
                                    break;
                                }
                            }
                        }
                    }
                    missingBlocks = missing;
                }
            }
            finally {
                await car.dispose();
            }
        },
    };
};
