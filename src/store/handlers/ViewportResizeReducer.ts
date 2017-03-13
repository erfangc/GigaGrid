/**
 * ViewportResizeReducer
 */
import { GigaState } from "../../components/GigaState";
import { GigaAction } from "../GigaStore";
import { GigaProps } from "../../components/GigaProps";
import { ColumnWidthCalculator } from "../../static/ColumnWidthCalculator";

export interface ViewportResizeAction extends GigaAction {
    newGridWidth: string;
} 

export function viewportResizeReducer(state: GigaState, action: ViewportResizeAction, props: GigaProps): GigaState {
    let newState = Object.assign({}, state);
    let {rightBody, columns} = state;
    let {columnDefs} = props;
    let {newGridWidth} = action;
    ColumnWidthCalculator.enrichColumnsWithWidth(columns, columnDefs, newGridWidth);
    let newMaxWidth = ColumnWidthCalculator.calculateRightPanelMaxWidth(columns, newGridWidth, props);
    rightBody.style.maxWidth = newMaxWidth;
    return newState;
}