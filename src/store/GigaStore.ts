///<reference path="../../typings/tsd.d.ts"/>

import * as Flux from 'flux';
import * as FluxUtils from 'flux/utils';
import * as _ from 'lodash';
import {GigaState,GigaProps} from "../components/GigaGrid";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree} from "../static/TreeBuilder";
import {TreeBuilder} from "../static/TreeBuilder";
import {SubtotalBy} from "../models/ColumnLike";
import ReduceStore = FluxUtils.ReduceStore;
import Dispatcher = Flux.Dispatcher;
import {SubtotalRow} from "../models/Row";
import {SortFactory} from "../static/SortFactory";
import {SortBy} from "../models/ColumnLike";
import {WidthMeasureCalculator} from "../static/WidthMeasureCalculator";
import {Row} from "../models/Row";
import {Column} from "../models/ColumnLike";
import {TreeRasterizer} from "../static/TreeRasterizer";
import {ScrollCalculator} from "../static/ScrollCalculator";

/*
 define the # of rows necessary to trigger progressive rendering
 below which all row display bound change events are ignored
 */
export const PROGRESSIVE_RENDERING_THRESHOLD:number = 100;

/**
 * state store for the table, relevant states and stored here. the only way to mutate these states are by sending GigaAction(s) through the Dispatcher given to the store at construction
 * there are no way to direct set the state. The GigaGrid controller-view React Component draws its state updates from this store. Updates are automatically triggered for every state mutation through
 * a callback. (i.e. all GigaGrid instances must call store.addListener(()=>this.setState(this.store.getState())) during construction)
 */
export class GigaStore extends ReduceStore<GigaState> {

    private props:GigaProps;

    constructor(dispatcher:Dispatcher<GigaAction>, props:GigaProps) {
        this.props = props;
        super(dispatcher);
    }

    getInitialState():GigaState {
        var tree = TreeBuilder.buildTree(this.props.data, this.props.initialSubtotalBys);
        SubtotalAggregator.aggregateTree(tree, this.props.columnDefs);

        if (this.props.initialSortBys)
            tree = SortFactory.sortTree(tree, this.props.initialSortBys);

        const rasterizedRows:Row[] = TreeRasterizer.rasterize(tree);

        return {
            rasterizedRows: rasterizedRows,
            displayStart: 0,
            displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
            widthMeasures: WidthMeasureCalculator.computeWidthMeasures(this.props.bodyWidth, this.props.columnDefs),
            subtotalBys: this.props.initialSubtotalBys || [],
            sortBys: this.props.initialSortBys || [],
            filterBys: this.props.initialFilterBys || [],
            tree: tree
        }
    }

    // TODO we should have a way to handle componentWillReceiveProps

