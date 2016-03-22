import {Tree, TreeBuilder} from "../../src/static/TreeBuilder";
import {Row} from "../../src/models/Row";
import {TreeRasterizer} from "../../src/static/TreeRasterizer";
import {TestUtils} from "../TestUtils";

describe("TreeRasterizer", ()=> {

    describe("can render a subtotaled tree", () => {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const tree:Tree = TreeBuilder.buildTree(data, [{colTag: "gender"}]);
        const rows:Row[] = TreeRasterizer.rasterize(tree);

        it("can render the correct number of rows including subtotal rows", ()=> {
            expect(rows.length).toBe(12); // collapsed by default
            // TODO add more test for expanding
        });

        it("the first row in a subtotaled data set should be a subtotal row", ()=> {
            expect(rows[0].title).toMatch(/Male|Female/);
            expect(rows[0].isDetail()).toBeFalsy();
        });

    });

    describe("children of collapsed rows should not be in the rasterized row array", ()=> {
        const peopleData = TestUtils.newPeopleTestData();
        const data:any[] = peopleData.rawData();
        const tree:Tree = TreeBuilder.buildTree(data, [{colTag: "gender"}]);
        // collapse the 'Male' subtotal row
        tree.getRoot().getChildByTitle("Male").toggleCollapse();
        const rows:Row[] = TreeRasterizer.rasterize(tree);
        it("only contain 7 rows", () => {
            expect(rows.length).toBe(7);
        });
        it("no detailed row can be 'Male'", ()=> {
            var maleDetailRowEncountered:boolean = false;
            rows.forEach((row:Row) => {
                if (row.isDetail() && row.title === "Male")
                    maleDetailRowEncountered = true;
            });
            expect(maleDetailRowEncountered).toBeFalsy();
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
                if (!row.isDetail())
                    isAllDetail = false;
            });
            expect(isAllDetail).toBeTruthy();
        });

    });
});