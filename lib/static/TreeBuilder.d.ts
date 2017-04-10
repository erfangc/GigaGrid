import { Row } from "../models/Row";
import { Column } from "../models/ColumnLike";
import { ServerSubtotalRow } from "../store/ServerStore";
export declare class TreeBuilder {
    /**
     * create a shallow tree (with only 1 level - and assume it represents the results of the top most layer subtotal logic
     * @param rows
     * @returns {Tree}
     */
    static buildShallowTree(rows: ServerSubtotalRow[]): Tree;
    static buildTree(data: any[], subtotalBys?: Column[]): Tree;
    private static bucketDetailRow(subtotalBys, detailedRow, grandTotal);
    /**
     * recursively collapse the given node
     * @param node
     * @param shouldCollapse
     */
    static recursivelyToggleChildrenCollapse(node: Row, shouldCollapse?: boolean): void;
    /**
     *
     * @param grandTotal
     * @param buckets
     * @returns {Row}
     */
    private static traverseOrCreate(grandTotal, buckets);
    private static resolveSubtotalBucket(subtotalBy, detailedRow);
}
export declare class Tree {
    private root;
    constructor(root: Row);
    getRoot(): Row;
}
