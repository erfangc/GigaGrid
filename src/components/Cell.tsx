import * as React from "react";
import * as classNames from "classnames";
import {Column, AggregationMethod} from "../models/ColumnLike";
import {Row, SubtotalRow} from "../models/Row";
import {format} from "../static/SubtotalAggregator";
import {GigaActionType} from "../store/GigaStore";
import {GridSubcomponentProps} from "./GigaGrid";
import SyntheticEvent = __React.SyntheticEvent;
import {ToggleCollapseAction} from "../store/reducers/RowCollapseReducers";
import {ChangeRowDisplayBoundsAction} from "../store/reducers/ChangeRowDisplayBoundsReducer";
import $ = require('jquery');

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

    render() {
        const props = this.props;
        const row = props.row;
        const column = props.column;
        if (_.isFunction(column.cellTemplateCreator))
            return column.cellTemplateCreator(row, column, props);
        else
            return new DefaultCellRenderer(props).render();
    }

}

export class DefaultCellRenderer {

    private props:CellProps;

    constructor(props: CellProps) {
        this.props = props;
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

    private calculateStyle() {
        return {
            width: this.props.column.width,
            height: this.props.rowHeight,
            paddingLeft: this.props.isFirstColumn ? DefaultCellRenderer.calculateFirstColumnIdentation(this.props.row) : undefined
        };
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

    private renderNormalCell(row:Row, column:Column):JSX.Element {
        var renderedCellContent:JSX.Element|string|number = format(row.get(column), column.formatInstruction) || "";
        if (!row.isDetail()
            && (column.aggregationMethod === AggregationMethod.COUNT || column.aggregationMethod === AggregationMethod.COUNT_DISTINCT))
            renderedCellContent = `[${renderedCellContent}]`;
        return (
            <td className={DefaultCellRenderer.calculateTextAlignment(row, column)}
                onClick={e=>this.onClick()}
                style={this.calculateStyle()}>
                {renderedCellContent}
            </td>
        );
    }

    public static calculateTextAlignment(row: Row, column: Column) {
        const value = row.get(column);
        if (column.formatInstruction && column.formatInstruction.textAlign)
            return `text-align-${column.formatInstruction.textAlign}`;
        else
        if (isNaN(value))
            return `text-align-left`;
        else
            return `text-align-right`;
    }

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

    render(): JSX.Element {
        const {isFirstColumn, row, column} = this.props;
        if (isFirstColumn && !row.isDetail())
            return this.renderCellWithCollapseToggle(row as SubtotalRow);
        else
            return this.renderNormalCell(row, column);
    }

}
