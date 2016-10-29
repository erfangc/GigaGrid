import * as React from "react";
import * as classNames from "classnames";
import {Cell, CellProps} from "./Cell";
import {SubtotalRow} from "../models/Row";
import {GigaActionType} from "../store/GigaStore";
import {ToggleCollapseAction} from "../store/reducers/RowCollapseReducers";

/**
 * Component that implements rendering of a subtotal cell, a cell represents the result of some aggregation
 * and exposes the UI control (i.e. a '+' button) to fetch additional rows that roll up to this row
 */
export default class SubtotalCell extends Cell<SubtotalRow> {

    constructor(props: CellProps<SubtotalRow>) {
        super(props);
    }

    render(): any|JSX.Element {
        let row = this.props.row;
        const cx = classNames({
            "fa": true,
            "fa-plus-square-o": row.isCollapsed(),
            "fa-minus-square-o": !row.isCollapsed()
        });
        return (
            <div className={`content-container giga-grid-column-${this.props.columnNumber}`}
                 style={super.calculateStyle()} onClick={e=>super.onSelect()}>
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