import * as React from "react";
import * as classNames from "classnames";
import {Row} from "../models/Row";
import {Column} from "../models/ColumnLike";
import {GigaActionType} from "../store/GigaStore";
import {Cell} from "./Cell";
import SyntheticEvent = __React.SyntheticEvent;
import {GridSubcomponentProps} from "./GigaGrid";

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
            "placeholder-false": true,
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
        return <tr className={cx} style={{height: this.props.rowHeight}} onClick={(e:SyntheticEvent)=>{
            e.preventDefault();
            var action = {
                type: GigaActionType.TOGGLE_ROW_SELECT,
                row: this.props.row
            };
            this.props.dispatcher.dispatch(action);
        }}>{cells}</tr>
    }
}
