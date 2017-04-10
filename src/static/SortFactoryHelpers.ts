import { Row } from '../models/Row';
import { Column, ColumnFormat } from '../models/ColumnLike';

/**
 * Figure out what value should we sort on. The data in our table can contain Subtotal and Detail rows
 * @param row
 * @param sortBy
 * @param firstColumn
 * @returns {any}
 */
export function extractCellValue(row: Row, sortBy: Column, firstColumn?: Column) {
    if (row.isDetailRow()) {
        return extractDetailCellValue(row, sortBy);
    }
    else {
        return extractSubtotalCellValue(row, sortBy, firstColumn);
    }
}

function extractSubtotalCellValue(subtotalRow: Row, sortBy: Column, firstColumn?: Column) {
    // sorting on the 1st Column
    // sorting on a text-align-rightally summarized column
    if (firstColumn && firstColumn.colTag === sortBy.colTag) {
        return subtotalRow.bucketInfo.value;
    }

    if (sortBy.format === ColumnFormat.NUMBER) {
        // Remove all non numbers from string (except dot)
        const value = subtotalRow.get(sortBy).toString().replace(/[^\d.-]/g, '');
        return parseFloat(value);
    }
    // sorting on a ordinary column
    else {
        return subtotalRow.get(sortBy);
    }
}

function extractDetailCellValue(row, sortBy: Column) {
    const cellValue = row.get(sortBy);
    if (sortBy.format === ColumnFormat.NUMBER) {
        return parseFloat(cellValue);
    } else {
        return cellValue;
    }
}