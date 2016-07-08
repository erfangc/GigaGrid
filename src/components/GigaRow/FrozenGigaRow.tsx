import * as React from "react";
import {GigaRow} from "./GigaRow";
import {Column} from "../../models/ColumnLike";
import {Cell} from "../Cell";

export class FrozenGigaRow extends GigaRow {
    mapColumnToCell(column:Column, i:number){
        return (<Cell key={i}
                      isFirstColumn={i === 0}
                      column={column}
                      columnNumber={i}
                      rowHeight={this.props.rowHeight}
                      dispatcher={this.props.dispatcher}
                      gridProps={this.props.gridProps}
                      row={this.props.row}/>)
    }    
}