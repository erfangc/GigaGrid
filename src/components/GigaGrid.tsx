import ReactElement = __React.ReactElement;
import * as React from 'react';
import {DetailTableRow,SubtotalTableRow} from "./TableRow";
import {SubtotalBy} from "../models/ColumnLike";
import {ColumnDef} from "../models/ColumnLike";
import {TreeBuilder} from "../static/TreeBuilder";
import {Tree} from "../static/TreeBuilder";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {ColumnFormat} from "../models/ColumnLike";
import {TreeRasterizer} from "../static/TreeRasterizer";
import {Row} from "../models/Row";
import {TableRowColumnDef} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import {TableHeader} from "./TableHeader";

/**
 * strongly typed arguments given to the grid
 */
export interface GigaGridProps extends React.Props<GigaGrid> {
    initialSubtotalBys?:SubtotalBy[];
    data:any[];
    columnDefs:ColumnDef[];
}

class GigaGridState {
    public tree:Tree;
    public subtotalBys:SubtotalBy[];
}

/**
 * The root component of this React library. assembles raw data into `Row` objects which are then translated into their
 * virtual DOM representation
 *
 * The bulk of the table state is stored in `tree`, which contains subtotal and detail rows
 * Rows can be hidden if filtered out or sorted among other things, subtotal rows can be collapsed etc
 * mutations to the state of table from user initiated actions can be thought of as mutates on the `tree`
 *
 */
export class GigaGrid extends React.Component<GigaGridProps, GigaGridState> {

    constructor(props:GigaGridProps) {
        super(props);
        const tree:Tree = TreeBuilder.buildTree(this.props.data, this.props.initialSubtotalBys);
        SubtotalAggregator.aggregateTree(tree, this.props.columnDefs);
        this.state = {tree: tree, subtotalBys: this.props.initialSubtotalBys};
    }

    render() {
        // TODO first pass implementation ... need to make better, the final implementation will wrap things like scrollbar and footers
        const tableRowColumnDefs:TableRowColumnDef[] = this.props.columnDefs.map((colDef) => {
            return {
                colTag: colDef.colTag,
                title: colDef.title,
                aggregationMethod: colDef.aggregationMethod,
                format: colDef.format,
                width: "auto"
            };
        });

        return (
            <div className="giga-grid">
                <table>
                    {this.renderColumnHeaders(tableRowColumnDefs)}
                    <tbody>
                        {this.renderTableRows(tableRowColumnDefs)}
                    </tbody>
                </table>
                {this.renderTableFooter()}
            </div>);
    }

    renderColumnHeaders(tableRowColumnDefs:TableRowColumnDef[]):ReactElement<{}> {
        const ths = tableRowColumnDefs.map((colDef:TableRowColumnDef, i:number)=> {
            return <TableHeader tableColumnDef={colDef} key={i} isFirstColumn={i===0}
                                isLastColumn={i===tableRowColumnDefs.length-1}/>
        });
        return (
            <thead>
                <tr>{ths}</tr>
            </thead>
        );
    }

    renderTableRows(tableRowColumnDefs:TableRowColumnDef[]):ReactElement<{}>[] {
        const rows:Row[] = TreeRasterizer.rasterize(this.state.tree);
        // convert plain ColumnDef to TableRowColumnDef which has additional properties
        return rows.map((row:Row, i:number)=> {
            // syntax highlighter will think Row cannot be coerced into its implementing classes
            // we would need to explicitly down cast ... BUT this is JSX, the TypeScript down cast operator looks
            // like an XML opening tag ... so we can't do that and have to live with the syntax highlight error LOL
            if (row.isDetail())
                return <DetailTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row as DetailRow}/>;
            else
                return <SubtotalTableRow key={i} tableRowColumnDefs={tableRowColumnDefs} row={row as SubtotalRow}/>
        });
    }

    renderTableFooter() {
        // TODO dummy implemenation, replace with pagination
        return (<div></div>);
    }
}
