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

export interface SubtotalTableRowProps extends GridSubcomponentProps<SubtotalTableRow> {
    row:SubtotalRow;
    tableRowColumnDefs:TableRowColumnDef[];
}

class TableRowUtils {
    public static calculateFirstColumnIdentation(row:Row) {
        const identLevel = (row.sectorPath() || []).length;
        return ((row.isDetail() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
    }
}


export class SubtotalTableRow extends React.Component<SubtotalTableRowProps, any> {

    constructor(props:SubtotalTableRowProps) {
        super(props);
    }

    onCollapseToggle(e:SyntheticEvent) {
        e.preventDefault();
        const action:ToggleCollapseAction = {
            type: GigaActionType.TOGGLE_ROW_COLLAPSE,
            subtotalRow: this.props.row
        };
        this.props.dispatcher.dispatch(action);
    }

    render() {
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            const padding = TableRowUtils.calculateFirstColumnIdentation(this.props.row);
            if (i === 0) {
                const cx = classNames({
                    "fa": true,
                    "fa-minus": !this.props.row.isCollapsed(),
                    "fa-plus": this.props.row.isCollapsed()
                });
                return (
                    <td key={i}
                        style={{width: colDef.width, paddingLeft: padding}}>
                        <strong onClick={e => this.onCollapseToggle(e)}>
                            <span>
                                <i className={cx}/>&nbsp;
                            </span>
                            {this.props.row.title}
                        </strong>
                    </td>);
            }
            else
            return <td key={i} className={colDef.format === ColumnFormat.NUMBER ? "numeric" : "non-numeric"}
                       style={{width: colDef.width}}>{this.props.row.data()[colDef.colTag] || ""}</td>;
        });
        return <tr className="subtotal-row">{tds}</tr>
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

            var style = {width: colDef.width, paddingLeft: undefined};
            if (i === 0)
                style.paddingLeft = TableRowUtils.calculateFirstColumnIdentation(this.props.row);
            return <td key={i} className={colDef.format === ColumnFormat.NUMBER ? "numeric" : "non-numeric"}
                       style={style}>{this.props.row.data()[colDef.colTag] || ""}</td>;
        });
        return <tr>{tds}</tr>
    }

}