import {Column} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import {AggregationMethod} from "../models/ColumnLike";
import {Tree} from "./TreeBuilder";
import * as _ from "lodash";
import {FormatInstruction} from "../models/ColumnLike";

function straightSum(detailRows:DetailRow[], column:Column):number {
    return _.sum(detailRows.map(r=>r.getByColTag(column.colTag)));
}

function weightedAverage(detailRows:DetailRow[], column:Column):number {
    var denom = 0.0;
    var sumproduct = 0.0;
    for (let i = 0; i < detailRows.length; i++) {
        denom = denom + detailRows[i].getByColTag(column.weightBy);
        sumproduct = sumproduct + detailRows[i].getByColTag(column.colTag) * detailRows[i].getByColTag(column.weightBy)
    }
    if (denom !== 0.0)
        return sumproduct / denom;
}

function average(detailRows:DetailRow[], column:Column):number {
    if (detailRows.length === 0)
        return 0;
    return straightSum(detailRows, column) / detailRows.length;
}

function count(detailRows:DetailRow[]):number {
    return detailRows.length;
}

function countOrDistinct(detailRows:DetailRow[], column:Column):any {
    const distinctCount = countDistinct(detailRows, column);
    const c = count(detailRows);
    if (distinctCount !== 1)
        return `${distinctCount}/${c}`;
    else
        return detailRows[0].getByColTag(column.colTag);
}

function countDistinct(detailRows:DetailRow[], column:Column):number {
    return _.chain(detailRows).map((r:DetailRow)=>r.getByColTag(column.colTag)).sortBy().uniq(true).value().length;
}

function range(detailRows:DetailRow[], column:Column):string {
    const val = detailRows.map((r:DetailRow)=>r.getByColTag(column.colTag));
    return `${_.min(val)} - ${_.max(val)}`;
}

/**
 * formats a given value per the format instruction
 * TODO add tests
 * TODO this does not belong to a file called SubtotalAggregator.ts
 * @param value
 * @param fmtInstruction
 * @returns {any}
 */
export function format(value:any, fmtInstruction:FormatInstruction):any {
    if (!fmtInstruction)
        return value;
    if(fmtInstruction && value === '')
        return null;
    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    var result = value;
    if (fmtInstruction.multiplier && !isNaN(fmtInstruction.multiplier) && !isNaN(result))
        result *= fmtInstruction.multiplier;
    if (typeof fmtInstruction.roundTo !== "undefined" && !isNaN(fmtInstruction.roundTo) && !isNaN(result))
        result = parseFloat(result).toFixed(fmtInstruction.roundTo);
    if (fmtInstruction.separator && !isNaN(result))
        result = addCommas(result);
    if (fmtInstruction.showAsPercent && !isNaN(result))
        result = `${result}%`;
    return result;
}


/**
 * these should return Tree(s) as oppose to being void ... I want to use Immutable.js to simplify things where possible
 */
export class SubtotalAggregator {

    static aggregateTree(tree:Tree, columns:Column[]):void {
        SubtotalAggregator.aggregateSubtotalRow(tree.getRoot(), columns);
        SubtotalAggregator.aggregateChildren(tree.getRoot(), columns);
    }

    /**
     * depth first recursive implementation of the tree traversal
     * @param subtotalRow
     * @param columns
     */
    private static aggregateChildren(subtotalRow:SubtotalRow, columns:Column[]) {
        subtotalRow.getChildren().forEach(childRow=> {
            SubtotalAggregator.aggregateSubtotalRow(childRow, columns);
            if (childRow.getChildren().length > 0)
                SubtotalAggregator.aggregateChildren(childRow, columns);
        });
    }

    static aggregate(detailRows:DetailRow[], columns:Column[]):any {
        const aggregated:any = {};
        columns.forEach((column:Column) => {
            var value;
            switch (column.aggregationMethod) {
                case AggregationMethod.AVERAGE:
                    value = average(detailRows, column);
                    break;
                case AggregationMethod.COUNT:
                    value = count(detailRows);
                    break;
                case AggregationMethod.COUNT_DISTINCT:
                    value = countDistinct(detailRows, column);
                    break;
                case AggregationMethod.COUNT_OR_DISTINCT:
                    value = countOrDistinct(detailRows, column);
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
                    value = "";
                    break;
            }
            aggregated[column.colTag] = value;
        });
        return aggregated;
    }

    static aggregateSubtotalRow(subtotalRow:SubtotalRow, column:Column[]):void {
        subtotalRow.setData(SubtotalAggregator.aggregate(subtotalRow.detailRows, column));
    }
}
