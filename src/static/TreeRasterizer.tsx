import { Tree } from "./TreeBuilder";
import { Row } from "../models/Row";

export class TreeRasterizer {

    static rasterize(tree: Tree): Row[] {

        const grandTotal = tree.getRoot();
        const rasterizedRows: Row[] = [];

        // TODO implement this non-recursively ... to avoid stack related issues
        TreeRasterizer.rasterizeChildren(grandTotal, rasterizedRows);
        rasterizedRows.shift(); // remove grand total

        return rasterizedRows;
    }

    private static rasterizeChildren(row: Row, rasterizedRows: Row[]) {
        // push self
        rasterizedRows.push(row);
        // push children (at which point recurse)
        if (!row.collapsed) {
            if (row.containsDetailRowsOnly()) {
                row.detailRows.forEach(detailRow => rasterizedRows.push(detailRow));
            } else {
                row.children.forEach(child => {
                    TreeRasterizer.rasterizeChildren(child, rasterizedRows);
                });
            }
        }
    }

}