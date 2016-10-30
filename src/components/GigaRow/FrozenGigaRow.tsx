import * as React from "react";
import {GigaRow} from "./GigaRow";
import {Column} from "../../models/ColumnLike";
import {CellProps} from "../Cell";

/**
 * a row in the freeze pane section of the table
 */
export class FrozenGigaRow extends GigaRow {
    getCellProps(column: Column, i: number): CellProps {
        let {rowHeight, dispatcher, gridProps, row} = this.props;
        return {
            key: i,
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