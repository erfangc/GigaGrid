import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import {ColumnDef, Column, FilterBy, ColumnFactory, ColumnGroupDef} from "../models/ColumnLike";
import {Row} from "../models/Row";
import {Tree} from "../static/TreeBuilder";
import {GigaStore, GigaAction, GigaActionType} from "../store/GigaStore";
import {Dispatcher} from "flux";
import {FrozenTableBody} from "./TableBody/FrozenTableBody";
import {ScrollableTableBody} from "./TableBody/ScrollableTableBody";
import {TableHeader} from "./TableHeader";
import {SettingsPopover} from "./toolbar/SettingsPopover";
import {InitializeAction} from "../store/reducers/InitializeReducer";
import {ChangeRowDisplayBoundsAction} from "../store/reducers/ChangeRowDisplayBoundsReducer";
import {ReduceStore} from "flux/utils";
import {ServerStore, ServerSubtotalRow} from "../store/ServerStore";
import $ = require('jquery');
import ReactElement = __React.ReactElement;

/**
 * Interface that describe the shape of the `Props` that `GigaGrid` accepts from the user
 * the bare minimum are: `data` and `columnDefs`
 * This is the Public API for GigaGrid by definition
 */
export interface GigaProps extends React.Props<GigaGrid> {

    /**
     * Initial set of SubtotalBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified subtotals
     */
    initialSubtotalBys?: ColumnDef[]

    /**
     * Initial set of SortBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified sorting order
     */
    initialSortBys?: Column[]

    initialFilterBys?: FilterBy[]

    /**
     * Callback that fires when a row is clicked, return `false` in the passed callback function to suppress
     * default behavior (highlights the row)
     * @param row the `Row` object associated with the row the user clicked on
     */
    onRowClick?: (row: Row, state: GigaState)=>boolean
    enableMultiRowSelect?: boolean

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
    onCellClick?: (row: Row, columnDef: Column)=>boolean

    /**
     * array of object literals representing the raw un-subtotaled data
     */
    data: any[]

    /**
     * array of [ColumnDef](_models_columnlike_.columndef.html) which defines the data type, header title
     * and other metadata about each column in `data`
     */
    columnDefs: ColumnDef[]
    columnGroups?: ColumnGroupDef[]
    bodyHeight?: string
    rowHeight?: string

    /**
     * If the height of the table itself is less than the container as defined in bodyHeight, the table's height will
     * be the size of the table itself
     */
    collapseHeight?: boolean

    /**
     * EXPERIMENTAL - these props allow us to expand / select SubtotalRow on construction of the grid component
     */
    /**
     * create a ServerStore instead of GigaStore, this will drastically change the grid works
     * expand / collapse async action creators must also be provided
     */
    useServerStore?: boolean
    // required if useServerStore = true, otherwise clicking on "expand will have no effect"
    // this callback is responsible for firing actions that will inform the store more data has been received
    fetchRowsActionCreator?: (row: Row, dispatch: Dispatcher<GigaAction>) => any
    initialData?: ServerSubtotalRow[]

    /**
     * sector paths to expand by default
     */
    initiallyExpandedSubtotalRows?: string[][]
    /**
     * sector paths to mark as "selected"
     */
    initiallySelectedSubtotalRows?: string[][]
    disableConfiguration?: boolean
    /**
     * custom classes
     */
    tableHeaderClass?: string
    expandTable?: boolean
    staticLeftHeaders?: number
    additionalUserButtons?: AdditionalButton[]

}

export interface GridComponentProps<T> extends React.Props<T> {
    dispatcher: Dispatcher<GigaAction>;
    // idk if this is a good idea - but sub components often need to refer to things like callbacks - really annoying to pass them at each level
    // making them optional so tests' don't complain as much
    gridProps?: GigaProps
}

export interface AdditionalButton {
    name: string
    customCallback: ()=>any
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

