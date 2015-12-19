import {SubtotalRow} from "./models/SubtotalRow";
import {SubtotalBy} from "./models/ColumnLike";

export class TreeBuilder {

    static buildTree(data:any[], subtotalBys:SubtotalBy[], grandTotal?: SubtotalRow):Tree {
        grandTotal = grandTotal || new SubtotalRow("Grand Total");
        data.forEach((detailRow) => this.bucketDetailRow(subtotalBys, detailRow, grandTotal));
        return new Tree(grandTotal);
    }

    private static bucketDetailRow(subtotalBys, detailedRow, grandTotal):void {
        const sectors:string[] = []; // temporary array of strings to keep track sector names in sequence
        subtotalBys.forEach((subtotalBy) => {
            // the subtotal title
            sectors.push(detailedRow[subtotalBy.colTag]);
            const subtotalRow = TreeBuilder.traverseOrCreate(grandTotal, sectors);
            subtotalRow.detailRows.push(detailedRow);
        });
    };

    private static traverseOrCreate(grandTotal, sectors):SubtotalRow {
        // traverse to the correct SubtotalRow
        var currentRow = grandTotal;
        for (let k = 0; k < sectors.length; k++) {
            // update the current subtotal row
            if (currentRow.hasChildWithTitle(sectors[k]))
                currentRow = currentRow.getChildByTitle(sectors[k]);
            else {
                // create a new sector if it is not already available
                const newRow = new SubtotalRow(sectors[k]);
                currentRow.children.push(newRow);
                currentRow = newRow;
            }
        }
        return currentRow;
    };

}

export class Tree {

    private root:SubtotalRow;
    private depth:number;

    constructor(root:SubtotalRow) {
        this.root = root;
    }

    getRoot():SubtotalRow {
        return this.root;
    }

}