import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Flux from 'flux';
import * as FluxUtils from 'flux/utils';
import $ = require('jquery');
import ReactElement = __React.ReactElement;
import {SubtotalBy} from "../models/ColumnLike";
import {ColumnDef} from "../models/ColumnLike";
import {ColumnFormat} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {Column} from "../models/ColumnLike";
import {SubtotalRow} from "../models/Row";
import {DetailRow} from "../models/Row";
import {TableHeaderCell} from "./TableHeaderCell";
import {TreeRasterizer} from "../static/TreeRasterizer";
import {Tree} from "../static/TreeBuilder";
import {GigaStore} from "../store/GigaStore";
import ReduceStore = FluxUtils.ReduceStore;
import Dispatcher = Flux.Dispatcher;
import {GigaAction} from "../store/GigaStore";
import {GigaRow} from "./GigaRow";
import {SortBy} from "../models/ColumnLike";
import {FilterBy} from "../models/ColumnLike";
import {TableWidthChangeAction} from "../store/GigaStore";
import {GigaActionType} from "../store/GigaStore";
import {WidthMeasures} from "../static/WidthMeasureCalculator";
import {WidthMeasureCalculator} from "../static/WidthMeasureCalculator";
import {parsePixelValue} from "../static/WidthMeasureCalculator";
import {validateColumnWidthProperty} from "../static/WidthMeasureCalculator";
import {getScrollBarWidth} from "../static/WidthMeasureCalculator";
import {TableBody} from "./TableBody";
import {ColumnFactory} from "../models/ColumnLike";
import {ColumnGroupDef} from "../models/ColumnLike";
import {TableHeader} from "./TableHeader";
import {ScrollCalculator} from "../static/ScrollCalculator";
import {ChangeRowDisplayBoundsAction} from "../store/GigaStore";

/**
 * Interface that describe the shape of the `Props` that `GigaGrid` accepts from the user
 * the bare minimum are: `data` and `columnDefs`
 */
export interface GigaProps extends React.Props<GigaGrid> {

    /**
     * Initial set of SubtotalBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified subtotals
     */
    initialSubtotalBys?:SubtotalBy[]

    /**
     * Initial set of SortBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified sorting order
     */
    initialSortBys?:SortBy[]

    initialFilterBys?:FilterBy[]

    /**
     * Callback that fires when a row is clicked, return `false` in the passed callback function to suppress
     * default behavior (highlights the row)
     * @param row the `Row` object associated with the row the user clicked on
     */
    onRowClick?: (row:Row)=>boolean

    /**
     * Callback that fires when a cell is clicked, return `false` in the passed callback function to suppress
     * default behavior
     *
     * Example
     *
     * ```js
     *
     * onCellClick = (row, columnDef) => {
     *  console.log(row.get(columnDef))
     *  // prints the value of the cell clicked on!
     * }
     *
     * ```
     * @param row
     * @param columnDef
     */
    onCellClick?: (row:Row, columnDef:Column)=>boolean

    /**
     * array of object literals representing the raw un-subtotaled data
     */
    data:any[]

    /**
     * array of [ColumnDef](_models_columnlike_.columndef.html) which defines the data type, header title
     * and other metadata about each column in `data`
     */
    columnDefs:ColumnDef[]
    columnGroups?:ColumnGroupDef[]
    bodyHeight?:string
    bodyWidth?:string
    rowHeight?:string
}

/**
 * Interface that Declares the Valid State of GigaGrid
 * The grid's state consists of an `Tree` object that model the rows in a hierarchical structure (representing subtotals)
 *
 * `rasterizedRows` is a flattened version of `tree`. Each `Row` in `rasterizedRows` is converted into a `TableRow` component
 * at render time. (even though we represent subtotal-ed data as a tree in-memory, HTML tables must ultimately be rendered as a two-dimensional grid
 * and that is why `rasterizedRow` exists
 *
 * `displayStart`, `displayEnd` determines the range in `rasterizedRows` that is actually rendered as `tr` elements. This is the avoid needlessly rendering rows that will not be visible in the viewport
 *
 * `widthMeasures` contain state information on the width of each column and the table
 */
export interface GigaState {

    tree:Tree

    subtotalBys:SubtotalBy[]
    sortBys:SortBy[]
    filterBys: FilterBy[]

    /*
     the displayable view of the data in `tree`
     */
    rasterizedRows: Row[]
    displayStart: number
    displayEnd: number

    columnDefMask?: ColumnDef[]

    widthMeasures: WidthMeasures
}

