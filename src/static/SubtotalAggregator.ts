import { Column, AggregationMethod, FormatInstruction } from '../models/ColumnLike';
import { Row } from '../models/Row';
import { Tree } from './TreeBuilder';
import { ColumnFormat } from "../index";

function straightSum(detailRows: Row[], column: Column): number {
    let sum = 0;
    for (let i = 0; i < detailRows.length; i++) {
        sum += detailRows[i].get(column);
    }
    return sum;
}

function weightedAverage(detailRows: Row[], column: Column): number {
    let denom = 0.0;
    let sumproduct = 0.0;
    for (let i = 0; i < detailRows.length; i++) {
        denom = denom + detailRows[i].getByColTag(column.weightBy);
        sumproduct = sumproduct + detailRows[i].getByColTag(column.colTag) * detailRows[i].getByColTag(column.weightBy);
    }
    if (denom !== 0.0) {
        return sumproduct / denom;
    }
}

function average(detailRows: Row[], column: Column): number {
    if (detailRows.length === 0) {
        return 0;
    }
    return straightSum(detailRows, column) / detailRows.length;
}

function count(detailRows: Row[]): number {
    return detailRows.length;
}

function range(detailRows: Row[], column: Column): string {
    const val = detailRows.map((r: Row) => r.getByColTag(column.colTag));
    return `${Math.min(...val)} - ${Math.max(...val)}`;
}

/**
 * computes the default preferred alignment of the given cell
 * if a formatInstruction is specified on column, then the textAlign property will be respected
 * otherwise we use the default heuristic: numbers -> 'text-align-right' NaN -> 'text-align-left'
 * @param column
 */
export function align(column: Column) {
    let {formatInstruction, format} = column;
    if (formatInstruction && formatInstruction.textAlign) {
        return formatInstruction.textAlign;
    } else {
        if (format === ColumnFormat.CURRENCY || format === ColumnFormat.NUMBER) {
            return 'right';
        } else {
            return 'left';
        }
    }
}

/**
 * formats a given value per the format instruction
 * TODO add tests
 * TODO this does not belong to a file called SubtotalAggregator.ts
 * @param value
 * @param fmtInstruction
 * @returns {any}
 */
export function format(value: any, fmtInstruction: FormatInstruction): any {
    if (!fmtInstruction) {
        return value;
    }
    if (value === '' || value === null || value === undefined) {
        return null;
    }

    let result = value;
    if (fmtInstruction.multiplier && !isNaN(fmtInstruction.multiplier) && !isNaN(result)) {
        result *= fmtInstruction.multiplier;
    }
    if (typeof fmtInstruction.roundTo !== 'undefined' && !isNaN(fmtInstruction.roundTo) && !isNaN(result)) {
        result = parseFloat(result).toFixed(fmtInstruction.roundTo);
    }
    // Deal with concept of localities and currency
    if ((fmtInstruction.separator || fmtInstruction.locale || fmtInstruction.currency) && !isNaN(result)) {
        // Provide legacy support for fmtInstruction.separator
        const locale: string = fmtInstruction.locale || 'en-US';
        // Use currency if available. Warning: this needs to be shimmed for Safari as of Feb 2017.
        if (fmtInstruction.currency) {
            result = new Intl.NumberFormat(locale, {
                style: 'currency',
                maximumFractionDigits: fmtInstruction.roundTo,
                currency: fmtInstruction.currency
            }).format(result);
        }
        else {
            result = new Intl.NumberFormat(locale).format(result);
        }
    }
    if (fmtInstruction.showAsPercent && ['number', 'string'].indexOf(typeof result) > -1) {
        result = `${result}%`;
    }
    return result;
}


/**
 * these should return Tree(s) as oppose to being void ... I want to use Immutable.js to simplify things where possible
 */
export class SubtotalAggregator {

    static aggregateTree(tree: Tree, columns: Column[]): void {
        SubtotalAggregator.aggregateSubtotalRow(tree.getRoot(), columns);
        SubtotalAggregator.aggregateChildren(tree.getRoot(), columns);
    }

    /**
     * depth first recursive implementation of the tree traversal
     * @param subtotalRow
     * @param columns
     */
    private static aggregateChildren(subtotalRow: Row, columns: Column[]) {
        subtotalRow.children.forEach(childRow => {
            SubtotalAggregator.aggregateSubtotalRow(childRow, columns);
            if (childRow.children.length > 0) {
                SubtotalAggregator.aggregateChildren(childRow, columns);
            }
        });
    }

    static aggregate(detailRows: Row[], columns: Column[]): any {
        const aggregated: any = {};
        columns.forEach((column: Column) => {
            let value;
            switch (column.aggregationMethod) {
                case AggregationMethod.AVERAGE:
                    value = average(detailRows, column);
                    break;
                case AggregationMethod.COUNT:
                    value = count(detailRows);
                    break;
                case AggregationMethod.RANGE:
                    value = range(detailRows, column);
                    break;
                case AggregationMethod.SUM:
                    value = straightSum(detailRows, column);
                    break;
                case AggregationMethod.WEIGHTED_AVERAGE:
                    value = weightedAverage(detailRows, column);
                    break;
                default:
                    value = '';
                    break;
            }
            aggregated[column.colTag] = value;
        });
        return aggregated;
    }

    static aggregateSubtotalRow(subtotalRow: Row, column: Column[]): void {
        subtotalRow.data = SubtotalAggregator.aggregate(subtotalRow.detailRows, column);
    }
}
