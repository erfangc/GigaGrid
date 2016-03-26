import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import * as _ from 'lodash';
import {Column} from "../models/ColumnLike";
export class TreeBuilder {

    /**
     * traverse the tree and find nodes that has identical sector path, set toggleCollapse to false
     * TODO add tests to ensure it does not break
     * @param node
     * @param initiallyExpandedSubtotalRows
     */
    private static selectivelyExpand(node:SubtotalRow, initiallyExpandedSubtotalRows:string[][]) {

        initiallyExpandedSubtotalRows.forEach((sp)=> {
            for (let i = 1; i <= sp.length; i++)
                if (_.isEqual(node.sectorPath(), sp.slice(0, i)))
                    node.toggleCollapse(false);
        });

        if (node.getNumChildren() != 0)
            node.getChildren().forEach((child)=>TreeBuilder.selectivelyExpand(child, initiallyExpandedSubtotalRows))
    }

    /**
     * traverse the tree and find nodes that has identical sector path, set isSelected to true
     * TODO add tests to ensure it does not break
     * @param node
     * @param initiallySelectedSubtotalRows
     */
    private static selectivelySelect(node:SubtotalRow, initiallySelectedSubtotalRows:string[][]) {
        initiallySelectedSubtotalRows.forEach((sp)=> {
            if (_.isEqual(node.sectorPath(), sp))
                node.toggleSelect(true);
        });
        if (node.getNumChildren() != 0)
            node.getChildren().forEach((child)=>TreeBuilder.selectivelySelect(child, initiallySelectedSubtotalRows))
    }

    static buildTree(data:any[],
                     subtotalBys:Column[] = [],
                     initiallyExpandedSubtotalRows?:string[][],
                     initiallySelectedSubtotalRows?:string[][]):Tree {
        /*
         * the way we create a Tree is as follows
         * since each detailRow in data can only belong to ONE SubtotalRow and each SubtotalRow can have only 1 parent
         * we take each detailRow, traverse from the root node (i.e. grandTotal) to the given detailRow's theoretical
         * parent SubtotalRow (in other words, find the detailRow's "bucket") and append said detailRow to the parent
         */
        const grandTotal = new SubtotalRow("Grand Total");
        grandTotal.setSectorPath([]);
        data.forEach(datum => this.bucketDetailRow(subtotalBys, new DetailRow(datum), grandTotal));
        TreeBuilder.recursivelyToggleChildrenCollapse(grandTotal, false);

        /**
         * EXPERIMENTAL - these props allow us to expand / select SubtotalRow on construction of the grid component
         */
        if (initiallyExpandedSubtotalRows)
            TreeBuilder.selectivelyExpand(grandTotal, initiallyExpandedSubtotalRows);
        if (initiallySelectedSubtotalRows)
            TreeBuilder.selectivelySelect(grandTotal, initiallySelectedSubtotalRows);

        return new Tree(grandTotal);
    }

    private static bucketDetailRow(subtotalBys:Column[], detailedRow:DetailRow, grandTotal:SubtotalRow):void {
        /*
         * to traverse the grandTotal and find the detailRow's immediate parent SubtotalRow
         * we store the detailRow's sector names in an ordered array
         */
        const subtotalTitles:string[] = []; // temporary array of strings to keep track subtotal titles names in sequence
        grandTotal.detailRows.push(detailedRow);
        subtotalBys.forEach(subtotalBy => {
            // the subtotal title
            const bucketTitle = TreeBuilder.resolveSubtotalTitle(subtotalBy, detailedRow);
            if (bucketTitle !== undefined) {
                subtotalTitles.push(bucketTitle);
                const subtotalRow = TreeBuilder.traverseOrCreate(grandTotal, subtotalTitles);
                subtotalRow.detailRows.push(detailedRow);
            }
        });
        detailedRow.setSectorPath(subtotalTitles);
    };

    // TODO add tests
    /**
     * recurisvely collapse the given node
     * @param node
     * @param shouldCollapse
     */
    public static recursivelyToggleChildrenCollapse(node:SubtotalRow, shouldCollapse:boolean = true) {
        /**
         *
         * @param node
         * @param shouldCollapse
         * @private
         */
        function _toggleCollapse(node, shouldCollapse) {
            node.toggleCollapse(shouldCollapse);
            TreeBuilder.recursivelyToggleChildrenCollapse(node, shouldCollapse);
        }

        node.getChildren().forEach((child)=> {
            if (shouldCollapse) {
                _toggleCollapse(child, shouldCollapse);
            } else { // expand all
                if (child.getChildren().length || child.sectorPath().length === 1) {
                    _toggleCollapse(child, shouldCollapse);
                }
            }
        });
    }

    /**
     *
     * @param grandTotal
     * @param subtotalTitles
     * @returns {SubtotalRow}
     */
    private static traverseOrCreate(grandTotal:SubtotalRow, subtotalTitles:string[]):SubtotalRow {
        // traverse to the correct SubtotalRow
        var currentRow:SubtotalRow = grandTotal;
        for (let k = 0; k < subtotalTitles.length; k++) {
            // update the current subtotal row
            if (currentRow.hasChildWithTitle(subtotalTitles[k]))
                currentRow = currentRow.getChildByTitle(subtotalTitles[k]);
            else {
                // create a new sector if it is not already available
                const newRow = new SubtotalRow(subtotalTitles[k]);
                newRow.toggleCollapse(true);
                // set the sector path for the new SubtotalRow we just created the length of which determines its depth
                newRow.setSectorPath(subtotalTitles.slice(0, k + 1));
                currentRow.addChild(newRow);
                currentRow = newRow;
            }
        }
        return currentRow;
    };

    private static resolveSubtotalTitle(subtotalBy:Column, detailedRow:DetailRow) {
        return subtotalBy.title ? `${subtotalBy.title}: ${detailedRow.getByColTag(subtotalBy.colTag)}` : detailedRow.getByColTag(subtotalBy.colTag);
    }

}

export class Tree {

    private root:SubtotalRow;

    constructor(root:SubtotalRow) {
        this.root = root;
    }

    getRoot():SubtotalRow {
        return this.root;
    }

}