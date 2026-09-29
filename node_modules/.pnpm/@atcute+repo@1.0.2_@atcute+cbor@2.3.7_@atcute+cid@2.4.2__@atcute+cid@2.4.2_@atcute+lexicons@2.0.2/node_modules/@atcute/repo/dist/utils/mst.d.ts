/**
 * maximum MST traversal depth before a tree is rejected. repositories are reproducible from their contents,
 * so legitimate trees are shallow (well under this); the cap exists to bound recursion and prevent stack
 * overflow from a hostile CAR chaining nodes arbitrarily deep.
 */
export declare const MAX_MST_DEPTH = 256;
/**
 * maximum number of entries in a single MST node. bounds per-node work against key-mining attacks that pack
 * many entries into one node to amplify storage and processing cost.
 */
export declare const MAX_NODE_ENTRIES = 8192;
