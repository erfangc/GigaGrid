/*
 Subtotal Action Handlers
 */
import { GigaState } from "../../components/GigaGrid";
import { GigaAction } from "../GigaStore";
import { TreeBuilder } from "../../static/TreeBuilder";
import { Row } from "../../models/Row";
import { ScrollCalculator } from "../../static/ScrollCalculator";
import * as $ from "jquery";
import { GigaProps } from "../../components/GigaProps";

export function expandAllHandler(state: GigaState): GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot(), false);
    return Object.assign({}, state);
}

export function collapseAllHandler(state: GigaState): GigaState {
    TreeBuilder.recursivelyToggleChildrenCollapse(state.tree.getRoot());
    return Object.assign({}, state);
}

export function toggleCollapseHandler(state: GigaState, action: ToggleCollapseAction, props: GigaProps): GigaState {
    const row = action.subtotalRow;
    row.toggleCollapse();
    const newState = Object.assign({}, state);
    const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(props.rowHeight, props.bodyHeight, state.viewport);
    newState.displayStart = displayStart;
    newState.displayEnd = displayEnd;
    return newState;
}

export interface ToggleCollapseAction extends GigaAction {
    subtotalRow: Row;
}


