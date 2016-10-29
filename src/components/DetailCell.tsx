import * as React from "react";
import * as classNames from "classnames";
import {Cell, CellProps} from "./Cell";
import {DetailRow} from "../models/Row";
import {GigaActionType} from "../store/GigaStore";
import {ToggleCollapseAction} from "../store/reducers/RowCollapseReducers";
import {AggregationMethod} from "../models/ColumnLike";
import {format} from "../static/SubtotalAggregator";

/**
 * Component that implements rendering of a normal detail cell
 */
export default class DetailCell extends Cell<DetailRow> {

    constructor(props) {
        super(props);
    }

    render(): any|JSX.Element {

        let {row, column} = this.props;
        let renderedCellContent: JSX.Element|string|number = format(row.get(column), column.formatInstruction) || "";

        if (!row.isDetail()
            && (column.aggregationMethod === AggregationMethod.COUNT || column.aggregationMethod === AggregationMethod.COUNT_DISTINCT))
            renderedCellContent = `[${renderedCellContent}]`;

        return (
            <div
                className={`content-container giga-grid-column-${this.props.columnNumber} ${super.calculateTextAlignment(row, column)}`}
                onClick={e=>super.onSelect()} style={super.calculateStyle()}
            >
                <span className="content">
                    {renderedCellContent}
                </span>
            </div>
        );
    }

}