/**
 * The root component of this React library. assembles raw data into `Row` objects which are then translated into their
 * virtual DOM representation
 *
 * The bulk of the table state is stored in `tree`, which contains subtotal and detail rows
 * Rows can be hidden if filtered out or sorted among other things, subtotal rows can be collapsed etc
 * mutations to the state of table from user initiated actions can be thought of as mutates on the `tree`
 *
 * **IMPORTANT** GigaGrid the component does not actually mutate its own state nor give its children the ability
 * to mutate its state. State mutation is managed entirely by the GigaStore flux Store. Events generated by the
 * children of this component are emitted to a central dispatcher and are dispatched to the GigaStore
 *
 * **Developer Warning** Please DO NOT pass a reference of this component to its children nor call setState() in the component
 **/

export class GigaGrid extends React.Component<GigaProps, GigaState> {

    private store:GigaStore;
    private dispatcher:Dispatcher<GigaAction>;
    private canvas:HTMLElement;
    private viewport:HTMLElement;

    static defaultProps:GigaProps = {
        initialSubtotalBys: [],
        initialSortBys: [],
        initialFilterBys: [],
        data: [],
        columnDefs: [],
        bodyHeight: "100%",
        rowHeight: "35px"
    };

    constructor(props:GigaProps) {
        super(props);
        this.dispatcher = new Dispatcher<GigaAction>();
        this.store = new GigaStore(this.dispatcher, props);
        this.state = this.store.getState();
        // do not call setState again, this is the only place! otherwise you are violating the principles of Flux
        // not that would be wrong but it would break the 1 way data flow and make keeping track of mutation difficult
        this.store.addListener(()=> {
            this.setState(this.store.getState());
        });
    }

    render() {

        var columns:Column[][];
        if (this.props.columnGroups)
            columns = ColumnFactory.createColumnsFromGroupDefinition(this.props.columnGroups, this.props.columnDefs, this.state);
        else
            columns = [ColumnFactory.createColumnsFromDefinition(this.props.columnDefs, this.state)];

        const bodyStyle = {
            // TODO we will need to give similar consideration to height as we did for width
            height: this.props.bodyHeight || "100%",
            width: this.state.widthMeasures.bodyWidth
        };

        return (
            <div className="giga-grid">
                <div className="giga-grid-table-header-wrapper" style={{width: this.state.widthMeasures.bodyWidth}}>
                    <table>
                        <TableHeader dispatcher={this.dispatcher} columns={columns}/>
                    </table>
                </div>
                <div ref={c=>this.viewport=c}
                     className="giga-grid-body-scroll-y"
                     onScroll={()=>this.handleScroll()}
                     style={bodyStyle}>
                    <table ref={c=>this.canvas=c}>
                        <TableBody dispatcher={this.dispatcher}
                                   rows={this.state.rasterizedRows}
                                   columns={columns[columns.length-1]}
                                   displayStart={this.state.displayStart}
                                   displayEnd={this.state.displayEnd}
                                   rowHeight={this.props.rowHeight}
                        />
                    </table>
                </div>
            </div>);
    }

    private handleScroll() {
        this.dispatchDisplayBoundChange();
    }

    private dispatchWidthChange() {
        // if no bodyWidth was provided through props and there are no explicit width set for columns, we need to dynamically the table's bodyWidth
        // after it has been mounted and the parent width is known
        if (this.props.bodyWidth || validateColumnWidthProperty(this.props.columnDefs))
            return;

        const parentWidth = ReactDOM.findDOMNode(this).parentElement.offsetWidth + "px";
        const action = {
            type: GigaActionType.TABLE_WIDTH_CHANGE,
            width: parentWidth
        };
        this.dispatcher.dispatch(action);

    }

    componentDidMount() {
        this.dispatchWidthChange();
        /*
         Trigger resize of table on window resize
         https://github.com/erfangc/GigaGrid/issues/20
         */
        if (typeof window !== "undefined")
            window.addEventListener('resize', this.dispatchWidthChange.bind(this));

        /*
         re-compute displayStart && displayEnd
         */
        this.dispatchDisplayBoundChange();
    }

    private dispatchDisplayBoundChange() {
        const $viewport = $(this.viewport);
        const $canvas = $(this.canvas);
        const action:ChangeRowDisplayBoundsAction = {
            type: GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS,
            canvas: $canvas,
            viewport: $viewport,
            rowHeight: this.props.rowHeight
        };
        this.dispatcher.dispatch(action);
    }

    componentWillUnmount() {
        /*
         * remove any lingering event listeners
         */
        if (typeof window !== "undefined")
            window.removeEventListener('resize', this.dispatchWidthChange);
    }

}
