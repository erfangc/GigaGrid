/// <reference path="./TreeBuilder.ts" />

class SubtotalAggregator {

    static aggregateTree(tree:Tree, columnDefs:ColumnDef[]):void {
        SubtotalAggregator.aggregateSubtotalRow(tree.getRoot(), columnDefs);
        SubtotalAggregator.aggregateChildren(tree.getRoot(), columnDefs);
    }

    /**
     * depth first recursive implementation of the tree traversal
     * @param subtotalRow
     * @param columnDefs
     */
    private static aggregateChildren(subtotalRow:SubtotalRow, columnDefs:ColumnDef[]) {
        subtotalRow.getChildren().forEach(childRow=> {
            SubtotalAggregator.aggregateSubtotalRow(childRow, columnDefs);
            if (childRow.getChildren().length > 0)
                SubtotalAggregator.aggregateChildren(childRow, columnDefs);
        });
    }

    static aggregate(detailRows:DetailRow[], columnDefs:ColumnDef[]):any {
        const aggregated:any = {};
        columnDefs.forEach(columnDef => {

            if (columnDef.aggregationMethod === AggregationMethod.SUM) {
                var sum:number = 0.0;
                detailRows.forEach(row=>sum += row.data()[columnDef.colTag]);
                aggregated[columnDef.colTag] = sum;
            } else if (columnDef.aggregationMethod === AggregationMethod.AVERAGE) {
                var sum:number = 0.0;
                detailRows.forEach(row=>sum += row.data()[columnDef.colTag]);
                aggregated[columnDef.colTag] = sum / detailRows.length;
            }
        });
        return aggregated;
    }

    static aggregateSubtotalRow(subtotalRow:SubtotalRow, columnDefs:ColumnDef[]):void {
        subtotalRow.setData(SubtotalAggregator.aggregate(subtotalRow.detailRows, columnDefs));
    }
}
