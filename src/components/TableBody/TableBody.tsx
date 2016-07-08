import * as React from 'react';
import {Column} from "../../models/ColumnLike";
import {Row} from "../../models/Row";
import {GigaRow} from "../GigaRow/GigaRow";
import {PROGRESSIVE_RENDERING_THRESHOLD} from "../../store/GigaStore";
import {GridSubcomponentProps} from "../GigaGrid";

export interface TableBodyProps extends GridSubcomponentProps<TableBody> {
    rows: Row[];
    columns: Column[];
    displayStart?: number;
    displayEnd?: number;
    rowHeight?: string;
}

export class TableBody extends React.Component<TableBodyProps,any> {

    constructor(props:TableBodyProps) {
        super(props);
    }

    private isProgressiveRenderingEnabled():boolean {
        return (
            this.props.rows.length > PROGRESSIVE_RENDERING_THRESHOLD
            && typeof this.props.displayStart !== "undefined"
            && typeof this.props.displayEnd !== "undefined"
            && typeof this.props.rowHeight !== this.props.rowHeight
        );
    }

    renderRows(rowHeight: number, start?:number, end?:number):GigaRow[] {
        const rows = validateBounds(start, end) ? this.props.rows.slice(start, end + 1) : this.props.rows;
        return rows.map((row:Row, i:number) => this.mapRowsInBody(rowHeight, row, i));
    }

    mapRowsInBody(rowHeight:number, row:Row, i:number){
        throw "Must extend TableBody, cannot use is as a component directly!";
    }

    render() {
        if (this.isProgressiveRenderingEnabled()) {

            /*
             we only render from displayStart -> displayEnd in rows
             we compute the theoretical height of elements between 0 -> displayStart
             and the theoretical height of elements between displayEnd -> rows.length
             and create a placeholder for each quantity

             this allows us to preserve the total height of contents in table without actually rendering every row
             */
            const rows = this.renderRows(parseInt(this.props.rowHeight), this.props.displayStart, this.props.displayEnd);
            const placeholderHeights = this.calculatePlaceholderHeight();
            return (
                <div>
                    <div style={{height: placeholderHeights.upperPlaceholderHeight + "px"}} className="placeholder"></div>
                    {rows}
                    <div style={{height: placeholderHeights.lowerPlaceholderHeight + "px"}} className="placeholder"></div>
                </div>
            );

        } else {
            const rows = this.renderRows(parseInt(this.props.rowHeight));
            return (
                <div>
                    {rows}
                </div>
            );
        }
    }

    private calculatePlaceholderHeight() {
        const rowHeight:number = parseInt(this.props.rowHeight);
        return {
            upperPlaceholderHeight: Math.max(this.props.displayStart * rowHeight, 0),
            lowerPlaceholderHeight: Math.max((this.props.rows.length - this.props.displayEnd) * rowHeight, 0)
        };
    }
}

function validateBounds(start:number, end:number):boolean {
    return typeof start !== "undefined" && typeof end !== "undefined";
}