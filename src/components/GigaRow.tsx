import * as React from 'react';
import * as classNames from 'classnames';
import {SubtotalRow} from "../models/Row";
import {Column} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {DetailRow} from "../models/Row";
import {Row} from "../models/Row";
import {GridSubcomponentProps} from "./TableHeaderCell";
import {ToggleCollapseAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";
import SyntheticEvent = __React.SyntheticEvent;
import {Cell} from "./Cell";

export interface GigaRowProps extends GridSubcomponentProps<GigaRow> {
    row:Row;
    rowHeight: string;
    columns:Column[];
}

export class GigaRow extends React.Component<GigaRowProps, any> {

    constructor(props:GigaRowProps) {
        super(props);
    }

    render() {
        const props = this.props;
        const cx = classNames({
            "subtotal-row": !props.row.isDetail(),
            "selected": props.row.isSelected()
        });
        const cells = props
            .columns
            .map((column:Column, i:number) => {
                return (<Cell key={i}
                              isFirstColumn={i === 0}
                              column={column}
                              rowHeight={this.props.rowHeight}
                              dispatcher={this.props.dispatcher}
                              row={this.props.row}/>)
            });
        return <tr className={cx} style={{height: this.props.rowHeight}} onClick={()=>{
            var action = {
                type: GigaActionType.TOGGLE_ROW_SELECT,
                row: this.props.row
            };
            this.props.dispatcher.dispatch(action);
        }}>{cells}</tr>
    }
}
