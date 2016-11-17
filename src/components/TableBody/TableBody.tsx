import * as React from "react";
import {Column} from "../../models/ColumnLike";
import {Row} from "../../models/Row";
import {PROGRESSIVE_RENDERING_THRESHOLD} from "../../store/GigaStore";
import {GridComponentProps} from "../GigaGrid";

export interface TableBodyProps extends GridComponentProps<TableBody> {
    rows: Row[];
    columns: Column[];
    displayStart?: number;
    displayEnd?: number;
    rowHeight?: string;
}

export class TableBody extends React.Component<TableBodyProps,any> {

    constructor(props: TableBodyProps) {
        super(props);
    }

    private isProgressiveRenderingEnabled(): boolean {
        let {rows, displayStart, displayEnd, rowHeight} = this.props;
        return (
            rows.length > PROGRESSIVE_RENDERING_THRESHOLD
            && typeof displayStart !== "undefined"
            && typeof displayEnd !== "undefined"
            && typeof rowHeight !== this.props.rowHeight
        );
    }

    renderRows(rowHeight: string, start?: number, end?: number): JSX.Element[] {
        const rows = validateBounds(start, end) ? this.props.rows.slice(start, end + 1) : this.props.rows;
        return rows.map((row: Row, i: number) => this.mapRowsInBody(rowHeight, row, i));
    }

    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element {
        throw "Must extend TableBody, cannot use is as a component directly!";
    }

    render() {
        let {rowHeight, displayStart, displayEnd} = this.props;
        if (this.isProgressiveRenderingEnabled()) {
            /*
             we only render from displayStart -> displayEnd in rows
             we compute the theoretical height of elements between 0 -> displayStart
             and the theoretical height of elements between displayEnd -> rows.length
             and create a placeholder for each quantity

             this allows us to preserve the total height of contents in table without actually rendering every row
             */
            let rows = this.renderRows(rowHeight, displayStart, displayEnd);
            let placeholderHeights = this.calculatePlaceholderHeight();
            return (
                <div>
                    <div style={{height: placeholderHeights.upperPlaceholderHeight + "px"}}
                         className="placeholder"></div>
                    {rows}
                    <div style={{height: placeholderHeights.lowerPlaceholderHeight + "px"}}
                         className="placeholder"></div>
                </div>
            );

        } else {
            let rows = this.renderRows(rowHeight);
            return (
                <div>
                    {rows}
                </div>
            );
        }
    }

    private calculatePlaceholderHeight() {
        let {rowHeight, displayStart, displayEnd, rows} = this.props;
        let rowHeightInt: number = parseInt(rowHeight);
        return {
            upperPlaceholderHeight: Math.max(displayStart * rowHeightInt, 0),
            lowerPlaceholderHeight: Math.max((rows.length - displayEnd) * rowHeightInt, 0)
        };
    }
}

function validateBounds(start: number, end: number): boolean {
    return typeof start !== "undefined" && typeof end !== "undefined";
}