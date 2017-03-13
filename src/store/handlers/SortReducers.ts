/*
 * Sort Action Handlers
 */

import { SortFactory } from '../../static/SortFactory';
import { Tree } from '../../static/TreeBuilder';
import { Column } from '../../models/ColumnLike';
import { GigaAction } from '../GigaStore';
import {GigaState} from '../../components/GigaState';

export function sortUpdateHandler(state: GigaState, action: SortUpdateAction): GigaState {
    /**
     * go through all the columns in state, flip on/off sort flags as necessary
     */
    let newPartialState = {};
    state.columns.forEach((column: Column) => {
        let sb = action.sortBys.find(s => s.colTag === column.colTag);
        if (sb) {
            column.direction = sb.direction;
        } else {
            column.direction = undefined;
        }
    });
    newPartialState['columns'] = state.columns;
    newPartialState['tree'] = SortFactory.sortTree(state.tree, action.sortBys, newPartialState['columns'][0]);
    newPartialState['sortBys'] = action.sortBys;
    return Object.assign({}, state, newPartialState);
}

export function cleartSortHandler(state: GigaState): GigaState {
    state.columns.forEach((column: Column) => column.direction = undefined);
    const newTree: Tree = SortFactory.sortTree(state.tree, []);
    const newState = Object.assign({}, state);
    newState.tree = newTree;
    newState.sortBys = [];
    return newState;
}

export interface ClearSortAction extends GigaAction {

}

export interface SortUpdateAction extends GigaAction {
    sortBys: Column[];
}