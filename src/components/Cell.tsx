import * as React from 'react';
import * as classNames from 'classnames';
import {Column, AggregationMethod} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {ColumnFormat} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {format} from '../static/SubtotalAggregator';
import SyntheticEvent = __React.SyntheticEvent;
import {ToggleCollapseAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";
import {GridSubcomponentProps} from "./GigaGrid";

export interface CellProps extends GridSubcomponentProps<Cell> {
    row:Row
    column:Column
    rowHeight:string
    isFirstColumn?:boolean
}


export class Cell extends React.Component<CellProps,any> {

    constructor(props:CellProps) {
        super(props);
    }

    private onCollapseToggle(e:SyntheticEvent) {
        e.preventDefault();
        e.stopPropagation(); // we don't want toggle collapse to also trigger a row / cell clicked event

        const action:ToggleCollapseAction = {
            type: GigaActionType.TOGGLE_ROW_COLLAPSE,
            subtotalRow: this.props.row as SubtotalRow
        };
        this.props.dispatcher.dispatch(action);
    }

    private onClick() {
        var action = {
            type: GigaActionType.TOGGLE_CELL_SELECT,
            row: this.props.row,
            column: this.props.column
        };
        this.props.dispatcher.dispatch(action);
    }

    private renderCellWithCollapseToggle(row:SubtotalRow):JSX.Element {

        const cx = classNames({
            "fa": true,
            "fa-plus-square-o": row.isCollapsed(),
            "fa-minus-square-o": !row.isCollapsed()
        });
        return (
            <td style={this.calculateStyle()} onClick={e=>this.onClick()}>
                <span>
                    <i className={cx} onClick={e=>this.onCollapseToggle(e)}/>&nbsp;
                    {row.bucketInfo.title || ""}
                </span>

            </td>
        );
    }

    private calculateStyle() {
        return {
            width: this.props.column.width,
            height: this.props.rowHeight,
            paddingLeft: this.props.isFirstColumn ? TableRowUtils.calculateFirstColumnIdentation(this.props.row) : undefined
        };
    }

    render() {
        const props = this.props;
        const row = props.row;
        const column = props.column;
        if (_.isFunction(column.cellTemplateCreator))
            return column.cellTemplateCreator(row, column, props.isFirstColumn);
        else
            return this.defaultCellRenderer(row, column, props.isFirstColumn);
    }

    private defaultCellRenderer(row: Row, cd:Column, isFirstColumn: boolean):JSX.Element {
        if (isFirstColumn && !row.isDetail())
            return this.renderCellWithCollapseToggle(row as SubtotalRow);
        else
            return this.renderNormalCell(row, cd);
    }

    private renderNormalCell(row:Row, cd:Column):JSX.Element {
        var renderedCellContent:JSX.Element|string|number = format(row.data()[cd.colTag], cd.formatInstruction) || "";
        if (!row.isDetail()
            && (cd.aggregationMethod === AggregationMethod.COUNT || cd.aggregationMethod === AggregationMethod.COUNT_DISTINCT))
            renderedCellContent = `[${renderedCellContent}]`;
        const cx = classNames({
            "numeric": cd.format === ColumnFormat.NUMBER,
            "non-numeric": cd.format !== ColumnFormat.NUMBER
        });
        return (
            <td className={cx}
                onClick={e=>this.onClick()}
                style={this.calculateStyle()}>
                {renderedCellContent}
            </td>
        )
    }

}

class TableRowUtils {
    public static calculateFirstColumnIdentation(row:Row) {
        /*
         handle when there are no subtotal rows
         */
        if ((row.sectorPath() || []).length === 0)
            return "10px";
        else {
            const identLevel = (row.sectorPath() || []).length;
            return ((row.isDetail() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
        }
    }
}