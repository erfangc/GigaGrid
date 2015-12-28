import * as React from 'react';
import {SubtotalRow} from "../models/Row";
import {TableRowColumnDef} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {DetailRow} from "../models/Row";
import {Row} from "../models/Row";
import {GridSubcomponentProps} from "./TableHeader";

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

    // TODO this will certainly not trigger the parent to be re-rendered
    // we have two options, use a custom event system (Emit) or use a callback attached to props and the event will be propogated up to the parent
    onCollapseToggle() {
        this.props.row.toggleCollapse();
    }

    render() {
        const tds = this.props.tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number) => {
            const padding = TableRowUtils.calculateFirstColumnIdentation(this.props.row);
            if (i === 0)
                return (
                    <td key={i}
                        onClick={e => this.onCollapseToggle()}
                        style={{width: colDef.width, paddingLeft: padding}}
                        className="giga-grid-locked-col">
                        <strong>
                            <span>
                                <i className="fa fa-minus"/>&nbsp;
                            </span>
                            {this.props.row.title}
                        </strong>
                    </td>);
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