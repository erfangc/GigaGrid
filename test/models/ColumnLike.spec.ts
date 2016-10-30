import {Column, ColumnFactory, ColumnGroupDef} from "../../src/models/ColumnLike";
import {GigaState} from "../../src/components/GigaGrid";
import {TestUtils} from "../TestUtils";

describe("ColumnCreator", ()=> {

    const simpleState:GigaState = TestUtils.getMockState();

    it("create 2-dimensional array of columns from a sequence of ColumnGroupDef", ()=> {

        const columnGroupDefs:ColumnGroupDef[] = TestUtils.getMockColumnGroupDefs();
        simpleState.columns = TestUtils.getMockColumnDefs();

        const nestedColumns:Column[][] = ColumnFactory.createColumnsFromGroupDefinition(columnGroupDefs, simpleState);

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