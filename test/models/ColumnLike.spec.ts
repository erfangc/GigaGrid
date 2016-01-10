import {ColumnDef} from "../../src/models/ColumnLike";
import {AggregationMethod} from "../../src/models/ColumnLike";
import {Column} from "../../src/models/ColumnLike";
import {ColumnFactory} from "../../src/models/ColumnLike";
import {GigaState} from "../../src/components/GigaGrid";
import {ColumnGroupDef} from "../../src/models/ColumnLike";

describe("ColumnCreator", ()=> {

    const simpleState:GigaState = {
        sortBys: [],
        subtotalBys: [],
        filterBys: [],
        tree: null,
        widthMeasures: {
            bodyWidth: null,
            columnWidths: {"colTag1": "100px"}
        }
    };

    describe("create Column objects from ColumnDef", ()=> {

        const spyTemplateCreator = jasmine.createSpy('cellTemplateCreator');
        const inertSpy = jasmine.createSpy('inertSpy');
        const columnDef:ColumnDef = {
        colTag: "colTag1",
        title: "Column Tag 1",
        aggregationMethod: AggregationMethod.SUM,
        cellTemplateCreator: spyTemplateCreator
    };


        it("create a simple Column from a simple ColumnDef", () => {
            const column:Column = ColumnFactory.createColumnFromDefinition(columnDef, simpleState);
            expect(column.colTag).toBe("colTag1");
            expect(column.aggregationMethod).toBe(AggregationMethod.SUM);
            expect(column.title).toBe("Column Tag 1");
            expect(column.width).toBe("100px");
        });

        it("copies callback from definition correctly", ()=> {
            const column:Column = ColumnFactory.createColumnFromDefinition(columnDef, simpleState);
            column.cellTemplateCreator({}, column);
            expect(spyTemplateCreator).toHaveBeenCalled();
            expect(inertSpy).not.toHaveBeenCalled();
        });
    });

    it("create 2-dimensional array of columns from a sequence of ColumnGroupDef", ()=> {

        const columnGroupDefs:ColumnGroupDef[] = [
            {
                title: "Group 1",
                columns: ["col1", "col2"]
            },
            {
                title: "Group 2",
                columns: ["col3", "col2", "col4"] // col2 is repeated intentionally
            }];

        const columnDefs:ColumnDef[] = [
            {
                colTag: "col1"
            },
            {
                colTag: "col2"
            },
            {
                colTag: "col3"
            },
            {
                colTag: "col4"
            }
        ];

        const nestedColumns:Column[][] = ColumnFactory
            .createColumnsFromGroupDefinition(
                columnGroupDefs,
                columnDefs,
                simpleState);

        expect(nestedColumns.length).toBe(2);
        expect(nestedColumns[0].length).toBe(2);
        expect(nestedColumns[1].length).toBe(5);

        expect(nestedColumns[0][0].colSpan).toBe(2);
        expect(nestedColumns[0][1].colSpan).toBe(3);

        expect(nestedColumns[0][0].colTag).toBe("column_group_1");
        expect(nestedColumns[0][0].title).toBe("Group 1");

        expect(nestedColumns[1][1].colTag).toBe("col2");
        expect(nestedColumns[1][3].colTag).toBe("col2");
        expect(nestedColumns[1][4].colTag).toBe("col4");
    });

});