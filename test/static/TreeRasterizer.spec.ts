describe("TreeRasterizer", ()=> {
    describe("can render a subtotaled tree", () => {
        const sampleData = TestUtils.getSampleData();
        const data:any[] = sampleData.data;
        const tree:Tree = TreeBuilder.buildTree(data, [new SubtotalBy("gender")]);
        const rows:Row[] = TreeRasterizer.rasterize(tree);

        it("can render the correct number of rows including subtotal rows", ()=> {
            expect(rows.length).toBe(12);
        });

        it("the first row in a subtotaled data set should be a subtotal row", ()=> {
            expect(rows[0].title).toMatch(/Male|Female/);
            expect(rows[0].isDetail()).toBeFalsy();
        });

        it("the second row in a subtotaled data set should not be a subtotal row", () => {
            expect(rows[1].isDetail()).toBeTruthy();
        });
    });
    describe("can render a un-subtotaled tree", ()=> {
        const sampleData = TestUtils.getSampleData();
        const data:any[] = sampleData.data;
        const tree:Tree = TreeBuilder.buildTree(data, []);
        const rows:Row[] = TreeRasterizer.rasterize(tree);

        it("render the correct number of rows", ()=> {
            expect(rows.length).toBe(10);
        });

        it("every row should be a detail row", ()=> {
            var isAllDetail = true;
            rows.forEach((row)=> {
                if (!row.isDetail())
                    isAllDetail = false;
            });
            expect(isAllDetail).toBeTruthy();
        });

    });
});