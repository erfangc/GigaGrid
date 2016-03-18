import * as React from 'react';
import {GridSubcomponentProps} from "./TableHeaderCell";
import {Column} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {GigaRow} from "./GigaRow";
import {PROGRESSIVE_RENDERING_THRESHOLD} from "../store/GigaStore";

export interface TableBodyProps extends GridSubcomponentProps<TableBody> {
    rows: Row[]
    columns: Column[]
    displayStart?: number
    displayEnd?: number
    rowHeight?: string
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

    private renderRows(rowHeight: number, start?:number, end?:number) {
        function validateBounds() {
            return typeof start !== "undefined" && typeof end !== "undefined";
        }

        const rows = validateBounds() ? this.props.rows.slice(start, end + 1) : this.props.rows;
        return rows.map((row:Row, i:number) => {
            return (<GigaRow key={i}
                             columns={this.props.columns}
                             row={row}
                             rowHeight={`${rowHeight}`}
                             dispatcher={this.props.dispatcher}/>);
        });
    }

    render() {

        if (this.isProgressiveRenderingEnabled()) {

            /*
             we only render from displayStart -> displayEnd in rows
             we compute the theoretical height of elements between 0 -> displayStart
             and the theoretical height of elements between displayEnd -> rows.length
             and create a placeholder for each quantity

             this allow us to preserve the total height of contents in tbody without actually rendering every row
             */
            const rows = this.renderRows(parseInt(this.props.rowHeight), this.props.displayStart, this.props.displayEnd);
            const placeholderHeights = this.calculatePlaceholderHeight();

            return (
                <tbody>
                    <tr style={{height: placeholderHeights.upperPlaceholderHeight + "px"}}/>
                    {rows}
                    <tr style={{height: placeholderHeights.lowerPlaceholderHeight + "px"}}/>
                </tbody>
            );

        } else {
            const rows = this.renderRows(parseInt(this.props.rowHeight));
            return (
                <tbody>
                    {rows}
                </tbody>
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