    gridID?: number
    tree: Tree
    columns: Column[]
    subtotalBys: Column[]
    sortBys: Column[]
    filterBys: FilterBy[]
    /*
     the displayable view of the data in `tree`
     */
    rasterizedRows: Row[]
    displayStart: number
    displayEnd: number
    showSettingsPopover: boolean
    additionalUserButtons?: AdditionalButton[]
    expandTable?: boolean

    canvas: HTMLElement;
    viewport: HTMLElement;
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

    private store: ReduceStore<GigaState>;
    private dispatcher: Dispatcher<GigaAction>;

    static defaultProps: GigaProps = {
        initialSubtotalBys: [],
        initialSortBys: [],
        initialFilterBys: [],
        data: [],
        columnDefs: [],
        bodyHeight: "500px",
        rowHeight: "25px",
        collapseHeight: false,
        expandTable: false,
        additionalUserButtons: []
    };

    private static createStore(props: GigaProps, dispatcher: Dispatcher<GigaAction>): ReduceStore<GigaState> {
        if (props.useServerStore)
            return new ServerStore(dispatcher, props);
        else
            return new GigaStore(dispatcher, props);
    }

    constructor(props: GigaProps) {
        super(props);
        this.dispatcher = new Dispatcher<GigaAction>();
        this.store = GigaGrid.createStore(props, this.dispatcher);
        this.state = this.store.getState();
        // do not call setState again, this is the only place! otherwise you are violating the principles of Flux
        // not that would be wrong but it would break the 1 way data flow and make keeping track of mutation difficult
        this.store.addListener(()=> {
            this.setState(this.store.getState());
        });
    }

    refs: {
        [key: string]: (Element);
        stepInput: (HTMLInputElement);
    };

    submitColumnConfigChange(action: GigaAction) {
        this.dispatcher.dispatch(action);
    }

    toggleSettingsPopover() {
        this.dispatcher.dispatch({
            type: GigaActionType.TOGGLE_SETTINGS_POPOVER
        });
    }

    renderSettingsPopover() {
        const state = this.store.getState();
        if (state.showSettingsPopover)
            return (
                <div>
                    <SettingsPopover
                        subtotalBys={state.subtotalBys}
                        columns={state.columns}
                        onSubmit={(action:GigaAction) => this.submitColumnConfigChange(action)}
                        onDismiss={()=>this.toggleSettingsPopover()}
                        additionalUserButtons={state.additionalUserButtons}
                    />
                </div>);
        else
            return null;
    }

    render() {

        var columns: Column[][];
        const state = this.store.getState();
        if (this.props.columnGroups)
            columns = ColumnFactory.createColumnsFromGroupDefinition(this.props.columnGroups, state);
        else
            columns = [state.columns];

        var bodyStyle: any = {};

        /**
         * As noted in the collapseHeight property of the GigaProps interface, if collapseHeight is true, the table will
         * collapse to the height of the table itself it is smaller than the container
         */
        if (this.props.collapseHeight)
            bodyStyle.maxHeight = this.props.bodyHeight;
        else
            bodyStyle.height = this.props.bodyHeight;


        /**
         * We need to figure out what columns go in which sub table depending on how many static left headers there are
         */
        const allCols = columns[columns.length - 1];
        let leftCols, rightCols;
        // Static headers experience a latency issue in internet explorer.  Let's not enable it for now
        if (isNaN(this.props.staticLeftHeaders) || isInternetExplorer()) {
            leftCols = [];
            rightCols = allCols;
        }
        else if (allCols.length > this.props.staticLeftHeaders) {
            leftCols = _.take(allCols, this.props.staticLeftHeaders);
            rightCols = _.takeRight(allCols, allCols.length - this.props.staticLeftHeaders);
        }
        else
            throw "Please declare a staticLeftHeaders prop which is less than the number of columns in the table.";

        return (
            <div className={`giga-grid giga-grid-${this.state.gridID}`}>
                {this.renderSettingsPopover()}
                <div className="giga-grid-header-container">
                    <TableHeader dispatcher={this.dispatcher}
                                 columns={columns}
                                 tableHeaderClass={this.props.tableHeaderClass}
                                 staticLeftHeaders={this.props.staticLeftHeaders}
                                 gridProps={this.props}/>
                </div>
                <div ref={c=>state.viewport=c}
                     onScroll={()=>this.dispatchDisplayBoundChange()}
                     className="giga-grid-body-viewport"
                     style={bodyStyle}>
                    {
                        leftCols.length == 0 ? "" :
                            <div className="giga-grid-left-headers-container">
                                <div className="giga-grid-body-canvas">
                                    <FrozenTableBody dispatcher={this.dispatcher}
                                                     rows={state.rasterizedRows}
                                                     columns={leftCols}
                                                     displayStart={state.displayStart}
                                                     displayEnd={state.displayEnd}
                                                     rowHeight={this.props.rowHeight}
                                                     gridProps={this.props}
                                    />
                                </div>
                            </div>
                    }
                    <div className="giga-grid-right-data-container">
                        <div ref={c=>state.canvas=c} className="giga-grid-body-canvas">
                            <ScrollableTableBody dispatcher={this.dispatcher}
                                                 rows={state.rasterizedRows}
                                                 columns={rightCols}
                                                 displayStart={state.displayStart}
                                                 displayEnd={state.displayEnd}
                                                 rowHeight={this.props.rowHeight}
                                                 gridProps={this.props}
                            />
                        </div>
                    </div>
                </div>
            </div>);
    }

