import { Row } from "../models/Row";
import { Column } from "../models/ColumnLike";
/**
 * Figure out what value should we sort on. The data in our table can contain Subtotal and Detail rows
 * @param row
 * @param sortBy
 * @param firstColumn
 * @returns {any}
 */
export declare function extractCellValue(row: Row, sortBy: Column, firstColumn?: Column): any;
