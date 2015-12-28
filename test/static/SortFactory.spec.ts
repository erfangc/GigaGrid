import {Tree} from "../../src/static/TreeBuilder";
import {TestUtils} from "../TestUtils";
import {SortDirection} from "../../src/static/SortFactory";
import {SortFactory} from "../../src/static/SortFactory";

xdescribe("SortFactory", ()=> {

    const unsubtotaledTree = TestUtils.getUnsubtotaledTree();
    const subtotaledTree = TestUtils.getTreeSubtotaledByGender();

    it("can perform basic sorting on a un-subtotaled tree", ()=> {
        const sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, [
            {
                colTag: "gender",
                direction: SortDirection.ASC
            },
            {
                colTag: "gift", direction: SortDirection.ASC
            }]
        );
        expect(sortedTree.getRoot().detailRows[0].data()['gender']).toBe("Female");
        expect(sortedTree.getRoot().detailRows[0].data()['gift']).toEqual(2);
    });

    it("can perform sorting on subtotaled a tree as well, all the subtotal rows should be sorted at each level", ()=> {
        const sortedTree:Tree = SortFactory.sortTree(unsubtotaledTree, [
            {
                colTag: "gender",
                direction: SortDirection.ASC
            },
            {
                colTag: "gift", direction: SortDirection.ASC
            }]
        );
        expect(sortedTree.getRoot().getChildAtIndex(0).title).toBe("Female");
    });

});
