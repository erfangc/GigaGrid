import {SubtotalRow} from "./models/SubtotalRow";
import {SubtotalBy} from "./models/ColumnLike";

export class TreeBuilder {

    buildTree(data:any[], subtotalBy:SubtotalBy[]):Tree {

        const grandTotal = new SubtotalRow("Grand Total", []);

        // TODO implement this algo
        for (let i = 0; i < data.length; i++) {
            const datum = data[i];
            for (let j = 0; j < subtotalBy.length; j++) {
                // the subtotal title
                const stval:string = datum[subtotalBy[j].colTag];
            }
        }

        return new Tree(grandTotal);
    }
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