    componentWillReceiveProps(nextProps: GigaProps) {
        var payload: InitializeAction = {
            type: GigaActionType.INITIALIZE,
            props: nextProps
        };
        this.dispatcher.dispatch(payload);
        this.expandTable();
    }

    /**
     * on component update, we use jquery to align table headers
     * this is the "give up" solution, implemented in 0.1.7
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.state.rasterizedRows.length !== prevState.rasterizedRows.length ||
            this.state.displayStart !== prevState.displayStart ||
            this.state.filterBys !== prevState.filterBys ||
            this.state.sortBys !== prevState.sortBys ||
            this.state.subtotalBys !== prevState.subtotalBys)
            this.synchTableHeaderWidthToFirstRow();
    }

    /**
     * yes this is still a thing!
     */
    synchTableHeaderWidthToFirstRow() {
        const node: Element = ReactDOM.findDOMNode<Element>(this);

        /**
         * To improve performance, we use our own dynamic stylesheet for giga-grid.  jQuery is slow, so by adding
         * a class to each cell, labeled with each column number, we are able to simply change the dimensions of a cell
         * dynamically by changing the styling directly in the stylesheet, instead of at the element level.
         */
        var widths = [];

        // Gets with of .content in a cell, or 80, whichever is greater
        function getWidthForDataCell(elem): number {
            const leftPadding: number = +($(elem).css("padding-left").replace(/[^\d.-]/g, ''));
            const rightPadding: number = +($(elem).css("padding-right").replace(/[^\d.-]/g, ''));

            // 80 px is the min width of cell
            return Math.max($(elem).find(".content").innerWidth() + leftPadding + rightPadding, 80);
        }

        // This function alligns header cells and their underlying data cells
        function allignColumns($headerContainers, $rows) {
            _.forEach($headerContainers, (header, index: number) => {
                const headerWidth: number = getWidthForDataCell(header);

                // Get all data cells underlying this column
                const $dataElems = $rows.find(`.content-container:nth-of-type(${index + 1})`);

                // Get all widths of underlying data cells, and find the largest
                const dataWidths: number[] = _.map($dataElems, (elem): number => getWidthForDataCell(elem));
                const columnWidth: number = Math.max.apply(null, dataWidths.concat(headerWidth)) + 10; // Adding 10 for padding
                widths.push(columnWidth);
            });
        }

        // Get jQuery objects for four "quadrant" containers
        const $leftHeaderContainers = $(node).find(".left-static-headers .table-header");
        const $rightHeaderContainers = $(node).find(".right-scrolling-headers .table-header:not(.blank-header-cell)");
        const $leftHeaderRows = $(node).find(".giga-grid-left-headers-container .giga-grid-row");
        const $dataRows = $(node).find(".giga-grid-right-data-container .giga-grid-row");

        // Set max height of row containers so scroll bars show up
        $(node).find(".giga-grid-left-headers-container").css("max-height", $(node).find(".giga-grid-body-viewport").innerHeight());
        $(node).find(".giga-grid-right-data-container").css("max-height", $(node).find(".giga-grid-body-viewport").innerHeight());

        allignColumns($leftHeaderContainers, $leftHeaderRows);
        allignColumns($rightHeaderContainers, $dataRows);

        const gigaGridWidth: number = $(node).innerWidth();

        const sumOfHeaderWidths: number = widths.reduce((sum, memo) => sum + memo, 0);

        // If the table doesn't fit the width of the container, make them fit it
        if (gigaGridWidth * .98 > sumOfHeaderWidths) {
            const $allHeaderContainers = $(node).find(".table-header:not(.blank-header-cell)");
            const $blankCell = $(node).find(".table-header.blank-header-cell");
            const expandAllHeadersBy: number = (gigaGridWidth - sumOfHeaderWidths - $blankCell.innerWidth()) / $allHeaderContainers.length;
            widths = widths.map((w) => w + expandAllHeadersBy);
        }

        const oldSheetNode = $(`head > style#giga-grid-style-${this.state.gridID}`);
        const sheet = (_.findWhere<{}, StyleSheet>(document.styleSheets, {ownerNode: oldSheetNode}) || this.createGigaGridStyleSheet()) as CSSStyleSheet;

        for (var i = 0; i < $leftHeaderContainers.length + $rightHeaderContainers.length; ++i) {
            const selectorText = `.giga-grid-${this.state.gridID} .giga-grid-column-${i}`;
            const cssText = `width: ${widths[i]}px !important;`;
            const oldRule: CSSPageRule = _.findWhere<{},CSSRule>(sheet.cssRules, {selectorText}) as CSSPageRule;
            if (oldRule)
                sheet.deleteRule((sheet.rules as any).indexOf(oldRule));

            if (!oldRule || oldRule.style.cssText !== cssText)
                sheet.insertRule(`${selectorText} { ${cssText} }`, 0);
        }


        var $leftHeadersDataContainer = $(node).find(".giga-grid-left-headers-container");
        var $bodyViewport = $(node).find(".giga-grid-body-viewport");
        //setting max-width of sticky data and headers as 75% of the body-viewport width
        $leftHeadersDataContainer.css("max-width", 0.75 * $bodyViewport.innerWidth());
        $(node).find(".left-static-headers").css("max-width", 0.75 * $bodyViewport.innerWidth());

        // After we're done with all this, make sure the data container and respective headers has max-width matching the container minus the left-headers
        $(node).find(".giga-grid-right-data-container").css("max-width", $(node).innerWidth() - $leftHeadersDataContainer.innerWidth());
        $(node).find(".right-scrolling-headers").css("max-width", $(node).innerWidth() - $leftHeadersDataContainer.innerWidth());

    }

