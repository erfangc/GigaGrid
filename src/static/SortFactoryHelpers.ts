import {Row, SubtotalRow, DetailRow} from "../models/Row";
import {Column, ColumnFormat, AggregationMethod} from "../models/ColumnLike";

/**
 * Figure out what value should we sort on. The data in our table can contain Subtotal and Detail rows
 * @param row
 * @param sortBy
 * @param firstColumn
 * @returns {any}
 */
export function extractCellValue(row:Row, sortBy:Column, firstColumn?:Column) {
    if (row.isDetail())
        return extractDetailCellValue(row as DetailRow, sortBy);
    else
        return extractSubtotalCellValue(row as SubtotalRow, sortBy, firstColumn);
}

function extractSubtotalCellValue(subtotalRow:SubtotalRow, sortBy:Column, firstColumn?:Column) {
    // sorting on the 1st Column
    // sorting on a text-align-rightally summarized column
    if (firstColumn && firstColumn.colTag === sortBy.colTag)
        return subtotalRow.bucketInfo.value;
    if ([AggregationMethod.COUNT,
            AggregationMethod.COUNT_DISTINCT,
            AggregationMethod.WEIGHTED_AVERAGE,
            AggregationMethod.AVERAGE,
            AggregationMethod.SUM].indexOf(sortBy.aggregationMethod) !== -1)
        return parseFloat(subtotalRow.get(sortBy));
    // sorting on a ordinary column
    else
        return subtotalRow.get(sortBy);
}

function extractDetailCellValue(row:DetailRow, sortBy:Column) {
    const cellValue = row.get(sortBy);
    if (sortBy.format === ColumnFormat.NUMBER)
        return parseFloat(cellValue);
    else
        return cellValue;
}