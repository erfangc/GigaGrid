import {Tree} from "../../src/static/TreeBuilder";
import {TestUtils} from "../TestUtils";
import {SortFactory} from "../../src/static/SortFactory";
import {ColumnFormat} from "../../src/models/ColumnLike";
import {SortDirection} from "../../src/models/ColumnLike";
import {TreeBuilder} from "../../src/static/TreeBuilder";
import {SubtotalAggregator} from "../../src/static/SubtotalAggregator";

describe("SortFactory", ()=> {

    const peopleData = TestUtils.newPeopleTestData();
    const data:any[] = peopleData.rawData();

    const unsubtotaledTree = TreeBuilder.buildTree(data);
    const subtotaledTree = TreeBuilder.buildTree(data, [{colTag: "gender"}]);
    SubtotalAggregator.aggregateTree(subtotaledTree, peopleData.columnDefs());

    const sortByGenderGiftAsc = [
        {
            colTag: "gender",
            format: ColumnFormat.STRING,
            direction: SortDirection.ASC
        },
        {
            colTag: "gift",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.ASC
        }];

    const sortByGenderGiftDesc = [
        {
            colTag: "gender",
            format: ColumnFormat.STRING,
            direction: SortDirection.DESC
        },
        {
            colTag: "gift",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.DESC
        }];

    const sortByGiftAsc = [
        {
            colTag: "gift",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.ASC
        }
    ];

    const sortByGiftDesc = [
        {
            colTag: "gift",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.DESC
        }
    ];

    describe("sort un-subtotaled tree", ()=> {

        it("sort string then number columns", ()=> {
            var sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, sortByGenderGiftAsc);
            expect(sortedTree.getRoot().detailRows[0].data()['gender']).toBe("Female");
            expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(2);

            var sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, sortByGenderGiftDesc);
            expect(sortedTree.getRoot().detailRows[0].data()['gender']).toBe("Male");
            expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(9);
        });

        it("sort a number column", ()=> {
            var sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, sortByGiftDesc);
            expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(10);

            var sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, sortByGiftAsc);
            expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(2);
        });

    });

    describe("sort subtotaled tree", ()=> {

        it("sort string then columns", ()=> {
            var sortedTree = SortFactory.sortTree(subtotaledTree, sortByGenderGiftAsc);
            expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Female");

            sortedTree = SortFactory.sortTree(subtotaledTree, sortByGenderGiftDesc);
            expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Male");
        });

        it("sort a number column", ()=> {
            var sortedTree:Tree = SortFactory.sortTree(subtotaledTree, sortByGiftAsc);
            expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Female");

            sortedTree = SortFactory.sortTree(subtotaledTree, sortByGiftDesc);
            expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Male");
        });

    });

    it("will not cause an error is sorting a blank array of SortBy", ()=> {
        expect(SortFactory.sortTree(subtotaledTree, [])).not.toBeNull();
        expect(SortFactory.sortTree(unsubtotaledTree, [])).not.toBeNull();
    });


});
