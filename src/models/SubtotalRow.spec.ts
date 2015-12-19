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

    it("can find a child by its title", () => {
        expect(subtotalRow.getChildByTitle("Child 1").title).toBe("Child 1");
    });

    it("can find a child by its title or return null", () => {
        expect(subtotalRow.getChildByTitle("Never to Be Found")).toBeNull();
    });

    it("knows if it has a child with a given name", () => {
        expect(subtotalRow.hasChildWithTitle("Child 2")).toBeTruthy();
    })

});

describe('SubtotalRow properties', ()=> {

    const subtotalRow = new SubtotalRow("Parent");
    it("has a title", () => {
        expect(subtotalRow.title).toBe("Parent");
    });

});
