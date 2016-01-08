import * as React from 'react';
import * as classNames from 'classnames';
import {GridSubcomponentProps} from "./TableHeader";
import {TableRowColumnDef} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {ColumnFormat} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import SyntheticEvent = __React.SyntheticEvent;
import {ToggleCollapseAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";

export interface CellProps extends GridSubcomponentProps<Cell> {
    row:Row
    tableRowColumnDef:TableRowColumnDef
    isFirstColumn?:boolean
}


export class Cell extends React.Component<CellProps,any> {

    constructor(props:CellProps) {
        super(props);
    }

    private onCollapseToggle(e:SyntheticEvent) {
        e.preventDefault();
        const action:ToggleCollapseAction = {
            type: GigaActionType.TOGGLE_ROW_COLLAPSE,
            subtotalRow: this.props.row as SubtotalRow
        };
        this.props.dispatcher.dispatch(action);
    }

    private renderSubtotalCellWithCollapseBtn(row:SubtotalRow):JSX.Element {

        const cx = classNames({
            "fa": true,
            "fa-plus": row.isCollapsed(),
            "fa-minus": !row.isCollapsed()
        });

        return (
            <td style={this.calculateStyle()}>
                <strong>
                    <span>
                        <i className={cx} onClick={e=>this.onCollapseToggle(e)}/>&nbsp;
                    {row.title || ""}
                    </span>
                </strong>
            </td>
        );
    }

    private calculateStyle() {
        return {
            width: this.props.tableRowColumnDef.width,
            overflow: "hidden",
            paddingLeft: this.props.isFirstColumn ? TableRowUtils.calculateFirstColumnIdentation(this.props.row) : undefined
        };
    }

    render() {

        var result:JSX.Element;
        const props = this.props;
        const row = props.row;
        const cd = props.tableRowColumnDef;
        const cx = classNames({
            "numeric": cd.format === ColumnFormat.NUMBER,
            "non-numeric": cd.format !== ColumnFormat.NUMBER
        });

        // cell is the first cell of a subtotal row
        if (props.isFirstColumn && !row.isDetail())
            result = this.renderSubtotalCellWithCollapseBtn(row as SubtotalRow);
        else
            result = (<td className={cx} style={this.calculateStyle()}>{this.renderContent(row,cd)}</td>);

        return result;
    }

    private renderContent(row:Row, cd:TableRowColumnDef) {
        if (cd.cellTemplateCreator)
            return cd.cellTemplateCreator(row.data()[cd.colTag], cd);
        else
            return row.data()[cd.colTag] || "";
    }
}

class TableRowUtils {
    public static calculateFirstColumnIdentation(row:Row) {
        const identLevel = (row.sectorPath() || []).length;
        return ((row.isDetail() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
    }
}