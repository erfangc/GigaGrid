/*
 Subtotal Action Handlers
 */
import {GigaState} from "../../components/GigaGrid";
import {GigaAction} from "../GigaStore";
import {TreeBuilder} from "../../static/TreeBuilder";
import {SubtotalRow} from "../../models/Row";
export function expandAllReducer(state:GigaState):GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot(), false);
    return _.clone(state);
}

export function collapseAllReducer(state:GigaState):GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot());
    return _.clone(state);
}

export function toggleCollapseReducer(state:GigaState, action:ToggleCollapseAction):GigaState {
    const row = action.subtotalRow;
    row.toggleCollapse();
    return _.clone(state);
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow:SubtotalRow
}