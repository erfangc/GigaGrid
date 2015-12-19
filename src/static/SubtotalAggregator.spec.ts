import {SubtotalRow} from "../models/SubtotalRow";
import {ColumnDef} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {AggregationMethod} from "../models/ColumnLike";
import {SubtotalAggregator} from "./SubtotalAggregator";
import {TreeBuilder} from "./TreeBuilder";
import {SubtotalBy} from "../models/ColumnLike";
import {Tree} from "./TreeBuilder";

describe("a SubtotalAggregator", () => {

    const subtotalRow = new SubtotalRow("Parent");
    subtotalRow.detailRows = [
        {"col1": "A", "col2": "C", "data": 1},
        {"col1": "A", "col2": "C", "data": 1},
        {"col1": "A", "col2": "C", "data": 1},
        {"col1": "A", "col2": "C", "data": 1},
        {"col1": "A", "col2": "C", "data": 1}
    ];
    const straightSumColumnDef = new ColumnDef("data", ColumnFormat.NUMBER, AggregationMethod.SUM);
    const avgColumnDef = new ColumnDef("data", ColumnFormat.NUMBER, AggregationMethod.AVERAGE);

    describe("provide function that accept array of detailRows, column definitions and return aggregated data", ()=> {

        it("should perform straight sum aggregation", () => {
            const aggregatedData:any[] = SubtotalAggregator.aggregate(subtotalRow.detailRows, [straightSumColumnDef]);
            expect(aggregatedData["data"]).toBe(5);
        });

        it("should perform average aggregation", () => {
            const aggregatedData:any[] = SubtotalAggregator.aggregate(subtotalRow.detailRows, [avgColumnDef]);
            expect(aggregatedData["data"]).toBe(1);
        });

    });

    describe("provide function that accept SubtotalRow with detailRows, column definitions and populate the detailRows' `data` member", ()=> {
        it("should perform straight sum aggregation", ()=> {
            SubtotalAggregator.aggregateSubtotalRow(subtotalRow, [straightSumColumnDef]);
            expect(subtotalRow.data).not.toEqual({});
            expect(subtotalRow.data[straightSumColumnDef.colTag]).toBe(5);
        });
    });

    describe("provide function to aggregate an entire tree", () => {

        const rawData:any[] = [
            {"col1": "A", "col2": "C", "col3": "F", "data": 1},
            {"col1": "A", "col2": "C", "col3": "F", "data": 1},
            {"col1": "A", "col2": "D", "data": 1},
            {"col1": "B", "col2": "D", "data": 1},
            {"col1": "B", "col2": "C", "data": 1},
            {"col1": "A", "col2": "C", "data": 1},
            {"col1": "A", "col2": "E", "data": 1}
        ];

        const tree:Tree = TreeBuilder.buildTree(rawData, [
            new SubtotalBy("col1"),
            new SubtotalBy("col2"),
            new SubtotalBy("col3")]);

        SubtotalAggregator.aggregateTree(tree, [straightSumColumnDef]);

        it("should have aggregated the grandTotal or root node", () => {
            expect(tree.getRoot().data[straightSumColumnDef.colTag]).toBe(7);
        });

        it("should have aggregated the child SubtotalRow", ()=> {

            expect(tree.getRoot().getChildByTitle("A").data[straightSumColumnDef.colTag]).toBe(5);
            expect(tree.getRoot().getChildByTitle("B").data[straightSumColumnDef.colTag]).toBe(2);

            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").data[straightSumColumnDef.colTag]).toBe(3);
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("D").data[straightSumColumnDef.colTag]).toBe(1);
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").getChildByTitle("F").data[straightSumColumnDef.colTag]).toBe(2);

            expect(tree.getRoot().getChildByTitle("B").getChildByTitle("E")).toBeUndefined();

        });

    });

});
