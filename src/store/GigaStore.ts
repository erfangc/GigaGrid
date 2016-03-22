///<reference path="../../typings/tsd.d.ts"/>

import * as _ from 'lodash';
import {GigaState,GigaProps} from "../components/GigaGrid";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree} from "../static/TreeBuilder";
import {TreeBuilder} from "../static/TreeBuilder";
import {SubtotalBy} from "../models/ColumnLike";
import {ReduceStore} from 'flux/utils';
import {Dispatcher} from 'flux';
import {SubtotalRow} from "../models/Row";
import {SortFactory} from "../static/SortFactory";
import {SortBy} from "../models/ColumnLike";
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
        super(dispatcher);
        this.props = props;
        dispatcher.dispatch({
            type: GigaActionType.INITIALIZE
        });
    }

    getInitialState():GigaState {
        return null;
    }

    /**
     * ES6 disallow using `this` before `super()`, however we need the props to derive the initial state
     * so we kind of hack around it ... the designers of the Flux paradigm never though I would use flux store to manage widget
     * state as oppose to application state?
     */
    initialize(action: InitializeAction):GigaState {

        const props = action.props ||  this.props;
        var tree = TreeBuilder.buildTree(
                            props.data,
                            this.appendSubtotalBysWithTitle(props.initialSubtotalBys),
                            this.props.initiallyExpandedSubtotalRows,
                            this.props.initiallySelectedSubtotalRows
        );
        SubtotalAggregator.aggregateTree(tree, props.columnDefs);

        if (props.initialSortBys)
            tree = SortFactory.sortTree(tree, props.initialSortBys);

        const rasterizedRows:Row[] = TreeRasterizer.rasterize(tree);

        return {
            rasterizedRows: rasterizedRows,
            displayStart: 0,
            displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
            subtotalBys: _.cloneDeep(props.initialSubtotalBys) || [],
            sortBys: _.cloneDeep(props.initialSortBys) || [],
            filterBys: _.cloneDeep(props.initialFilterBys) || [],
            tree: tree
        }
    }

    private appendSubtotalBysWithTitle(subtotalBys:SubtotalBy[]) {
        return (subtotalBys || []).map(sb => {
            const col = _.find(this.props.columnDefs, cd=>cd.colTag === sb.colTag);
            return {
                colTag: sb.colTag,
                title: col.title
            }
        });
    };

    reduce(state:GigaState,
           action:GigaAction):GigaState {

        var newState:GigaState;
        switch (action.type) {
            case GigaActionType.INITIALIZE:
                newState = this.initialize(action as InitializeAction);
                break;
            case GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS:
                newState = GigaStore.handleChangeRowDisplayBounds(state, action as ChangeRowDisplayBoundsAction);
                break;
            /*
             Subtotal Actions
             */
            case GigaActionType.NEW_SUBTOTAL:
                newState = this.handleSubtotal(state, action as NewSubtotalAction);
                break;
            case GigaActionType.CLEAR_SUBTOTAL:
                newState = this.handleClearSubtotal(state);
                break;
            /*
             Row Level Actions
             */
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = GigaStore.handleToggleCollapse(state, action as ToggleCollapseAction);
                break;
            case GigaActionType.COLLAPSE_ALL:
                newState = GigaStore.handleToggleCollapseAll(state);
                break;
            case GigaActionType.EXPAND_ALL:
                newState = GigaStore.handleToggleExpandAll(state);
                break;
            /*
             Sort Actions
             */
            case GigaActionType.ADD_SORT:
                newState = GigaStore.handleAddSort(state, action as AddSortAction);
                break;
            case GigaActionType.NEW_SORT:
                newState = GigaStore.handleNewSort(state, action as NewSortAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = GigaStore.handleClearSort(state, action as ClearSortAction);
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
                GigaActionType.COLLAPSE_ALL,
                GigaActionType.EXPAND_ALL
            ].indexOf(action.type) !== -1;
    }

    /*
     Selection Action Handlers
     */
    private handleRowSelect(state:GigaState, action:ToggleRowSelectAction):GigaState {

        if (typeof this.props.onRowClick === "function") {
            if (!this.props.onRowClick(action.row, state))
                return state;
            else {
                // de-select every other row unless enableMultiRowSelect is turned on
                if (!this.props.enableMultiRowSelect) {
                    // call said function
                    recursivelyDeselect(state.tree.getRoot());
                }
                action.row.toggleSelect();
                return _.clone(state);
            }
        } else
            return state;

    }

    private handleCellSelect(state:GigaState, action:ToggleCellSelectAction):GigaState {

        if (typeof this.props.onCellClick === "function") {
            if (!this.props.onCellClick(action.row, action.column))
                return state; // will not emit state mutation event
            else
                return _.clone(state); // will emit state mutation event
        } else
            return state;

    }

    private static handleChangeRowDisplayBounds(state:GigaState, action:ChangeRowDisplayBoundsAction) {
        const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(action.rowHeight, action.viewport, action.canvas);
        const newState = _.clone(state);
        newState.displayStart = displayStart;
        newState.displayEnd = displayEnd;
        return newState;
    }

    /*
     Subtotal Action Handlers
     */
    private static handleToggleExpandAll(state:GigaState):GigaState {
        TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot(), false);
        return _.clone(state);
    }

    private static handleToggleCollapseAll(state:GigaState):GigaState {
        TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot());
        return _.clone(state);
    }

    private static handleToggleCollapse(state:GigaState, action:ToggleCollapseAction):GigaState {
        const row = action.subtotalRow;
        row.toggleCollapse();
        return _.clone(state);
    }

    private handleSubtotal(state:GigaState,
                           action:NewSubtotalAction):GigaState {
        state.subtotalBys.push(action.subtotalBy);
        const newTree = TreeBuilder.buildTree(this.props.data, state.subtotalBys);
        TreeBuilder.recursivelyToggleChildrenCollapse(newTree.getRoot(), false);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        const newState = _.clone(state);
        newState.tree = newTree;
        return newState;
    }

    private handleClearSubtotal(state:GigaState):GigaState {
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
    private static handleAddSort(state:GigaState, action:AddSortAction):GigaState {
        const sortBy = action.sortBy;
        state.sortBys.push(sortBy);
        const newTree:Tree = SortFactory.sortTree(state.tree, state.sortBys);
        const newState = _.clone(state);
        newState.tree = newTree;
        return newState;
    }

    private static handleNewSort(state:GigaState, action:NewSortAction):GigaState {
        const newTree:Tree = SortFactory.sortTree(state.tree, action.sortBys);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.sortBys = action.sortBys;
        return newState;
    }

    private static handleClearSort(state:GigaState, action:ClearSortAction):GigaState {
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
    INITIALIZE,
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
    COLLAPSE_ALL,
    EXPAND_ALL,
    TOGGLE_ROW_SELECT,
    TOGGLE_CELL_SELECT,
    TABLE_WIDTH_CHANGE,
    CHANGE_ROW_DISPLAY_BOUNDS
}

export interface GigaAction {
    type:GigaActionType
}

export interface InitializeAction extends GigaAction {
    props?: GigaProps
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow: SubtotalRow
}

export interface NewSubtotalAction extends GigaAction {
    subtotalBy:SubtotalBy
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
    column: Column
}

// define a function
function recursivelyDeselect(row: Row) {
    row.toggleSelect(false);
    if (!row.isDetail()) {
        const subtotalRow = (row as SubtotalRow);
        const children :Row[] = subtotalRow.getChildren().length === 0 ? subtotalRow.detailRows: subtotalRow.getChildren();
        children.forEach(child=>recursivelyDeselect(child));
    }
}
