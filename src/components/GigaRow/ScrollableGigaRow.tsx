import {ClassAttributes} from "react";
import {GigaRow} from "./GigaRow";
import {Column} from "../../models/ColumnLike";
import {CellProps, Cell} from "../Cell/Cell";

export class ScrollableGigaRow extends GigaRow {
    getCellProps(column: Column, i: number): CellProps & ClassAttributes<Cell> {
        let {gridProps, rowHeight, dispatcher, row} = this.props;
        return {
            key: super.generateCellKey(column),
            isFirstColumn: i == 0 && !gridProps.staticLeftHeaders,
            column: column,
            columnNumber: i + (gridProps.staticLeftHeaders || 0),
            rowHeight: rowHeight,
            dispatcher: dispatcher,
            gridProps: gridProps,
            row: row
        }
    }
}
