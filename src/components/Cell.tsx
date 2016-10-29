import * as React from "react";
import {Column} from "../models/ColumnLike";
import {Row, GenericRow} from "../models/Row";
import {GigaActionType} from "../store/GigaStore";
import {GridSubcomponentProps} from "./GigaGrid";
import SubtotalCell from "./SubtotalCell";
import DetailCell from "./DetailCell";
import SyntheticEvent = __React.SyntheticEvent;
import $ = require('jquery');

export interface CellProps<T extends GenericRow> extends GridSubcomponentProps<Cell<T>> {
    row: T
    column: Column
    rowHeight: string
    isFirstColumn?: boolean
    columnNumber: number
}


export class Cell<T extends GenericRow> extends React.Component<CellProps<T>, any> {

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
            paddingLeft: isFirstColumn ? this.calculateFirstColumnIdentation(this.props.row) : undefined
        };
    }

    protected calculateFirstColumnIdentation(row: Row): string {
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

    protected calculateTextAlignment(row: Row, column: Column): string {
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
        const {row} = this.props;
        if (!row.isDetail())
        // TODO I am really not sure how to avoid the type issue here
            return <SubtotalCell {...this.props} />;
        else
            return <DetailCell {...this.props} />;
    }

}
