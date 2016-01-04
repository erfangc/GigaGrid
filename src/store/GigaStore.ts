import * as Flux from 'flux';
import * as FluxUtils from 'flux/utils';
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

        return {
            subtotalBys: this.props.initialSubtotalBys || [],
            sortBys: this.props.initialSortBys || [],
            filterBys: this.props.initialFilterBys || [],
            tree: tree
        }
    }

    areEqual(state1:GigaState, state2:GigaState):boolean {
        return false;
    }

    reduce(state:GigaState,
           action:GigaAction):GigaState {
        var newState:GigaState;
        switch (action.type) {
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
            default:
                newState = state;
        }
        return newState;
    }

    /*
     Subtotal Action Handlers
     */

    private handleToggleCollapse(state:GigaState, action:ToggleCollapseAction) {
        const row = action.subtotalRow;
        row.toggleCollapse();
        return state;
    }

    private handleSubtotal(state:GigaState,
                           action:NewSubtotalAction):GigaState {
        const newTree = TreeBuilder.buildTree(this.props.data, action.subtotalBys);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        return {
            subtotalBys: action.subtotalBys,
            filterBys: state.filterBys,
            sortBys: state.sortBys,
            tree: newTree
        }
    }

    private handleClearSubtotal(state:GigaState,
                                action:ClearSubtotalAction):GigaState {
        const newTree = TreeBuilder.buildTree(this.props.data, []);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        return {
            subtotalBys: [],
            sortBys: state.sortBys,
            filterBys: state.filterBys,
            tree: newTree
        };
    }

    /*
     TODO test these sort handlers
     Sort Action Handlers
     */
    private handleAddSort(state:GigaState, action:AddSortAction):GigaState {
        const sortBy = action.sortBy;
        state.sortBys.push(sortBy);
        const newTree:Tree = SortFactory.sortTree(state.tree, state.sortBys);
        return {
            tree: newTree,
            sortBys: state.sortBys,
            filterBys: state.filterBys,
            subtotalBys: state.subtotalBys
        };
    }

    private handleNewSort(state:GigaState, action:NewSortAction):GigaState {
        const newTree:Tree = SortFactory.sortTree(state.tree, action.sortBys);
        return {
            tree: newTree,
            sortBys: action.sortBys,
            filterBys: state.filterBys,
            subtotalBys: state.subtotalBys
        };
    }

    private handleClearSort(state:GigaState, action:ClearSortAction):GigaState {
        const newTree:Tree = SortFactory.sortTree(state.tree, []);
        return {
            tree: newTree,
            sortBys: [],
            subtotalBys: state.subtotalBys,
            filterBys: state.filterBys
        };
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
    TOGGLE_DETAIL_ROW_SELECT,
    TOGGLE_SUMMARY_ROW_SELECT
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

export interface ClearSortAction extends GigaAction {

}

export interface AddSortAction extends GigaAction {
    sortBy: SortBy
}

export interface NewSortAction extends GigaAction {
    sortBys:SortBy[]
}
