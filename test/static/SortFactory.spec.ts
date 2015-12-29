import {Tree} from "../../src/static/TreeBuilder";
import {TestUtils} from "../TestUtils";
import {SortDirection} from "../../src/static/SortFactory";
import {SortFactory} from "../../src/static/SortFactory";
import {ColumnFormat} from "../../src/models/ColumnLike";

describe("SortFactory", ()=> {

    const unsubtotaledTree = TestUtils.getUnsubtotaledTree();
    const subtotaledTree = TestUtils.getTreeSubtotaledByGender();

    const ascSortBys = [
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

    const descSortBys = [{
        colTag: "gender",
        format: ColumnFormat.STRING,
        direction: SortDirection.DESC
    },
        {
            colTag: "gift",
            format: ColumnFormat.NUMBER,
            direction: SortDirection.DESC
        }];

    it("can perform basic sorting on a un-subtotaled tree", ()=> {
        const sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, ascSortBys);
        expect(sortedTree.getRoot().detailRows[0].data()['gender']).toBe("Female");
        expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(2);
    });

    it("can perform sorting on subtotaled a tree as well, all the subtotal rows should be sorted at each level", ()=> {
        const sortedTree:Tree = SortFactory.sortTree(subtotaledTree, ascSortBys);
        expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Female");

        const descSortedTree:Tree = SortFactory.sortTree(subtotaledTree, descSortBys);
        expect(descSortedTree.getRoot().getChildAtIndex(0).title).toBe("Male");
    });

});
