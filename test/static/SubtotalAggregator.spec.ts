import {Row} from "../../src/models/Row";
import {ColumnDef, ColumnFormat, AggregationMethod} from "../../src/models/ColumnLike";
import {SubtotalAggregator} from "../../src/static/SubtotalAggregator";
import {Tree, TreeBuilder} from "../../src/static/TreeBuilder";
import {TestUtils} from "../TestUtils";

describe("SubtotalAggregator", () => {

    const subtotalRow = new Row();
    subtotalRow.bucketInfo = {
        title: "Parent",
        value: "Parent",
        colTag: "Parent"
    };
    subtotalRow.detailRows =
        [1,2,3,4,5].map(() => {
            let row = new Row();
            row.data = {"col1": "A", "col2": "C", "data": 1};
            return row;
        })
    ;
    const straightSumColumnDef:ColumnDef = {
        colTag: "data",
        title: "",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.SUM
    };
    const avgColumnDef = {
        colTag: "data",
        title: "",
        format: ColumnFormat.NUMBER,
        aggregationMethod: AggregationMethod.AVERAGE
    };

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
            {colTag: "col1"},
            {colTag: "col2"},
            {colTag: "col3"}]);

        SubtotalAggregator.aggregateTree(tree, [straightSumColumnDef]);

        it("should have aggregated the grandTotal or root node", () => {
            expect(tree.getRoot().data[straightSumColumnDef.colTag]).toBe(7);
        });

        it("should have aggregated the child SubtotalRow", ()=> {
            expect(tree.getRoot().getChildByTitle("A").get(straightSumColumnDef)).toBe(5);
            expect(tree.getRoot().getChildByTitle("B").get(straightSumColumnDef)).toBe(2);

            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").get(straightSumColumnDef)).toBe(3);
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("D").get(straightSumColumnDef)).toBe(1);
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").getChildByTitle("F").get(straightSumColumnDef)).toBe(2);

            expect(tree.getRoot().getChildByTitle("B").getChildByTitle("E")).toBeUndefined();

        });

    });

    describe("A more complete data set", ()=> {

        const data = TestUtils.newComprehensiveTypeData();
        const detailRows = data.detailRows();
        const columnDefs = data.columnDefs();
        const aggregatedRow = SubtotalAggregator.aggregate(detailRows, columnDefs);

        it("COUNT subtotal", () => {
            expect(aggregatedRow["id"]).toBe(15);
        });

        it("COUNT_DISTINCT subtotal", () => {
            expect(aggregatedRow["last_name"]).toBe(14);
        });

        it("COUNT_OR_DISTINCT subtotal (gender)", () => {
            expect(aggregatedRow["gender"]).toBe("2/15");
        });

        it("COUNT_OR_DISTINCT subtotal (invariant)", () => {
            expect(aggregatedRow["invariant"]).toBe("Invariant");
        });

        it("SUM subtotal", () => {
            expect(aggregatedRow["sum_field"]).toBe(105);
        });

        it("AVERAGE subtotal", () => {
            expect(aggregatedRow["average_field"]).toBe(5.4);
        });

        it("RANGE subtotal", () => {
            expect(aggregatedRow["range_field"]).toBe("1 - 10");
        });

        it("Weighted Average of average_field by weight_factor", ()=> {
            const aggregatedRow = SubtotalAggregator.aggregate(detailRows, [{
                colTag: "average_field",
                aggregationMethod: AggregationMethod.WEIGHTED_AVERAGE,
                weightBy: "weight_factor"
            }]);
            expect(aggregatedRow['average_field']).toBeCloseTo(5.615560, 0.0001);
        });

    });

});
