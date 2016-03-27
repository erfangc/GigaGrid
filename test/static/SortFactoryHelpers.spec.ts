import {TestUtils} from "../TestUtils";
import {DetailRow, SubtotalRow} from "../../src/models/Row";
import {ColumnDef} from "../../src/models/ColumnLike";
import {extractCellValue} from "../../src/static/SortFactoryHelpers";
describe("SortFactoryHelper.extractCellValue()", ()=> {
    
    const detailRow:DetailRow = TestUtils.getDetailRow();
    const columnDefs:ColumnDef[] = TestUtils.getSimpleColumnDefs();
    const subtotalRow:SubtotalRow = TestUtils.getSimpleSubtotalRow();
    
    it("should extract a number detail row", ()=> {
        const val = extractCellValue(detailRow, columnDefs[0]);
        expect(val).toBe(7);
    });

    it("should extract a string detail row", ()=> {
        const val = extractCellValue(detailRow, columnDefs[2]);
        expect(val).toBe("R2D2");
    });

    it("should extract the bucketing column for a subtotal row", ()=> {
        const val = extractCellValue(subtotalRow, {colTag: "numCol1"}, {colTag: "numCol1"});
        expect(val).toBe(1001);
    });

    it("should extract a non-bucketing column for a subtotal row", ()=> {
        const val = extractCellValue(subtotalRow, {colTag: "numCol1"});
        expect(val).toBe(2187);
    });

    
});