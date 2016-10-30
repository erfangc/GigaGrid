import {Tree, TreeBuilder} from "../../src/static/TreeBuilder";
import {Row} from "../../src/models/Row";
import {TreeRasterizer} from "../../src/static/TreeRasterizer";
import {TestUtils} from "../TestUtils";

describe("TreeRasterizer", ()=> {

    describe("can render a subtotaled tree", () => {
        let peopleData = TestUtils.newPeopleTestData();
        let data:any[] = peopleData.rawData();
        let tree:Tree = TreeBuilder.buildTree(data, [{colTag: "gender"}]);
        let rows:Row[] = TreeRasterizer.rasterize(tree);

        it("can render the correct number of rows including subtotal rows", ()=> {
            expect(rows.length).toBe(2); // collapsed by default
        });

        it("the first row in a subtotaled data set should be a subtotal row", ()=> {
            expect((rows[0]).bucketInfo.title).toMatch(/Male|Female/);
            expect(rows[0].isDetailRow()).toBeFalsy();
        });

    });

    describe("children of collapsed rows should not be in the rasterized row array", ()=> {
        let peopleData = TestUtils.newPeopleTestData();
        let data:any[] = peopleData.rawData();
        let tree:Tree = TreeBuilder.buildTree(data, [{colTag: "gender"}]);
        // collapse the 'Male' subtotal row
        tree.getRoot().getChildByTitle("Male").toggleCollapse();
        let rows = TreeRasterizer.rasterize(tree);
        it("only contain 7 rows", () => {
            expect(rows.length).toBe(7);
        });
        it("some detailed row can be 'Male'", ()=> {
            const maleDetailRowEncountered:boolean = _.findIndex(rows, row=>row.isDetailRow() && row.getByColTag("gender") === "Male") !== -1;
            expect(maleDetailRowEncountered).toBeTruthy();
        })
    });

    describe("can render a un-subtotaled tree", ()=> {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const tree:Tree = TreeBuilder.buildTree(data, []);
        const rows:Row[] = TreeRasterizer.rasterize(tree);

        it("render the correct number of rows", ()=> {
            expect(rows.length).toBe(10);
        });

        it("every row should be a detail row", ()=> {
            var isAllDetail = true;
            rows.forEach((row:Row) => {
                if (!row.isDetailRow())
                    isAllDetail = false;
            });
            expect(isAllDetail).toBeTruthy();
        });

    });
});