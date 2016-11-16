import {GigaRow} from "./GigaRow";
import {Column} from "../../models/ColumnLike";
import {CellProps, Cell} from "../Cell";
import {ClassAttributes} from "react";

/**
 * a row in the freeze pane section of the table
 */
export class FrozenGigaRow extends GigaRow {
    getCellProps(column: Column, i: number): CellProps & ClassAttributes<Cell> {
        let {rowHeight, dispatcher, gridProps, row} = this.props;
        return {
            key: super.generateCellKey(column),
            isFirstColumn: i === 0,
            column: column,
            columnNumber: i,
            rowHeight: rowHeight,
            dispatcher: dispatcher,
            gridProps: gridProps,
            row: row
        }
    }
}
