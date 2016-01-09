import * as React from 'react';
import * as classNames from 'classnames';
import {SubtotalRow} from "../models/Row";
import {TableRowColumnDef} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {DetailRow} from "../models/Row";
import {Row} from "../models/Row";
import {GridSubcomponentProps} from "./TableHeader";
import {ToggleCollapseAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";
import SyntheticEvent = __React.SyntheticEvent;
import {Cell} from "./Cell";

export interface TableRowProps extends GridSubcomponentProps<TableRow> {
    row:Row;
    tableRowColumnDefs:TableRowColumnDef[];
}

export class TableRow extends React.Component<TableRowProps, any> {

    constructor(props:TableRowProps) {
        super(props);
    }

    render() {
        const props = this.props;
        const cx = classNames({
            "subtotal-row": !props.row.isDetail(),
            "selected": props.row.isSelected()
        });
        const cells = props
            .tableRowColumnDefs
            .map((colDef:TableRowColumnDef, i:number) => {
                return (<Cell key={i}
                              isFirstColumn={i === 0}
                              tableRowColumnDef={colDef}
                              dispatcher={this.props.dispatcher}
                              row={this.props.row}/>)
            });
        return <tr className={cx} onClick={()=>{
            var action = {
                type: GigaActionType.TOGGLE_ROW_SELECT,
                row: this.props.row
            };
            this.props.dispatcher.dispatch(action);
        }}>{cells}</tr>
    }
}
