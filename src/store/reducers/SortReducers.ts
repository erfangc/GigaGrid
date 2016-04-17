/*
 * Sort Action Handlers
 */

import {SortFactory} from "../../static/SortFactory";
import {Tree} from "../../static/TreeBuilder";
import {Column} from "../../models/ColumnLike";
import {GigaState} from "../../components/GigaGrid";
import {GigaAction} from "../GigaStore";

export function sortUpdateReducer(state:GigaState, action:SortUpdateAction):GigaState {
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

export function cleartSortReducer(state:GigaState):GigaState {
    state.columns.forEach((column:Column) => column.direction = undefined);
    const newTree:Tree = SortFactory.sortTree(state.tree, []);
    const newState = _.clone(state);
    newState.tree = newTree;
    newState.sortBys = [];
    return newState;
}

export interface ClearSortAction extends GigaAction {

}

export interface AddSortAction extends GigaAction {
    sortBy:Column
}

export interface SortUpdateAction extends GigaAction {
    sortBys:Column[]
}