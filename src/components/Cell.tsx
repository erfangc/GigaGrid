import * as React from "react";
import * as classNames from "classnames";
import {Column, AggregationMethod} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {GigaActionType} from "../store/GigaStore";
import {GridComponentProps} from "./GigaGrid";
import {format, align} from "../static/SubtotalAggregator";
import {ToggleCollapseAction} from "../store/handlers/RowCollapseReducers";
import ClassAttributes = __React.ClassAttributes;

export interface CellProps extends GridComponentProps<Cell> {
    row: Row
    column: Column
    rowHeight: string
    isFirstColumn?: boolean
    columnNumber: number
}

/**
 * Cell is the base class for constructing a single cell in the table
 * by default, if the cell being rendered is the first cell of a subtotal row,
 * we will render a cell with a +/- button to facilitate expand/collapse of rows
 * otherwise we will render a normal cell with text content
 *
 * Users who wants to provide custom rendering should extend this class and leverage many of its protected methods as
 * building blocks for rendering a cell or revert to default behavior as conditions dictate
 */
export class Cell extends React.Component<CellProps & ClassAttributes<Cell>, any> {

    constructor(props) {
        super(props);
    }

    render() {
        const {row, isFirstColumn} = this.props;
        if (!row.isDetailRow() && isFirstColumn) {
            return this.renderCellWithCollapseExpandButton();
        } else {
            return this.renderCellWithoutCollapseExpandButton();
        }
    }

    protected onSelect() {
        let {row, column, dispatcher} = this.props;
        let action = {
            type: GigaActionType.TOGGLE_CELL_SELECT,
            row: row,
            column: column
        };
        dispatcher.dispatch(action);
    }

    protected calculateContainerStyle() {
        let {column, rowHeight, isFirstColumn} = this.props;
        return {
            width: column.width,
            height: rowHeight,
            paddingLeft: isFirstColumn ? this.calculateIdentation() : undefined
        };
    }

    protected calculateIdentation(): string {
        let {row} = this.props;
        /*
         handle when there are no subtotal rows
         */
        if (row.sectorPath.length === 0) {
            return "10px";
        } else {
            const identLevel = row.sectorPath.length;
            return ((row.isDetailRow() && identLevel !== 0 ? identLevel + 1 : identLevel ) * 25) + 'px';
        }
    }

    protected renderCellWithoutCollapseExpandButton(): JSX.Element {
        let {row, column} = this.props;
        let renderedCellContent: JSX.Element|string|number = format(row.get(column), column.formatInstruction) || "";
        if (!row.isDetailRow()
            && (column.aggregationMethod === AggregationMethod.COUNT || column.aggregationMethod === AggregationMethod.COUNT_DISTINCT))
            renderedCellContent = `[${renderedCellContent}]`;
        return this.renderContentContainerWithElement(
            <span className="content">
                    {/* Render a blank space instead of something that could be null or undefined */}
                {renderedCellContent || "\u00A0"}
            </span>,
            align(row, column)
        );
    }

    protected renderCellWithCollapseExpandButton(): any|JSX.Element {
        let row = this.props.row;
        const cx = classNames({
            "fa": true,
            "fa-plus-square-o": row.collapsed,
            "fa-minus-square-o": !row.collapsed
        });
        return (
            this.renderContentContainerWithElement(
                <span className="content group-by-cell">
                    <i className={cx} onClick={(e: React.MouseEvent) => this.onCollapseToggle(e)}/>&nbsp;
                    {row.bucketInfo.title || ""}
                </span>
            )
        );
    }

    protected renderContentContainerWithElement(elm: JSX.Element, className?: string): JSX.Element {
        let {columnNumber} = this.props;
        return (
            <div className={`content-container giga-grid-column-${columnNumber} ${className}`}
                 style={this.calculateContainerStyle()}
                 onClick={e=>this.onSelect()}
            >
                {elm}
            </div>
        );
    }

    protected onCollapseToggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation(); // we don't want toggle collapse to also trigger a row / cell clicked event

        const gridProps = this.props.gridProps;
        if (gridProps && gridProps.useServerStore) {
            if (gridProps.fetchRowsActionCreator)
                gridProps.fetchRowsActionCreator(this.props.row, this.props.dispatcher);
            else
                throw "error: server store in use yet fetchRowsActionCreator not defined on GigaGrid props";
        } else {
            const action: ToggleCollapseAction = {
                type: GigaActionType.TOGGLE_ROW_COLLAPSE,
                subtotalRow: this.props.row
            };
            this.props.dispatcher.dispatch(action);
        }
    }
}
