import { GigaAction } from '../GigaStore';
import { Row } from '../../models/Row';
import { Column } from '../../models/ColumnLike';
import { GigaProps } from '../../components/GigaProps';
import { Dispatcher } from 'flux';
import { GigaState } from '../../components/GigaState';

export function cellSelectHandler(state: GigaState, action: ToggleCellSelectAction, props: GigaProps, dispatcher: Dispatcher<any>): GigaState {

    if (typeof props.onCellClick === 'function') {
        if (!props.onCellClick(action.row, action.column, dispatcher)) {
            return state; // will not emit state mutation event
        } else {
            return Object.assign({}, state); // will emit state mutation event
        }
    } else {
        return state;
    }

}

export function rowSelectHandler(state: GigaState, action: ToggleRowSelectAction, props: GigaProps): GigaState {
    if (typeof props.onRowClick === 'function') {
        const udfResult = props.onRowClick(action.row, state);
        if (udfResult !== undefined &&
            udfResult === false) {
            return state;
        } else {
            // de-select every other row unless enableMultiRowSelect is turned on
            if (!props.enableMultiRowSelect) {
                const toggleTo = !action.row.selected;
                recursivelyDeselect(state.tree.getRoot());
                action.row.selected = toggleTo;
            } else {
                action.row.toggleSelect();
            }
            return Object.assign({}, state);
        }
    } else {
        return state;
    }

}

// define a function
function recursivelyDeselect(row: Row) {
    row.selected = false;
    if (!row.isDetailRow()) {
        const children: Row[] = row.children.length === 0 ? row.detailRows : row.children;
        children.forEach(child => recursivelyDeselect(child));
    }
}

export interface ToggleRowSelectAction extends GigaAction {
    row: Row;
}

export interface ToggleCellSelectAction extends GigaAction {
    row: Row;
    column: Column;
}
