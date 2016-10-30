import {Row} from "../../src/models/Row";

describe('SubtotalRow basic property test', ()=> {


    const subtotalRow = new Row();
    subtotalRow.bucketInfo = {
        colTag: "Parent",
        title: "Parent",
        value: 100
    };

    it("has a bucket -> title", () => {
        expect(subtotalRow.bucketInfo.title).toBe("Parent");
    });

    it("has a bucket -> value", () => {
        expect(subtotalRow.bucketInfo.value).toBe(100);
    });

    it("has a method `data()` that returns the the aggregated results of the row, and it should be initially empty", () => {
        expect(subtotalRow.data).toEqual({});
    });

    it("has a property to indicate it should be collapsed (thus all children shall not be rendered during rasterization)", () => {
        expect(subtotalRow.collapsed).toBe(true);
        subtotalRow.toggleCollapse();
        expect(subtotalRow.collapsed).toBe(false);
        subtotalRow.collapsed = true;
        expect(subtotalRow.collapsed).toBe(true);
        subtotalRow.toggleCollapse();
        expect(subtotalRow.collapsed).toBe(false);
    });

});

describe("SubtotalRow with 2 children", () => {

    var childSubtotalRows:Row[];
    var subtotalRow:Row;

    beforeEach(()=> {
        let row1 = new Row();
        row1.bucketInfo = {
            colTag: "Child 1",
            title: "Child 1",
            value: "Child 1"
        };
        let row2 = new Row();
        row2.bucketInfo = {
            colTag: "Child 2",
            title: "Child 2",
            value: "Child 2"
        };
        childSubtotalRows = [
            row1,
            row2
        ];

        let row3 = new Row();
        row3.bucketInfo = {
            colTag: "Parent",
            title: "Parent",
            value: 100
        };
        subtotalRow = row3;
        childSubtotalRows.forEach(child => {
            subtotalRow.addChild(child);
        });
    });

    it("has 2 children", () => {
        expect(subtotalRow.getNumChildren()).toBe(2);
    });

    it("can add handle adding child with duplicate title", () => {
        let row = new Row();
        row.bucketInfo = {
            colTag: "Child 1",
            title: "Child 1",
            value: "Child 1"
        };
        subtotalRow.addChild(row);
        expect(subtotalRow.getNumChildren()).toBe(2);
    });

    it("can add handle adding child", () => {
        let row = new Row();
        row.bucketInfo = {
            colTag: "Child 3",
            title: "Child 3",
            value: "Child 3"
        };
        subtotalRow.addChild(row);
        expect(subtotalRow.getNumChildren()).toBe(3);
    });

    it("can remove a child with the same title", ()=> {
        expect(subtotalRow.getChildByTitle("Child 1")).toBeDefined();
        let row = new Row();
        row.bucketInfo = {
            colTag: "Child 1",
            title: "Child 1",
            value: "Child 1"
        };
        subtotalRow.removeChild(row);
        expect(subtotalRow.getChildByTitle("Child 1")).toBeUndefined();
    });

    it("can find a child by its title", () => {
        expect(subtotalRow.getChildByTitle("Child 1").bucketInfo.title).toBe("Child 1");
    });

    it("can find a child by its title or return null", () => {
        expect(subtotalRow.getChildByTitle("Never to Be Found")).toBeUndefined();
    });

    it("knows if it has a child with a given name", () => {
        expect(subtotalRow.hasChildWithTitle("Child 2")).toBeTruthy();
    });

});
