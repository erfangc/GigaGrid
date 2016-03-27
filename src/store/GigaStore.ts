///<reference path="../../typings/tsd.d.ts"/>

import * as _ from "lodash";
import {GigaState, GigaProps} from "../components/GigaGrid";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree, TreeBuilder} from "../static/TreeBuilder";
import {ReduceStore} from "flux/utils";
import {Dispatcher} from "flux";
import {SubtotalRow, Row} from "../models/Row";
import {SortFactory} from "../static/SortFactory";
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
    initialize(action:InitializeAction):GigaState {

        const {data, columnDefs, columnGroups, initialSubtotalBys, initialSortBys, initialFilterBys} = (action.props || this.props);

        /**
         * turn ColumnDefs into "Columns" which are decorated with behaviors
         */
        const columns = columnDefs.map(columnDef=> {
            return _.assign<{},Column>({}, columnDef, {});
        });

        /**
         * create subtotalBys from columns (any properties passed in via initialSubtotalBys will override the same property on the corresponding Column object
         */
        const subtotalBys:Column[] = (initialSubtotalBys || []).map(subtotalBy => {
            const column:Column = _.find(columns, column => column.colTag === subtotalBy.colTag);
            return _.assign<{}, Column>({}, column, subtotalBy);
        });
        const filteredColumns = _.filter(columns, column => subtotalBys.map(subtotalBy => subtotalBy.colTag).indexOf(column.colTag) === -1);

        /**
         * create sortBys from columns (any properties passed via initialSortBys will override the same property in the corresponding Column object
         */
        const sortBys = (initialSortBys || []).map(sortBy=> {
            const column = _.find(columns, column => column.colTag === sortBy.colTag);
            return _.assign<{},Column>({}, column, sortBy);
        });

        var tree = TreeBuilder.buildTree(
            data,
            subtotalBys,
            this.props.initiallyExpandedSubtotalRows,
            this.props.initiallySelectedSubtotalRows
        );
        SubtotalAggregator.aggregateTree(tree, columns);

        if (sortBys)
            tree = SortFactory.sortTree(tree, sortBys, columns[0]);

        const rasterizedRows:Row[] = TreeRasterizer.rasterize(tree);

        return {
            rasterizedRows: rasterizedRows,
            displayStart: 0,
            columns: columnGroups ? columns : filteredColumns,
            displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
            subtotalBys: subtotalBys,
            sortBys: sortBys,
            filterBys: _.cloneDeep(initialFilterBys) || [],
            tree: tree
        }

    }

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
            case GigaActionType.COLUMNS_UPDATE:
                newState = this.handleColumnUpdate(state, action as ColumnUpdateAction);
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
            case GigaActionType.NEW_SORT:
                newState = GigaStore.handleSortUpdate(state, action as SortUpdateAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = GigaStore.handleClearSort(state);
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
                GigaActionType.CLEAR_FILTER,
                GigaActionType.CLEAR_SORT,
                GigaActionType.NEW_FILTER,
                GigaActionType.NEW_SORT,
                GigaActionType.TOGGLE_ROW_COLLAPSE,
                GigaActionType.COLLAPSE_ALL,
                GigaActionType.EXPAND_ALL,
                GigaActionType.COLUMNS_UPDATE
            ].indexOf(action.type) !== -1;
    }

    /*
     Selection Action Handlers
     */
    private handleRowSelect(state:GigaState, action:ToggleRowSelectAction):GigaState {
        if (_.isFunction(this.props.onRowClick)) {
            const udfResult = this.props.onRowClick(action.row, state);
            if (udfResult !== undefined &&
                udfResult === false)
                return state;
            else {
                // de-select every other row unless enableMultiRowSelect is turned on
                if (!this.props.enableMultiRowSelect) {
                    const toggleTo = !action.row.isSelected();
                    recursivelyDeselect(state.tree.getRoot());
                    action.row.toggleSelect(toggleTo);
                } else
                    action.row.toggleSelect();
                return _.clone(state);
            }
        } else
            return state;

    }

    private handleCellSelect(state:GigaState, action:ToggleCellSelectAction):GigaState {

        if (_.isFunction(this.props.onCellClick)) {
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

    /*
     TODO test these sort handlers
     Sort Action Handlers
     */

    private static handleSortUpdate(state:GigaState, action:SortUpdateAction):GigaState {
        /**
         * go through all the columns in state, flip on/off sort flags as necessary
         */
        var newPartialState = {};
        state.columns.forEach((column:Column)=> {
            var sb = _.find(action.sortBys, s=>s.colTag === column.colTag);
            if (sb)
                column.direction = sb.direction;
            else
                column.direction = undefined;
        });
        newPartialState['columns'] = state.columns;
        newPartialState['tree'] = SortFactory.sortTree(state.tree, action.sortBys, newPartialState['columns'][0]);
        newPartialState['sortBys'] = action.sortBys;
        return _.assign<{}, GigaState>({}, state, newPartialState);
    }

    private static handleClearSort(state:GigaState):GigaState {
        state.columns.forEach((column: Column) => column.direction = undefined);
        const newTree:Tree = SortFactory.sortTree(state.tree, []);
        const newState = _.clone(state);
        newState.tree = newTree;
        newState.sortBys = [];
        return newState;
    }

    private handleColumnUpdate(state:GigaState, action:ColumnUpdateAction) {
        const newColumnStates = {
            columns: action.columns || state.columns,
            subtotalBys: action.subtotalBys || state.subtotalBys
        };
        /**
         * if subtotalBys has been updated, we must re-create the tree and rerun aggregation
         */
        if (!_.isEqual(state.subtotalBys, newColumnStates.subtotalBys)) {
            const tree:Tree = TreeBuilder.buildTree(this.props.data, newColumnStates.subtotalBys);
            TreeBuilder.recursivelyToggleChildrenCollapse(tree.getRoot(), false);
            SubtotalAggregator.aggregateTree(tree, newColumnStates.columns);
            newColumnStates["tree"] = tree;
        }
        return _.assign<{}, GigaState>({}, state, newColumnStates);
    }

}

/*
 Public Actions API
 */

export enum GigaActionType {
    INITIALIZE,
    NEW_SORT,
    CLEAR_SORT,
    NEW_FILTER,
    ADD_FILTER,
    CLEAR_FILTER,
    TOGGLE_ROW_COLLAPSE,
    COLLAPSE_ALL,
    EXPAND_ALL,
    TOGGLE_ROW_SELECT,
    TOGGLE_CELL_SELECT,
    CHANGE_ROW_DISPLAY_BOUNDS,
    COLUMNS_UPDATE
}

export interface GigaAction {
    type:GigaActionType
}

export interface ColumnUpdateAction extends GigaAction {
    columns:Column[]
    subtotalBys:Column[]
}

export interface InitializeAction extends GigaAction {
    props?:GigaProps
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow:SubtotalRow
}

export interface ChangeRowDisplayBoundsAction extends GigaAction {
    viewport:JQuery
    canvas:JQuery
    rowHeight:string
}

export interface ClearSortAction extends GigaAction {

}

export interface AddSortAction extends GigaAction {
    sortBy:Column
}

export interface SortUpdateAction extends GigaAction {
    sortBys:Column[]
}

export interface TableWidthChangeAction extends GigaAction {
    width:string
}

export interface ToggleRowSelectAction extends GigaAction {
    row:Row
}

export interface ToggleCellSelectAction extends GigaAction {
    row:Row
    column:Column
}

// define a function
function recursivelyDeselect(row:Row) {
    row.toggleSelect(false);
    if (!row.isDetail()) {
        const subtotalRow = (row as SubtotalRow);
        const children:Row[] = subtotalRow.getChildren().length === 0 ? subtotalRow.detailRows : subtotalRow.getChildren();
        children.forEach(child=>recursivelyDeselect(child));
    }
}