    /**
     * Creates a new stylesheet for this grid
     * @returns {CSSStyleSheet}
     */
    private createGigaGridStyleSheet(): StyleSheet {
        var style = document.createElement("style");
        style.setAttribute("id", `giga-grid-style-${this.state.gridID}`);
        document.head.appendChild(style);
        return style.sheet;
    }

    scrollHandler(e) {
        e.preventDefault();
        const node: Element = ReactDOM.findDOMNode<Element>(this);
        const dataContainer = $(node).parent().find('.giga-grid-right-data-container');

        const scrollLeftAmount: number = dataContainer.scrollLeft();
        const scrollTopAmount: number = dataContainer.scrollTop();

        $(node).parent().find('.giga-grid-left-headers-container').scrollTop(scrollTopAmount);
        $(node).parent().parent().find('.right-scrolling-headers').scrollTop(scrollTopAmount);
        $(node).parent().parent().find('.right-scrolling-headers').scrollLeft(scrollLeftAmount);
    }

    /**
     * A wheely important function.  You can't scroll normally in the left-headers area, but a user would expect the
     * table to scroll if he or she uses the mousewheel.  So we have to listen for this event.
     */
    wheelScrollHandler(e) {
        e.preventDefault();
        // This covers all browsers, see https://www.sitepoint.com/html5-javascript-mouse-wheel/
        const amountToScroll: number = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * 53;
        const node: Element = ReactDOM.findDOMNode<Element>(this);
        const dataContainer = $(node).parent().find('.giga-grid-right-data-container');
        const scrollTopAmount: number = dataContainer.scrollTop();

        $(node).parent().find('.giga-grid-left-headers-container').scrollTop(scrollTopAmount + amountToScroll);
        $(node).parent().parent().find('.giga-grid-right-data-container').scrollTop(scrollTopAmount + amountToScroll);
    }

