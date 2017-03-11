import { Tree } from "./TreeBuilder";
import { Row } from "../models/Row";
import { Column } from "../models/ColumnLike";
export declare class SortFactory {
    /**
     * sort the given tree according to orders specified in sortBys
     * handles recursive sorting of subtotal rows
     * @param tree
     * @param sortBys
     * @param firstColumn
     * @returns {Tree}
     */
    static sortTree(tree: Tree, sortBys: Column[], firstColumn?: Column): Tree;
    private static recursivelyExecuteSort(rootRow, fn);
    private static createCompositeSorter(sortBys, firstColumn?);
    private static resolveSortFnForColumn(sortBy);
    static buildLexicalSortFn(sortBy: Column, firstColumn?: Column): (a: Row, b: Row) => number;
}
