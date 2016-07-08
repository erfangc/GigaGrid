import * as React from "react";
import {GigaRow} from "./GigaRow";
import {Column} from "../../models/ColumnLike";
import {Cell} from "../Cell";

export class ScrollableGigaRow extends GigaRow {
    mapColumnToCell(column:Column, i:number){
        return (<Cell key={i}
                      isFirstColumn={i == 0 && !this.props.gridProps.staticLeftHeaders}
                      column={column}
                      columnNumber={i + (this.props.gridProps.staticLeftHeaders || 0)}
                      rowHeight={this.props.rowHeight}
                      dispatcher={this.props.dispatcher}
                      gridProps={this.props.gridProps}
                      row={this.props.row}/>)
    }
}