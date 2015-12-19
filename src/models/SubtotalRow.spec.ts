import {SubtotalRow} from "./SubtotalRow";

describe("a SubtotalRow with 2 children", () => {

    const childSubtotalRows:SubtotalRow[] = [
        new SubtotalRow("Child 1"),
        new SubtotalRow("Child 2")
    ];

    const subtotalRow = new SubtotalRow("Parent", childSubtotalRows);

    it("has 2 children", () => {
        expect(subtotalRow.children.length).toBe(2);
    });

});

describe('SubtotalRow properties', ()=> {

    const subtotalRow = new SubtotalRow("Parent");
    it("has a name", () => {
        expect(subtotalRow.name).toBe("Parent");
    });

});
