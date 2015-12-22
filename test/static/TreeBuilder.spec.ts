describe("TreeBuilder", ()=> {

    const subtotalBy = [new SubtotalBy("col1"), new SubtotalBy("col2")];

    it("still functions when an empty SubtotalBy array is passed in", ()=> {
        const data:any[] = TestUtils.getSimpleRawData();
        const tree:Tree = TreeBuilder.buildTree(data, []);
        expect(tree.getRoot().getChildren().length).toBe(0);
        expect(tree.getRoot().detailRows.length).toBe(5);
    });

    describe("can build Tree of even depth", () => {

        const data:any[] = TestUtils.getSimpleRawData();

        const tree:Tree = TreeBuilder.buildTree(data, subtotalBy);

        it("rows within the Tree should have sector path array populated", ()=> {
            expect(tree.getRoot().sectorPath()).toEqual([]);
            expect(tree.getRoot().getChildByTitle("A").sectorPath()).toEqual(['A']);
            expect(tree.getRoot().getChildByTitle("A").getChildByTitle("C").sectorPath()).toEqual(['A', 'C']);
            expect(tree.getRoot().getChildByTitle("B").getChildByTitle("D").sectorPath()).toEqual(['B', 'D']);
        });

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
        const data:any[] = TestUtils.getSimpleRawDataWithMissing();
        const tree:Tree = TreeBuilder.buildTree(data, subtotalBy);

        it("should handle the case where a SubtotalBy colTag is missing entirely in the data", () => {
            expect(tree.getRoot().getChildByTitle("B").getNumChildren()).toBe(0);
        });

    });

});
