import { GigaState } from "../../components/GigaState";
import { GigaAction } from "../GigaStore";
import { GigaProps } from "../../components/GigaProps";
import { ColumnWidthCalculator } from "../../static/ColumnWidthCalculator";

export interface GridResizeAction extends GigaAction {
    newGridWidth: string;
} 

export function gridResizeReducer(state: GigaState, action: GridResizeAction, props: GigaProps): GigaState {
    let newState = Object.assign({}, state);
    let {rightBody, rightHeader, columns} = state;
    let {columnDefs} = props;
    let {newGridWidth} = action;
    ColumnWidthCalculator.enrichColumnsWithWidth(columns, columnDefs, newGridWidth);
    let newMaxWidth = ColumnWidthCalculator.calculateRightPanelMaxWidth(columns, newGridWidth, props);
    if (rightBody) {
        rightBody.style.maxWidth = newMaxWidth;
    }
    if (rightHeader) {
        rightHeader.style.maxWidth = newMaxWidth;
    }
    return newState;
}