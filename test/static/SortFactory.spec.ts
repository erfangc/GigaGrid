/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />


import { Tree, TreeBuilder } from "../../src/static/TreeBuilder";
import { SortFactory } from "../../src/static/SortFactory";
import { ColumnFormat, Column, SortDirection } from "../../src/models/ColumnLike";
import UKBudget from "../../examples/data/UKBudget";

describe("SortFactory", () => {

    const byAgeThenChildrenDESC = [
        {
            colTag: "Age",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.DESC
        },
        {
            colTag: "Children",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.DESC
        }];

    const byAgeThenChildrenASC = byAgeThenChildrenDESC.map((sortBy: Column) => {
        return {
            colTag: sortBy.colTag,
            format: sortBy.format,
            direction: SortDirection.ASC
        }
    });

    describe("Sorting a Unsubtotaled Tree", () => {
        const tree: Tree = TreeBuilder.buildTree(UKBudget.data, []);
        it("should sort on age and children in descending order", () => {
            const sorted = SortFactory.sortTree(tree, byAgeThenChildrenDESC);
            let detailRows = sorted.getRoot().detailRows;
            expect(detailRows[0].getByColTag("Age")).toBe(60);
            expect(detailRows[1].getByColTag("Age")).toBe(60);
            expect(detailRows[detailRows.length - 1].getByColTag("Age")).toBe(19);
            const firstAgeEqual60 = detailRows.find((dr) => dr.getByColTag("Age") == 59);
            expect(firstAgeEqual60.getByColTag("Children")).toBe(2)
        });
        it("should sort on age and children in ascending order", () => {
            const sorted = SortFactory.sortTree(tree, byAgeThenChildrenASC);
            let detailRows = sorted.getRoot().detailRows;
            expect(detailRows[0].getByColTag("Age")).toBe(19);
            expect(detailRows[1].getByColTag("Age")).toBe(19);
            expect(detailRows[detailRows.length - 1].getByColTag("Age")).toBe(60);
            const firstAgeEqual60 = detailRows.find((dr) => dr.getByColTag("Age") == 59);
            expect(firstAgeEqual60.getByColTag("Children")).toBe(1)
        });
    });

    describe("Sorting a Subtotaled Tree", () => {
        const subtotalBys: Column[] = [{ colTag: "Age", title: "Age" }, { colTag: "Children", title: "Children" }, { colTag: "Income", title: "Income" }];
        const tree: Tree = TreeBuilder.buildTree(UKBudget.data, subtotalBys);
        it("should sort on age and children in descending order", () => {
            const sorted = SortFactory.sortTree(tree, byAgeThenChildrenDESC, { colTag: "Age" });
            const lvl1Subtotals = sorted.getRoot().children;
            expect(lvl1Subtotals[0].bucketInfo.value).toBe(60);
            expect(lvl1Subtotals[lvl1Subtotals.length - 1].bucketInfo.value).toBe(19);
        });
        it("should sort on age and children in ascending order", () => {
            const sorted = SortFactory.sortTree(tree, byAgeThenChildrenASC, { colTag: "Age" });
            const lvl1Subtotals = sorted.getRoot().children;
            expect(lvl1Subtotals[0].bucketInfo.value).toBe(19);
            expect(lvl1Subtotals[lvl1Subtotals.length - 1].bucketInfo.value).toBe(60);
        });
    });

});