    componentDidMount() {
        /*
         * subscribe to window event listeners
         */
        if (typeof window !== "undefined") {
            window.addEventListener('resize', this.synchTableHeaderWidthToFirstRow.bind(this));

            // Bind scroll listener to move headers when data container is scrolled
            const node: Element = ReactDOM.findDOMNode<Element>(this);
            const leftPanel: Element = $(node).find('.giga-grid-left-headers-container').get(0);
            const rightPanel: Element = $(node).find('.giga-grid-right-data-container').get(0);
            rightPanel && rightPanel.addEventListener('scroll', this.scrollHandler);
            rightPanel && rightPanel.addEventListener('mousewheel', this.wheelScrollHandler);
            leftPanel && leftPanel.addEventListener('mousewheel', this.wheelScrollHandler);
            leftPanel && leftPanel.addEventListener('MozMousePixelScroll', this.wheelScrollHandler);
        }

        /*
         re-compute displayStart && displayEnd
         */
        this.dispatchDisplayBoundChange();
        this.synchTableHeaderWidthToFirstRow();
        this.expandTable();
    }

    componentWillUnmount() {
        /*
         * unsubscribe to window event listeners
         */
        if (typeof window !== "undefined") {
            window.removeEventListener('resize', this.synchTableHeaderWidthToFirstRow);

            // Unbind the scroll listener
            const node: Element = ReactDOM.findDOMNode<Element>(this);
            $(node).find('.giga-grid-right-data-container').unbind('scroll', this.scrollHandler);
            const leftPanel: Element = $(node).find('.giga-grid-left-headers-container').get(0);
            const rightPanel: Element = $(node).find('.giga-grid-right-data-container').get(0);
            rightPanel && rightPanel.addEventListener('scroll', this.scrollHandler);
            leftPanel && leftPanel.removeEventListener('mousewheel', this.wheelScrollHandler);
            leftPanel && leftPanel.removeEventListener('MozMousePixelScroll', this.wheelScrollHandler);
        }
    }

    private dispatchDisplayBoundChange() {
        const state = this.store.getState();
        const $viewport = $(state.viewport);
        const $canvas = $(state.canvas);
        const action: ChangeRowDisplayBoundsAction = {
            type: GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS,
            canvas: $canvas,
            viewport: $viewport,
            rowHeight: this.props.rowHeight
        };
        this.dispatcher.dispatch(action);
    }

    private expandTable() {
        if (this.props.expandTable) {
            this.dispatcher.dispatch({
                type: GigaActionType.EXPAND_ALL
            });
        }
    }

}

/**
 * uber hax to get scrollbar width
 * see stackoverflow reference: http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
 * @returns {number}
 */
export function getScrollBarWidth() {

    var scrollBarWidth = null;

    function computeScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild(outer);
        return (w1 - w2);
    }

    if (scrollBarWidth === null)
        scrollBarWidth = computeScrollBarWidth();

    return scrollBarWidth + 5;

}

/**
 * Find out if a user is using internet explorer
 * @returns {boolean}
 */
export function isInternetExplorer() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
}