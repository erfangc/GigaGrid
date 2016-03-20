import {Tree} from "./TreeBuilder";
import {Row} from "../models/Row";
import {SubtotalRow} from "../models/Row";

export class TreeRasterizer {

    static rasterize(tree:Tree):Row[] {

        const grandTotal = tree.getRoot();
        const rasterizedRows:Row[] = [];

        // TODO implement this non-recursively ... to avoid stack related issues
        TreeRasterizer.rasterizeChildren(grandTotal, rasterizedRows);
        rasterizedRows.shift(); // remove grand total

        return rasterizedRows;
    }

    private static rasterizeChildren(subtotalRow:SubtotalRow, rasterizedRows:Row[]) {
        // push self
        rasterizedRows.push(subtotalRow);
        // push children (at which point recurse)
        if (!subtotalRow.isCollapsed())
            if (subtotalRow.getChildren().length === 0)
                subtotalRow.detailRows.forEach(detailRow=>rasterizedRows.push(detailRow));
            else
                subtotalRow.getChildren().forEach(child=> {
                    TreeRasterizer.rasterizeChildren(child, rasterizedRows);
                });
    }

}