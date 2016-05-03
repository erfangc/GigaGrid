/*
 Subtotal Action Handlers
 */
import {GigaState,GigaProps} from "../../components/GigaGrid";
import {GigaAction} from "../GigaStore";
import {TreeBuilder} from "../../static/TreeBuilder";
import {SubtotalRow} from "../../models/Row";
import {ScrollCalculator} from "../../static/ScrollCalculator";
export function expandAllReducer(state:GigaState):GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot(), false);
    return _.clone(state);
}

export function collapseAllReducer(state:GigaState):GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot());
    return _.clone(state);
}

export function toggleCollapseReducer(state:GigaState, action:ToggleCollapseAction,props:GigaProps):GigaState {
    //const row = action.subtotalRow;
    //row.toggleCollapse();
    //return _.clone(state);

    const row = action.subtotalRow;
    row.toggleCollapse();
    const newState = _.clone(state);
    const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(props.rowHeight, $(state.viewport), $(state.canvas));
    newState.displayStart = displayStart;
    newState.displayEnd = displayEnd;
    return newState;
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow:SubtotalRow
}