    reduce(state:GigaState,
           action:GigaAction):GigaState {
        var newState:GigaState;
        switch (action.type) {
            /*
             * Width Change Action
             */
            case GigaActionType.TABLE_WIDTH_CHANGE:
                newState = this.handleWidthChange(state, action as TableWidthChangeAction);
                break;
            case GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS:
                newState = this.handleChangeRowDisplayBounds(state, action as ChangeRowDisplayBoundsAction);
                break;
            /*
             Subtotal Actions
             */
            case GigaActionType.NEW_SUBTOTAL:
                newState = this.handleSubtotal(state, action as NewSubtotalAction);
                break;
            case GigaActionType.CLEAR_SUBTOTAL:
                newState = this.handleClearSubtotal(state, action as ClearSubtotalAction);
                break;
            /*
             Row Level Actions
             */
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = this.handleToggleCollapse(state, action as ToggleCollapseAction);
                break;
            /*
             Sort Actions
             */
            case GigaActionType.ADD_SORT:
                newState = this.handleAddSort(state, action as AddSortAction);
                break;
            case GigaActionType.NEW_SORT:
                newState = this.handleNewSort(state, action as NewSortAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = this.handleClearSort(state, action as ClearSortAction);
                break;
            /*
             Selection Actions
             */
            case GigaActionType.TOGGLE_ROW_SELECT:
                newState = this.handleRowSelect(state, action as ToggleRowSelectAction);
                break;
            case GigaActionType.TOGGLE_CELL_SELECT:
                newState = this.handleCellSelect(state, action as ToggleCellSelectAction);
                break;
            default:
                newState = state;
        }
        /*
         determine if an action should trigger rasterization
         todo I wonder if we need to re-compute display bounds after rasterization if so, viewport and canvas must become states so we can access them here
         */
        if (GigaStore.shouldTriggerRasterization(action))
            newState.rasterizedRows = TreeRasterizer.rasterize(newState.tree);

        return newState;
    }

    private static shouldTriggerRasterization(action:GigaAction) {
        return [
                GigaActionType.ADD_FILTER,
                GigaActionType.ADD_SORT,
                GigaActionType.ADD_SUBTOTAL,
                GigaActionType.CLEAR_FILTER,
                GigaActionType.CLEAR_SORT,
                GigaActionType.CLEAR_SUBTOTAL,
                GigaActionType.NEW_FILTER,
                GigaActionType.NEW_SORT,
                GigaActionType.NEW_SUBTOTAL,
                GigaActionType.TOGGLE_ROW_COLLAPSE,
            ].indexOf(action.type) !== -1;
    }

    /*
     Selection Action Handlers
     */
    private handleRowSelect(state:GigaState, action:ToggleRowSelectAction):GigaState {

        if (typeof this.props.onRowClick === "function") {
            if (!this.props.onRowClick(action.row))
                return state;
            else {
                action.row.toggleSelect();
                return _.clone(state);
            }
        } else
            return state;

    }

    private handleCellSelect(state:GigaState, action:ToggleCellSelectAction):GigaState {

        if (typeof this.props.onCellClick === "function") {
            if (!this.props.onCellClick(action.row, action.tableColumnDef))
                return state; // will not emit state mutation event
            else
                return _.clone(state); // will emit state mutation event
        } else
            return state;

    }

    private handleWidthChange(state:GigaState, action:TableWidthChangeAction):GigaState {
        const widthMeasures = WidthMeasureCalculator.computeWidthMeasures(action.width, this.props.columnDefs);
        const newState = _.clone(state);
        newState.widthMeasures = widthMeasures;
        return newState;
    }

    private handleChangeRowDisplayBounds(state:GigaState, action:ChangeRowDisplayBoundsAction) {
        const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(action.rowHeight, action.viewport, action.canvas);
        const newState = _.clone(state);
        newState.displayStart = displayStart;
        newState.displayEnd = displayEnd;
        return newState;
    }

    /*
     Subtotal Action Handlers
     */

    private handleToggleCollapse(state:GigaState, action:ToggleCollapseAction):GigaState {
        const row = action.subtotalRow;
        row.toggleCollapse();
        return _.clone(state);
    }

    private handleSubtotal(state:GigaState,
                           action:NewSubtotalAction):GigaState {
        const newTree = TreeBuilder.buildTree(this.props.data, action.subtotalBys);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.subtotalBys = action.subtotalBys;
        return newState;
    }

    private handleClearSubtotal(state:GigaState,
                                action:ClearSubtotalAction):GigaState {
        const newTree = TreeBuilder.buildTree(this.props.data, []);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.subtotalBys = [];
        return newState;
    }

    /*
     TODO test these sort handlers
     Sort Action Handlers
     */
    private handleAddSort(state:GigaState, action:AddSortAction):GigaState {
        const sortBy = action.sortBy;
        state.sortBys.push(sortBy);
        const newTree:Tree = SortFactory.sortTree(state.tree, state.sortBys);
        const newState = _.clone(state);
        newState.tree = newTree;
        return newState;
    }

    private handleNewSort(state:GigaState, action:NewSortAction):GigaState {
        const newTree:Tree = SortFactory.sortTree(state.tree, action.sortBys);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.sortBys = action.sortBys;
        return newState;
    }

    private handleClearSort(state:GigaState, action:ClearSortAction):GigaState {
        const newTree:Tree = SortFactory.sortTree(state.tree, []);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.sortBys = [];
        return newState;
    }

}

/*
 Public Actions API
 */

export enum GigaActionType {
    NEW_SUBTOTAL,
    ADD_SUBTOTAL,
    CLEAR_SUBTOTAL,
    NEW_SORT,
    ADD_SORT,
    CLEAR_SORT,
    NEW_FILTER,
    ADD_FILTER,
    CLEAR_FILTER,
    TOGGLE_ROW_COLLAPSE,
    TOGGLE_ROW_SELECT,
    TOGGLE_CELL_SELECT,
    TABLE_WIDTH_CHANGE,
    CHANGE_ROW_DISPLAY_BOUNDS
}

export interface GigaAction {
    type:GigaActionType
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow: SubtotalRow
}

export interface NewSubtotalAction extends GigaAction {
    subtotalBys:SubtotalBy[]
}

export interface ClearSubtotalAction extends GigaAction {

}

export interface ChangeRowDisplayBoundsAction extends GigaAction {
    viewport: JQuery
    canvas: JQuery
    rowHeight: string
}

export interface ClearSortAction extends GigaAction {

}

export interface AddSortAction extends GigaAction {
    sortBy: SortBy
}

export interface NewSortAction extends GigaAction {
    sortBys:SortBy[]
}

export interface TableWidthChangeAction extends GigaAction {
    width:string
}

export interface ToggleRowSelectAction extends GigaAction {
    row:Row
}

export interface ToggleCellSelectAction extends GigaAction {
    row:Row
    tableColumnDef: Column
}