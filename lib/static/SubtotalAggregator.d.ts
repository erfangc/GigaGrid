import { Column, FormatInstruction } from "../models/ColumnLike";
import { Row } from "../models/Row";
import { Tree } from "./TreeBuilder";
/**
 * computes the default preferred alignment of the given cell
 * if a formatInstruction is specified on column, then the textAlign property will be respected
 * otherwise we use the default heuristic: numbers -> 'text-align-right' NaN -> 'text-align-left'
 * @param row
 * @param column
 */
export declare function align(row: Row, column: Column): string;
/**
 * formats a given value per the format instruction
 * TODO add tests
 * TODO this does not belong to a file called SubtotalAggregator.ts
 * @param value
 * @param fmtInstruction
 * @returns {any}
 */
export declare function format(value: any, fmtInstruction: FormatInstruction): any;
/**
 * these should return Tree(s) as oppose to being void ... I want to use Immutable.js to simplify things where possible
 */
export declare class SubtotalAggregator {
    static aggregateTree(tree: Tree, columns: Column[]): void;
    /**
     * depth first recursive implementation of the tree traversal
     * @param subtotalRow
     * @param columns
     */
    private static aggregateChildren(subtotalRow, columns);
    static aggregate(detailRows: Row[], columns: Column[]): any;
    static aggregateSubtotalRow(subtotalRow: Row, column: Column[]): void;
}
