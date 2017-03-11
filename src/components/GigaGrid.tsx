import * as React from "react";
import { ClassAttributes } from "react";
import { Column, FilterBy } from "../models/ColumnLike";
import { Row } from "../models/Row";
import { Tree } from "../static/TreeBuilder";
import { GigaStore, GigaAction, GigaActionType } from "../store/GigaStore";
import { Dispatcher } from "flux";
import { FrozenTableBody } from "./TableBody/FrozenTableBody";
import { ScrollableTableBody } from "./TableBody/ScrollableTableBody";
import { TableHeader } from "./TableHeader";
import { SettingsPopover } from "./toolbar/SettingsPopover";
import { InitializeAction } from "../store/handlers/InitializeReducer";
import { ChangeRowDisplayBoundsAction } from "../store/handlers/ChangeRowDisplayBoundsReducer";
import { ReduceStore } from "flux/utils";
import { ServerStore } from "../store/ServerStore";
import { GigaProps } from "./GigaProps";

export interface GridComponentProps<T> {
    dispatcher: Dispatcher<GigaAction>;
    // idk if this is a good idea - but sub components often need to refer to things like callbacks - really annoying to pass them at each level
    // making them optional so tests' don't complain as much
    gridProps?: GigaProps;
}

export interface AdditionalButton {
    name: string;
    customCallback: () => any;
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

    gridID?: number;
    /**
     *  the Tree stores structured data, it is the primary data structure and data source for GigaGrid
     */
    tree: Tree;
    /**
     * stores the current state of Columns 
     */
    columns: Column[];
    /**
     * stores the current state of Columns upon which data in the table is grouped
     */
    subtotalBys: Column[];
    sortBys: Column[];
    filterBys: FilterBy[];
    /**
     * a flattened view of tree
     */
    rasterizedRows: Row[];
    /**
     * the first row visible in viewport
     */
    displayStart: number;
    /**
     * the last row visible in viewport
     */
    displayEnd: number;
    showSettingsPopover: boolean;
    additionalUserButtons?: AdditionalButton[];

    /**
     * the HTML elements below reference the key native components that makes scrolling possible
     * they are populated via react's ref feature
     */
    leftHeader: HTMLDivElement;
    rightHeader: HTMLDivElement;
    leftBody: HTMLDivElement;
    rightBody: HTMLDivElement;
    canvas: HTMLDivElement;
    viewport: HTMLDivElement;
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

export class GigaGrid extends React.Component<GigaProps & ClassAttributes<GigaGrid>, GigaState> {

    private store: ReduceStore<GigaState, GigaAction>;
    private dispatcher: Dispatcher<GigaAction>;

    static defaultProps: GigaProps = {
        initialSubtotalBys: [],
        initialSortBys: [],
        initialFilterBys: [],
        data: [],
        columnDefs: [],
        rowHeight: "25px",
        collapseHeight: false,
        additionalUserButtons: []
    };

    private static createStore(props: GigaProps, dispatcher: Dispatcher<GigaAction>): ReduceStore<GigaState, GigaAction> {
        if (props.useServerStore) {
            return new ServerStore(dispatcher, props);
        } else {
            return new GigaStore(dispatcher, props);
        }
    }

    constructor(props: GigaProps) {
        super(props);
        this.dispatcher = new Dispatcher<GigaAction>();
        this.store = GigaGrid.createStore(props, this.dispatcher);
        this.state = this.store.getState();
        // do not call setState again, this is the only place! otherwise you are violating the principles of Flux
        // not that would be wrong but it would break the 1 way data flow and make keeping track of mutation difficult
        this.store.addListener(() => {
            this.setState(this.store.getState());
        });
    }

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
        if (state.showSettingsPopover) {
            return (
                <div>
                    <SettingsPopover
                        subtotalBys={state.subtotalBys}
                        columns={state.columns}
                        onSubmit={(action: GigaAction) => this.submitColumnConfigChange(action)}
                        onDismiss={() => this.toggleSettingsPopover()}
                        additionalUserButtons={state.additionalUserButtons}
                    />
                </div>);
        } else {
            return null;
        }
    }

