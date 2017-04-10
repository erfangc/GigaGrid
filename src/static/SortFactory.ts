import { Tree } from './TreeBuilder';
import { Row } from '../models/Row';
import { Column, SortDirection } from '../models/ColumnLike';
import { extractCellValue } from './SortFactoryHelpers';

export class SortFactory {

    /**
     * sort the given tree according to orders specified in sortBys
     * handles recursive sorting of subtotal rows
     * @param tree
     * @param sortBys
     * @param firstColumn
     * @returns {Tree}
     */
    public static sortTree(tree: Tree, sortBys: Column[], firstColumn?: Column): Tree {
        let sortFn = SortFactory.createCompositeSorter(sortBys, firstColumn);
        SortFactory.recursivelyExecuteSort(tree.getRoot(), sortFn);
        return tree;
    }

    private static recursivelyExecuteSort(rootRow: Row, fn: (a: Row, b: Row) => number): void {
        if (rootRow.getNumChildren() !== 0) {
            rootRow.children.sort(fn);
            rootRow.children.forEach((child) => {
                SortFactory.recursivelyExecuteSort(child, fn);
            });
        } else {
            rootRow.detailRows.sort(fn);
        }
    }

    private static createCompositeSorter(sortBys: Column[], firstColumn?: Column): (a: Row, b: Row) => number {

        if (!sortBys || sortBys.length === 0) {
            return function (): number {
                return 0;
            };
        }

        // iterate through the sortBys in order, create a sort function for each sort by
        // apply that sortBy function to the data, use the next sortBy as tie breaker
        return function (a: Row, b: Row): number {
            let i = 0;
            let sortFn = SortFactory.buildLexicalSortFn(sortBys[i], firstColumn);
            let result = sortFn(a, b);
            while (result === 0 && i < (sortBys.length - 1)) {
                i++;
                sortFn = SortFactory.resolveSortFnForColumn(sortBys[i]);
                result = sortFn(a, b);
            }
            return result;
        };
    }

    private static resolveSortFnForColumn(sortBy: Column): (a: Row, b: Row) => number {
        // TODO implement and test custom sort functions
        if (sortBy.customSortFn) {
            return sortBy.customSortFn;
        } else {
            return SortFactory.buildLexicalSortFn(sortBy);
        }
    }

    static buildLexicalSortFn(sortBy: Column, firstColumn?: Column): (a: Row, b: Row) => number {

        return function (a: Row, b: Row): number {

            const valA = extractCellValue(a, sortBy, firstColumn);
            const valB = extractCellValue(b, sortBy, firstColumn);

            let result = 0;

            if (!valA || !valB) {
                if (valA) {
                    return -1; // b is greater
                } else if (valB) {
                    return 1; // a is greater
                }
            } else {
                if (valA > valB) {
                    result = 1; // a is greater
                } else if (valB > valA) {
                    result = -1; // b is greater
                }
            }

            if (sortBy.direction === SortDirection.DESC) {
                result = result * -1;
            }

            return result;
        };

    }
}
