import { GigaAction } from "../GigaStore";
import { ScrollCalculator } from "../../static/ScrollCalculator";
import {GigaState} from "../../components/GigaState";

export function changeDisplayBoundsHandler(state: GigaState, action: ChangeRowDisplayBoundsAction) {
    let {canvas, viewport} = state;
    const { displayStart, displayEnd } = ScrollCalculator.computeDisplayBoundaries(action.rowHeight, action.bodyHeight, viewport);
    const newState = Object.assign({}, state);
    newState.displayStart = displayStart;
    newState.displayEnd = displayEnd;
    return newState;
}

export interface ChangeRowDisplayBoundsAction extends GigaAction {
    rowHeight: string;
    bodyHeight: string;
}