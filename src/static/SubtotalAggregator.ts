import {ColumnDef} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import {AggregationMethod} from "../models/ColumnLike";
import {Tree} from "./TreeBuilder";
import * as _ from "lodash";
import {FormatInstruction} from "../models/ColumnLike";

function straightSum(detailRows:DetailRow[], columnDef:ColumnDef):number {
    return _.sum(detailRows.map(r=>r.getByColTag(columnDef.colTag)));
}

function weightedAverage(detailRows:DetailRow[], columnDef:ColumnDef):number {
    var denom = 0.0;
    var sumproduct = 0.0;
    for (let i = 0; i < detailRows.length; i++) {
        denom = denom + detailRows[i].getByColTag(columnDef.colTag);
        sumproduct = sumproduct + detailRows[i].getByColTag(columnDef.colTag) * detailRows[i].getByColTag(columnDef.weightBy)
    }
    if (denom !== 0.0)
        return sumproduct / denom;
}

function average(detailRows:DetailRow[], columnDef:ColumnDef):number {
    if (detailRows.length === 0)
        return 0;
    return straightSum(detailRows, columnDef) / detailRows.length;
}

function count(detailRows:DetailRow[], columnDefs:ColumnDef):number {
    return detailRows.length;
}

function countOrDistinct(detailRows:DetailRow[], columnDef:ColumnDef):any {
    const distinctCount = countDistinct(detailRows, columnDef);
    const c = count(detailRows, columnDef);
    if (distinctCount !== 1)
        return `${distinctCount}/${c}`;
    else
        return detailRows[0].getByColTag(columnDef.colTag);
}

function countDistinct(detailRows:DetailRow[], columnDef:ColumnDef):number {
    return _.chain(detailRows).map((r:DetailRow)=>r.getByColTag(columnDef.colTag)).sortBy().uniq(true).value().length;
}

function range(detailRows:DetailRow[], columnDef:ColumnDef):string {
    const val = detailRows.map((r:DetailRow)=>r.getByColTag(columnDef.colTag));
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
        result *= value;
    if (typeof fmtInstruction.roundTo !== "undefined" && !isNaN(fmtInstruction.roundTo) && !isNaN(result))
        result = parseFloat(result).toFixed(fmtInstruction.roundTo);
    if (fmtInstruction.separator && !isNaN(result))
        result = addCommas(result);

    return result;
}


/**
 * these should return Tree(s) as oppose to being void ... I want to use Immutable.js to simplify things where possible
 */
export class SubtotalAggregator {

    static aggregateTree(tree:Tree, columnDefs:ColumnDef[]):void {
        SubtotalAggregator.aggregateSubtotalRow(tree.getRoot(), columnDefs);
        SubtotalAggregator.aggregateChildren(tree.getRoot(), columnDefs);
    }

    /**
     * depth first recursive implementation of the tree traversal
     * @param subtotalRow
     * @param columnDefs
     */
    private static aggregateChildren(subtotalRow:SubtotalRow, columnDefs:ColumnDef[]) {
        subtotalRow.getChildren().forEach(childRow=> {
            SubtotalAggregator.aggregateSubtotalRow(childRow, columnDefs);
            if (childRow.getChildren().length > 0)
                SubtotalAggregator.aggregateChildren(childRow, columnDefs);
        });
    }

    static aggregate(detailRows:DetailRow[], columnDefs:ColumnDef[]):any {
        const aggregated:any = {};
        columnDefs.forEach((columnDef:ColumnDef) => {
            var value;
            switch (columnDef.aggregationMethod) {
                case AggregationMethod.AVERAGE:
                    value = average(detailRows, columnDef);
                    break;
                case AggregationMethod.COUNT:
                    value = count(detailRows, columnDef);
                    break;
                case AggregationMethod.COUNT_DISTINCT:
                    value = countDistinct(detailRows, columnDef);
                    break;
                case AggregationMethod.COUNT_OR_DISTINCT:
                    value = countOrDistinct(detailRows, columnDef);
                    break;
                case AggregationMethod.RANGE:
                    value = range(detailRows, columnDef);
                    break;
                case AggregationMethod.SUM:
                    value = straightSum(detailRows, columnDef);
                    break;
                case AggregationMethod.WEIGHTED_AVERAGE:
                    value = weightedAverage(detailRows, columnDef);
                    break;
                default:
                    value = "";
                    break;
            }
            aggregated[columnDef.colTag] = format(value, columnDef.formatInstruction);
        });
        return aggregated;
    }

    static aggregateSubtotalRow(subtotalRow:SubtotalRow, columnDefs:ColumnDef[]):void {
        subtotalRow.setData(SubtotalAggregator.aggregate(subtotalRow.detailRows, columnDefs));
    }
}
