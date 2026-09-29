import type { CidLink } from '@atcute/cid';
import type { CarBlock } from './types.ts';
/**
 * creates an async generator that yields CAR file chunks
 *
 * @example
 * 	const blocks = async function* () {
 * 		yield { cid: commitCid.bytes, data: commitBytes };
 * 		yield { cid: nodeCid.bytes, data: nodeBytes };
 * 	};
 *
 * 	// Stream chunks
 * 	for await (const chunk of writeCarStream([rootCid], blocks())) {
 * 		stream.write(chunk);
 * 	}
 *
 * 	// Or collect into array (requires Array.fromAsync or polyfill)
 * 	const chunks = await Array.fromAsync(writeCarStream([rootCid], blocks()));
 *
 * @param root root CIDs for the CAR file
 * @param blocks async iterable of blocks to write
 * @yields Uint8Array chunks of the CAR file (header, then entries)
 */
export declare function writeCarStream(roots: CidLink[], blocks: AsyncIterable<CarBlock> | Iterable<CarBlock>): AsyncGenerator<Uint8Array<ArrayBuffer>>;
