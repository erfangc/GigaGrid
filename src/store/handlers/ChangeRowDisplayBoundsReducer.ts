import {GigaState} from "../../components/GigaGrid";
import {GigaAction} from "../GigaStore";
import {ScrollCalculator} from "../../static/ScrollCalculator";

export function changeDisplayBoundsHandler(state:GigaState, action:ChangeRowDisplayBoundsAction) {
    const {displayStart, displayEnd} = ScrollCalculator.computeDisplayBoundaries(action.rowHeight, action.viewport, action.canvas);
    const newState = _.clone(state);
    newState.displayStart = displayStart;
    newState.displayEnd = displayEnd;
    return newState;
}

export interface ChangeRowDisplayBoundsAction extends GigaAction {
    viewport:JQuery
    canvas:JQuery
    rowHeight:string
}