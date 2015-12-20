import {SubtotalBy} from "./../models/ColumnLike";
import {TreeBuilder} from "./TreeBuilder";
import {Tree} from "./TreeBuilder";
describe("TreeBuilder", ()=> {

    const subtotalBy = [new SubtotalBy("col1"), new SubtotalBy("col2")];

    describe("can build Tree of even depth", () => {

        const data:any[] = [
            {"col1": "A", "col2": "C"},
            {"col1": "B", "col2": "C"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B", "col2": "D"}
        ];

        const tree:Tree = TreeBuilder.buildTree(data, subtotalBy);

        it("should take a few flat rows of data, a SubtotalBy object and turn it into a deep tree structure", () => {

            const grandTotal = tree.getRoot();
            expect(grandTotal.getChildAtIndex(0).title).toBe("A");
            expect(grandTotal.getChildAtIndex(1).title).toBe("B");

            expect(grandTotal.getChildAtIndex(0).getChildAtIndex(0).title).toBe("C");
            expect(grandTotal.getChildAtIndex(1).getChildAtIndex(0).title).toBe("C");

            expect(grandTotal.getChildAtIndex(0).getChildAtIndex(1).title).toBe("D");
            expect(grandTotal.getChildAtIndex(1).getChildAtIndex(1).title).toBe("D");

        });

        it("should bucket two similar detailRows and put them in the same parent SubtotalRow", ()=> {
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").detailRows.length).toBe(2);
        });

        it("intermediate subtotalRows should contain all detailRows that rollup to them", ()=> {

            const grandTotal = tree.getRoot();
            expect(grandTotal.detailRows.length).toBe(data.length);
            expect(grandTotal.getChildByTitle("A").detailRows.length).toBe(3);
            expect(grandTotal.getChildByTitle("B").detailRows.length).toBe(2);
        });

    });

    describe("can build Tree of uneven depth", ()=> {
        // here, B -> * is simply missing entirely
        const data:any[] = [
            {"col1": "A", "col2": "C"},
            {"col1": "B"},
            {"col1": "A", "col2": "C"},
            {"col1": "A", "col2": "D"},
            {"col1": "B"}
        ];
        const tree:Tree = TreeBuilder.buildTree(data, subtotalBy);

        it("should handle the case where a SubtotalBy colTag is missing entirely in the data", () => {
            expect(tree.getRoot().getChildByTitle("B").getNumChildren()).toBe(0);
        });

    });

});
