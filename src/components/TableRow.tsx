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

export interface SubtotalTableRowProps extends GridSubcomponentProps<SubtotalTableRow> {
    row:SubtotalRow;
    tableRowColumnDefs:TableRowColumnDef[];
}

export class SubtotalTableRow extends React.Component<SubtotalTableRowProps, any> {

    constructor(props:SubtotalTableRowProps) {
        super(props);
    }

    render() {
        const props = this.props;
        const cells = props
            .tableRowColumnDefs
            .map((colDef:TableRowColumnDef, i:number) => {
                return (<Cell key={i}
                              isFirstColumn={i === 0}
                              tableRowColumnDef={colDef}
                              dispatcher={this.props.dispatcher}
                              row={this.props.row}/>)
            });
        return <tr className="subtotal-row">{cells}</tr>
    }
}

export interface DetailTableRowProps extends GridSubcomponentProps<DetailTableRow> {
    row:DetailRow;
    tableRowColumnDefs:TableRowColumnDef[];
}

export class DetailTableRow extends React.Component<DetailTableRowProps, any> {

    constructor(props:DetailTableRowProps) {
        super(props);
    }

    render() {
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            return <Cell key={i}
                         isFirstColumn={i === 0}
                         dispatcher={this.props.dispatcher}
                         tableRowColumnDef={colDef}
                         row={this.props.row}/>;
        });
        return <tr>{tds}</tr>
    }

}