    render() {

        let columns: Column[][];
        const state = this.store.getState();
        columns = [state.columns];

        const bodyStyle: any = {};

        /**
         * As noted in the collapseHeight property of the GigaProps interface, if collapseHeight is true, the table will
         * collapse to the height of the table itself it is smaller than the container
         */
        let { bodyHeight } = this.props;
        if (this.props.collapseHeight) {
            bodyStyle.maxHeight = bodyHeight;
        } else {
            bodyStyle.height = bodyHeight;
        }
        /**
         * We need to figure out what columns go in which sub table depending on how many static left headers there are
         */
        const allCols = columns[columns.length - 1];
        let leftCols, rightCols;
        // Static headers experience a latency issue in internet explorer.  Let's not enable it for now
        if (isNaN(this.props.staticLeftHeaders)) {
            leftCols = [];
            rightCols = allCols;
        } else if (allCols.length > this.props.staticLeftHeaders) {
            let { staticLeftHeaders } = this.props;
            leftCols = allCols.slice(0, staticLeftHeaders);
            rightCols = allCols.slice(staticLeftHeaders, allCols.length - staticLeftHeaders + 1);
        } else {
            throw "Please declare a staticLeftHeaders prop which is less than the number of columns in the table.";
        }
        let placeholderHeights = this.calculatePlaceholderHeight();

        let rows = state.rasterizedRows.slice(state.displayStart, state.displayEnd + 1);

        return (
            <div className={`giga-grid giga-grid-${this.state.gridID}`}>
                {this.renderSettingsPopover()}
                <div className="giga-grid-header-container">
                    <TableHeader
                        dispatcher={this.dispatcher}
                        columns={columns}
                        tableHeaderClass={this.props.tableHeaderClass}
                        staticLeftHeaders={this.props.staticLeftHeaders}
                        gridProps={this.props}
                        setRightHeader={(c) => state.rightHeader = c}
                    />
                </div>
                <div ref={c => state.viewport = c}
                    className="giga-grid-body-viewport"
                    style={bodyStyle}>
                    <div ref={(c) => state.canvas = c} style={{ height: placeholderHeights.upperPlaceholderHeight + "px" }} className="placeholder" />
                    {
                        leftCols.length === 0 ? null :
                            <div className="giga-grid-left-headers-container" ref={(c) => state.leftBody = c} style={{ height: bodyHeight }}>
                                <FrozenTableBody
                                    dispatcher={this.dispatcher}
                                    rows={rows}
                                    columns={leftCols}
                                    rowHeight={this.props.rowHeight}
                                    gridProps={this.props}
                                />
                            </div>
                    }
                    <div ref={(c) => state.rightBody = c} className="giga-grid-right-data-container" style={{ height: bodyHeight, maxWidth: "100%" }}>
                        <ScrollableTableBody
                            dispatcher={this.dispatcher}
                            rows={rows}
                            columns={rightCols}
                            rowHeight={this.props.rowHeight}
                            gridProps={this.props}
                        />
                    </div>
                    <div style={{ height: placeholderHeights.lowerPlaceholderHeight + "px" }}
                        className="placeholder"
                    />
                </div>
            </div>);
    }

    componentWillReceiveProps(nextProps: GigaProps) {
        const payload: InitializeAction = {
            type: GigaActionType.INITIALIZE,
            props: nextProps
        };
        this.dispatcher.dispatch(payload);
    }

    private calculatePlaceholderHeight() {
        let { rowHeight } = this.props;
        let { displayStart, displayEnd, rasterizedRows } = this.state;
        let rowHeightInt: number = parseInt(rowHeight);
        return {
            upperPlaceholderHeight: Math.max(displayStart * rowHeightInt, 0),
            lowerPlaceholderHeight: Math.max((rasterizedRows.length - displayEnd) * rowHeightInt, 0)
        };
    }

    /**
     * I don't love this, but it's only related to scrolling and has nothing to do with state/rendering of the component
     * so rather than making a re-render happen with a state change, we do this.  This is to fix this problem:
     * http://stackoverflow.com/questions/26326958/stopping-mousewheel-event-from-happening-twice-in-osx
     */
    private shouldScroll = true;

    // We need to define the exact function to use to bind event listeners to so we can remove them properly on unmount
    private handleVerticalScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.shouldScroll) {
            this.shouldScroll = false;
            this.dispatchDisplayBoundChange();
            this.shouldScroll = true;
        }
    }

    /**
     * A wheely important function.  You can't scroll normally in the left-headers area, but a user would expect the
     * table to scroll if he or she uses the mousewheel.  So we have to listen for this event.
     */
    private handleWheelScroll = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        let { viewport } = this.state;
        this.shouldScroll = false;
        // This covers all browsers, see https://www.sitepoint.com/html5-javascript-mouse-wheel/
        const amountToScroll: number = -Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * 53;
        const scrollTopAmount: number = viewport.scrollTop;
        viewport.scrollTop = scrollTopAmount + amountToScroll;
        this.dispatchDisplayBoundChange();
    }

    private handleHorizontalScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        let { rightBody, rightHeader } = this.state;
        const scrollLeftAmount = rightBody.scrollLeft;
        rightHeader.scrollLeft = scrollLeftAmount;
    }

    private dispatchDisplayBoundChange() {
        let {rowHeight, bodyHeight} = this.props;
        const action: ChangeRowDisplayBoundsAction = {
            type: GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS,
            rowHeight: rowHeight,
            bodyHeight: bodyHeight
        };
        this.dispatcher.dispatch(action);
    }

    reflowTable() {
        this.dispatchDisplayBoundChange();
    }

    componentDidMount() {
        /*
         * subscribe to listeners
         */
        let { viewport, rightBody } = this.state;
        viewport.addEventListener('scroll', this.handleVerticalScroll);
        viewport.addEventListener('mousewheel', this.handleWheelScroll);
        viewport.addEventListener('MozMousePixelScroll', this.handleWheelScroll);
        rightBody.addEventListener('scroll', this.handleHorizontalScroll);
    }

    componentWillUnmount() {
        /*
         * unsubscribe to listeners
         */
        let { viewport, rightBody } = this.state;
        viewport.removeEventListener('scroll', this.handleVerticalScroll);
        viewport.removeEventListener('mousewheel', this.handleWheelScroll);
        viewport.removeEventListener('MozMousePixelScroll', this.handleWheelScroll);
        rightBody.removeEventListener('scroll', this.handleHorizontalScroll);
    }

}

export function getHorizontalScrollbarThickness() {
    const el: any = document.createElement('div');
    el.style.visibility = 'hidden';
    el.style.overflow = 'scroll';
    document.body.appendChild(el);
    const h = el.offsetHeight - el.clientHeight;
    document.body.removeChild(el);
    return h;
}
