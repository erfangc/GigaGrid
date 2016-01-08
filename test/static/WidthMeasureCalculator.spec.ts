import {ColumnDef} from "../../src/models/ColumnLike";
import {WidthMeasureCalculator} from "../../src/static/WidthMeasureCalculator";
import {WidthMeasures} from "../../src/static/WidthMeasureCalculator";
describe("WidthMeasureCalculator", ()=> {

    describe("only a bodyWidth is provided", ()=> {
        const columnDefs:ColumnDef[] = [
            {colTag: "A"},
            {colTag: "B"},
            {colTag: "C"},
            {colTag: "D"}
        ];

        it("should evenly divide real estate when bodyWidth % columnDefs.length === 0", ()=> {
            const widthMeasures:WidthMeasures = WidthMeasureCalculator.computeWidthMeasures("400px", columnDefs);
            expect(widthMeasures.columnWidths["A"]).toBe("100px");
            expect(widthMeasures.columnWidths["B"]).toBe("100px");
            expect(widthMeasures.columnWidths["C"]).toBe("100px");
            expect(widthMeasures.columnWidths["D"]).toBe("100px");
        });

        it("when bodyWidth % columnDefs.length !== 0, the last column should be slightly shorter | longer than the rest to make the table width whole", ()=> {

            var widthMeasures:WidthMeasures = WidthMeasureCalculator.computeWidthMeasures("435px", columnDefs);
            expect(widthMeasures.columnWidths["A"]).toBe("109px");
            expect(widthMeasures.columnWidths["B"]).toBe("109px");
            expect(widthMeasures.columnWidths["C"]).toBe("109px");
            expect(widthMeasures.columnWidths["D"]).toBe("108px");

            widthMeasures = WidthMeasureCalculator.computeWidthMeasures("337px", columnDefs);
            expect(widthMeasures.columnWidths["A"]).toBe("84px");
            expect(widthMeasures.columnWidths["B"]).toBe("84px");
            expect(widthMeasures.columnWidths["C"]).toBe("84px");
            expect(widthMeasures.columnWidths["D"]).toBe("85px");
        });

    });

    it("should ignore bodyWidth if column width are provided, setting bodyWidth to sum(columns.width)", ()=> {
        const columnDefs:ColumnDef[] = [
            {colTag: "A", width: "120px"},
            {colTag: "B", width: "200px"},
            {colTag: "C", width: "200px"}
        ];
        var widthMeasures:WidthMeasures = WidthMeasureCalculator.computeWidthMeasures("435px", columnDefs);
        expect(widthMeasures.bodyWidth).toBe("520px");
    });

    it("should return 100% for bodyWidth and 'auto' for each column width if neither is provided", ()=> {
        const columnDefs:ColumnDef[] = [
            {colTag: "A"},
            {colTag: "B"},
            {colTag: "C"}
        ];
        // WARNING this behavior makes the header NOT aligned with the body cells, that is why we provided a way to update width in componentDidMount()
        var widthMeasures:WidthMeasures = WidthMeasureCalculator.computeWidthMeasures(null, columnDefs);
        expect(widthMeasures.bodyWidth).toBe("100%");
        expect(widthMeasures.columnWidths["A"]).toBe("auto");
        expect(widthMeasures.columnWidths["B"]).toBe("auto");
        expect(widthMeasures.columnWidths["C"]).toBe("auto");

        widthMeasures = WidthMeasureCalculator.computeWidthMeasures("", columnDefs);
        expect(widthMeasures.bodyWidth).toBe("100%");
        expect(widthMeasures.columnWidths["A"]).toBe("auto");
        expect(widthMeasures.columnWidths["B"]).toBe("auto");
        expect(widthMeasures.columnWidths["C"]).toBe("auto");

    });

});