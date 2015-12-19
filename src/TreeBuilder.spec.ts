import {SubtotalBy} from "./models/ColumnLike";
import {TreeBuilder} from "./TreeBuilder";
import {Tree} from "./TreeBuilder";

describe("a tree builder", () => {

    const data: any[] = [
        {"col1": "A", "col2": "C"},
        {"col1": "B", "col2": "C"},
        {"col1": "A", "col2": "C"},
        {"col1": "A", "col2": "D"},
        {"col1": "B", "col2": "D"}
    ];

    const subtotalBy = [new SubtotalBy("col1"), new SubtotalBy("col2")];
    const tree:Tree = TreeBuilder.buildTree(data, subtotalBy);

    it("should take four flat rows of data, a SubtotalBy object and turn it into a deep tree structure", () => {

        //expect(tree.getDepth()).toBe(2);

        expect(tree.getRoot().children[0].title).toBe("A");
        expect(tree.getRoot().children[1].title).toBe("B");

        expect(tree.getRoot().children[0].children[0].title).toBe("C");
        expect(tree.getRoot().children[1].children[0].title).toBe("C");

        expect(tree.getRoot().children[0].children[1].title).toBe("D");
        expect(tree.getRoot().children[1].children[1].title).toBe("D");

    });

});

// TODO write more tests
