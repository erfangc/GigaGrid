import { Row } from "../models/Row";
import { Column, ColumnFormat, BucketInfo } from "../models/ColumnLike";
import { ServerSubtotalRow, dataToSubtotalRows } from "../store/ServerStore";
import { format } from "./SubtotalAggregator";

export class TreeBuilder {

    /**
     * create a shallow tree (with only 1 level - and assume it represents the results of the top most layer subtotal logic
     * @param rows
     * @returns {Tree}
     */
    public static buildShallowTree(rows: ServerSubtotalRow[]): Tree {
        const rootBucket: BucketInfo = { colTag: null, title: "Grand Total", value: null };
        const grandTotal = new Row();
        grandTotal.bucketInfo = rootBucket;
        grandTotal.sectorPath = [];
        grandTotal.collapsed = false;
        dataToSubtotalRows(rows).forEach(row => {
            grandTotal.addChild(row);
        });
        return new Tree(grandTotal);
    }

    static buildTree(data: any[],
        subtotalBys: Column[] = []): Tree {
        /*
         * the way we create a Tree is as follows
         * since each detailRow in data can only belong to ONE Row and each Row can have only 1 parent
         * we take each detailRow, traverse from the root node (i.e. grandTotal) to the given detailRow's theoretical
         * parent Row (in other words, find the detailRow's "bucket") and append said detailRow to the parent
         */
        let rootBucketInfo = { colTag: null, title: "Grand Total", value: null };
        const grandTotal = new Row();
        grandTotal.bucketInfo = rootBucketInfo;
        grandTotal.sectorPath = [];
        grandTotal.collapsed = false;
        data.forEach(datum => {
            let detailedRow = new Row();
            detailedRow.data = datum;
            this.bucketDetailRow(subtotalBys, detailedRow, grandTotal);
        });
        TreeBuilder.recursivelyToggleChildrenCollapse(grandTotal, true);

        return new Tree(grandTotal);
    }

    private static bucketDetailRow(subtotalBys: Column[], detailedRow: Row, grandTotal: Row): void {
        /*
         * to traverse the grandTotal and find the detailRow's immediate parent Row
         * we store the detailRow's sector names in an ordered array
         */
        const buckets: BucketInfo[] = []; // temporary array of strings to keep track subtotal titles names in sequence
        grandTotal.detailRows.push(detailedRow);
        subtotalBys.forEach(subtotalBy => {
            // the subtotal title
            const bucket: BucketInfo = TreeBuilder.resolveSubtotalBucket(subtotalBy, detailedRow);
            if (bucket !== undefined) {
                buckets.push(bucket);
                const subtotalRow = TreeBuilder.traverseOrCreate(grandTotal, buckets);
                subtotalRow.detailRows.push(detailedRow);
            } // FIXME if a detail row is not defined for all the columns we are subtotaling by, it is orphaned (i.e. not part of the tree at all), should we let it 'traverse' back and attach itself to the last subtotal row?
        });
        detailedRow.sectorPath = buckets;
    };

    // TODO add tests
    /**
     * recursively collapse the given node
     * @param node
     * @param shouldCollapse
     */
    public static recursivelyToggleChildrenCollapse(node: Row, shouldCollapse: boolean = true) {
        /**
         *
         * @param row
         * @param shouldCollapse
         * @private
         */
        function toggleCollapse(row: Row, shouldCollapse) {
            row.collapsed = shouldCollapse;
            TreeBuilder.recursivelyToggleChildrenCollapse(row, shouldCollapse);
        }

        node.children.forEach((child) => {
            if (shouldCollapse) {
                toggleCollapse(child, shouldCollapse);
            } else { // expand all
                if (child.children.length || child.sectorPath.length === 1 || child.detailRows.length) {
                    toggleCollapse(child, shouldCollapse);
                }
            }
        });
    }

    /**
     *
     * @param grandTotal
     * @param buckets
     * @returns {Row}
     */
    private static traverseOrCreate(grandTotal: Row, buckets: BucketInfo[]): Row {
        // traverse to the correct Row
        let currentRow: Row = grandTotal;
        for (let k = 0; k < buckets.length; k++) {
            // update the current subtotal row
            const title = buckets[k].title;
            if (currentRow.hasChildWithTitle(title)) {
                currentRow = currentRow.getChildByTitle(title);
            } else {
                // create a new sector if it is not already available
                // Row are created with a `title` and a `firstCellValue` property, firstCellValue is used to determine the row's sort order
                let newRow = new Row();
                newRow.bucketInfo = buckets[k];
                // set the sector path for the new Row we just created the length of which determines its depth
                newRow.sectorPath = buckets.slice(0, k + 1);
                currentRow.addChild(newRow);
                currentRow = newRow;
            }
        }
        return currentRow;
    };

    private static resolveSubtotalBucket(subtotalBy: Column, detailedRow: Row): BucketInfo {
        // FIXME this is the naive implementation, cannot handle text-align-right bands
        let title;
        if (subtotalBy.format === ColumnFormat.NUMBER) {
            title = format(detailedRow.get(subtotalBy), subtotalBy.formatInstruction);
        } else {
            title = detailedRow.get(subtotalBy);
        }
        // if the given column is not defined in the data, return undefined, this will
        if (title === undefined) {
            return undefined;
        }
        return {
            colTag: subtotalBy.colTag,
            title: subtotalBy.title ? `${subtotalBy.title}: ${title}` : title,
            value: subtotalBy.format === ColumnFormat.NUMBER ? parseFloat(title) : title
        };
    }

}

export class Tree {

    private root: Row;

    constructor(root: Row) {
        this.root = root;
    }

    getRoot(): Row {
        return this.root;
    }

}
