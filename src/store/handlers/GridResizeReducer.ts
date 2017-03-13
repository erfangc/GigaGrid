import { GigaProps } from '../../components/GigaProps';
import { GigaState } from '../../components/GigaState';
import { ColumnWidthCalculator } from '../../static/ColumnWidthCalculator';
import { GigaAction } from '../GigaStore';

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