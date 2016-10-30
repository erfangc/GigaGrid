import * as React from "react";
import * as classNames from "classnames";
import {Column, AggregationMethod} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {GigaActionType} from "../store/GigaStore";
import {GridComponentProps} from "./GigaGrid";
import {format} from "../static/SubtotalAggregator";
import {ToggleCollapseAction} from "../store/reducers/RowCollapseReducers";
import SyntheticEvent = __React.SyntheticEvent;
import $ = require('jquery');

export interface CellProps extends GridComponentProps<Cell> {
    row: Row
    column: Column
    rowHeight: string
    isFirstColumn?: boolean
    columnNumber: number
}


export class Cell extends React.Component<CellProps, any> {

    constructor(props) {
        super(props);
    }

    protected onSelect() {
        let action = {
            type: GigaActionType.TOGGLE_CELL_SELECT,
            row: this.props.row,
            column: this.props.column
        };
        this.props.dispatcher.dispatch(action);
    }

    protected calculateStyle() {
        let {column, rowHeight, isFirstColumn} = this.props;
        return {
            width: column.width,
            height: rowHeight,
            paddingLeft: isFirstColumn ? Cell.calculateFirstColumnIdentation(this.props.row) : undefined
        };
    }

    protected static calculateFirstColumnIdentation(row: Row): string {
        /*
         handle when there are no subtotal rows
         */
        if (row.sectorPath.length === 0)
            return "10px";
        else {
            const identLevel = row.sectorPath.length;
            return ((row.isDetailRow() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
        }
    }

    protected static calculateTextAlignment(row: Row, column: Column): string {
        const value = row.get(column);
        if (column.formatInstruction && column.formatInstruction.textAlign)
            return `text-align-${column.formatInstruction.textAlign}`;
        else if (isNaN(value))
            return `text-align-left`;
        else
            return `text-align-right`;
    }

    render() {
        const props = this.props;
        const row = props.row;
        const column = props.column;
        if (_.isFunction(column.cellTemplateCreator)) {
            return (
                <div className={`content-container giga-grid-column-${props.columnNumber}`}>
                    <span className="content">
                        {column.cellTemplateCreator(row, column, props)}
                    </span>
                </div>
            );
        }
        else
            return this.renderDefault();
    }

    private renderDefault() {
        const {row, isFirstColumn} = this.props;
        if (!row.isDetailRow() && isFirstColumn)
            return this.renderCellWithCollapseExpandButton();
        else
            return this.renderDetailCell();
    }

    renderDetailCell(): any|JSX.Element {

        let {row, column} = this.props;
        let renderedCellContent: JSX.Element|string|number = format(row.get(column), column.formatInstruction) || "";

        if (!row.isDetailRow()
            && (column.aggregationMethod === AggregationMethod.COUNT || column.aggregationMethod === AggregationMethod.COUNT_DISTINCT))
            renderedCellContent = `[${renderedCellContent}]`;

        return (
            <div
                className={`content-container giga-grid-column-${this.props.columnNumber} ${Cell.calculateTextAlignment(row, column)}`}
                onClick={e=>this.onSelect()} style={this.calculateStyle()}
            >
                <span className="content">
                    {renderedCellContent}
                </span>
            </div>
        );
    }

    renderCellWithCollapseExpandButton(): any|JSX.Element {
        let row = this.props.row;
        const cx = classNames({
            "fa": true,
            "fa-plus-square-o": row.collapsed,
            "fa-minus-square-o": !row.collapsed
        });
        return (
            <div className={`content-container giga-grid-column-${this.props.columnNumber}`}
                 style={this.calculateStyle()} onClick={e=>this.onSelect()}>
                <span className="content group-by-cell">
                    <i className={cx} onClick={(e: MouseEvent)=>this.onCollapseToggle(e)}/>&nbsp;
                    {row.bucketInfo.title || ""}
                </span>
            </div>
        );
    }

    private onCollapseToggle(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation(); // we don't want toggle collapse to also trigger a row / cell clicked event

        const action: ToggleCollapseAction = {
            type: GigaActionType.TOGGLE_ROW_COLLAPSE,
            subtotalRow: this.props.row
        };
        this.props.dispatcher.dispatch(action);
    }


}
