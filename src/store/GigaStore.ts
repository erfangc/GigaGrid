import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { TreeRasterizer } from '../static/TreeRasterizer';
import initialStateReducer, { InitializeAction } from './handlers/InitializeReducer';
import {
    rowSelectHandler,
    cellSelectHandler,
    ToggleRowSelectAction,
    ToggleCellSelectAction
} from './handlers/SelectReducers';
import { changeDisplayBoundsHandler, ChangeRowDisplayBoundsAction } from './handlers/ChangeRowDisplayBoundsReducer';
import { sortUpdateHandler, cleartSortHandler, SortUpdateAction } from './handlers/SortReducers';
import {
    toggleCollapseHandler,
    collapseAllHandler,
    expandAllHandler,
    ToggleCollapseAction
} from './handlers/RowCollapseReducers';
import { columnUpdateHandler, ColumnUpdateAction } from './handlers/ColumnUpdateReducer';
import { GigaProps } from '../components/GigaProps';
import { CellContentChangeAction, cellContentChangeHandler } from './handlers/CellContentChange';
import { GigaState } from '../components/GigaState';
import { gridResizeReducer, GridResizeAction } from './handlers/GridResizeReducer';
import { Column } from '../index';

/*
 define the # of rows necessary to trigger progressive rendering
 below which all row display bound change events are ignored
 */
export const PROGRESSIVE_RENDERING_THRESHOLD: number = 20;

/**
 * state store for the table, relevant states and stored here. the only way to mutate these states are by sending GigaAction(s) through the Dispatcher given to the store at construction
 * there are no way to direct set the state. The GigaGrid controller-view React Component draws its state updates from this store. Updates are automatically triggered for every state mutation through
 * a callback. (i.e. all GigaGrid instances must call store.addListener(()=>this.setState(this.store.getState())) during construction)
 */
export class GigaStore extends ReduceStore<GigaState, GigaAction> {

    private props: GigaProps;

    constructor(dispatcher: Dispatcher<GigaAction>, props: GigaProps) {
        super(dispatcher);
        this.props = props;
        dispatcher.dispatch({
            type: GigaActionType.INITIALIZE
        });
    }

    getInitialState(): GigaState {
        return null;
    }

    /**
     * ES6 disallow using `this` before `super()`, however we need the props to derive the initial state
     * so we kind of hack around it ... the designers of the Flux paradigm never thought I would use flux store to manage widget
     * state as oppose to application state ...
     * This however, allow us a mechanism to derive initial state again when props change (i.e. such as when the parent component give us new props without un-mounting)
     */
    initialize(action: InitializeAction): GigaState {
        // if props not passed we will use this.props
        const overrideAction: InitializeAction = Object.assign({}, action, { props: action.props || this.props });
        return initialStateReducer(overrideAction);
    }

    reduce(state: GigaState,
           action: GigaAction): GigaState {

        let newState: GigaState;
        switch (action.type) {
            case GigaActionType.INITIALIZE:
                newState = this.initialize(action as InitializeAction);
                break;
            case GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS:
                newState = changeDisplayBoundsHandler(state, action as ChangeRowDisplayBoundsAction);
                break;
            case GigaActionType.CELL_CONTENT_CHANGE:
                newState = cellContentChangeHandler(state, action as CellContentChangeAction);
                break;
            case GigaActionType.COLUMNS_UPDATE:
                newState = columnUpdateHandler(state, action as ColumnUpdateAction, this.props);
                break;
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = toggleCollapseHandler(state, action as ToggleCollapseAction, this.props);
                break;
            case GigaActionType.COLLAPSE_ALL:
                newState = collapseAllHandler(state);
                break;
            case GigaActionType.EXPAND_ALL:
                newState = expandAllHandler(state);
                break;
            case GigaActionType.NEW_SORT:
                newState = sortUpdateHandler(state, action as SortUpdateAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = cleartSortHandler(state);
                break;
            case GigaActionType.TOGGLE_ROW_SELECT:
                newState = rowSelectHandler(state, action as ToggleRowSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_CELL_SELECT:
                newState = cellSelectHandler(state, action as ToggleCellSelectAction, this.props, this.getDispatcher());
                break;
            case GigaActionType.TOGGLE_SETTINGS_POPOVER:
                newState = Object.assign({}, state, { showSettingsPopover: !state.showSettingsPopover });
                break;
            case GigaActionType.VIEWPORT_RESIZE:
                newState = gridResizeReducer(state, action as GridResizeAction, this.props);
                break;
            case GigaActionType.COLUMN_RESIZE:
                newState = Object.assign({}, state);
                let resizeAction = (action as ColumnResizeAction);
                resizeAction.column.width = resizeAction.newWidth;
                break;
            default:
                newState = state;
        }

        /*
         determine if an action should trigger rasterization
         todo I wonder if we need to re-compute display bounds after rasterization if so, viewport and canvas must become states so we can access them here
         */
        if (GigaStore.shouldTriggerRasterization(action)) {
            newState.rasterizedRows = TreeRasterizer.rasterize(newState.tree);
        }
        return newState;
    }

    static shouldTriggerRasterization(action: GigaAction) {
        return [
            GigaActionType.CLEAR_SORT,
            GigaActionType.NEW_SORT,
            GigaActionType.TOGGLE_ROW_COLLAPSE,
            GigaActionType.COLLAPSE_ALL,
            GigaActionType.EXPAND_ALL,
            GigaActionType.COLLAPSE_ROW,
            GigaActionType.GOT_MORE_DATA,
            GigaActionType.COLUMNS_UPDATE
        ].indexOf(action.type) !== -1;
    }

}

/*
 Public Actions API
 */
export enum GigaActionType {
    INITIALIZE,
    CELL_CONTENT_CHANGE,
    NEW_SORT,
    COLUMN_RESIZE,
    VIEWPORT_RESIZE,
    CLEAR_SORT,
    TOGGLE_ROW_COLLAPSE,
    COLLAPSE_ALL,
    EXPAND_ALL,
    GOT_MORE_DATA,
    LOADING_MORE_DATA,
    STOP_LOADING_MORE_DATA,
    SET_LOADING_DATA_ERROR_STATUS,
    COLLAPSE_ROW,
    TOGGLE_ROW_SELECT,
    TOGGLE_CELL_SELECT,
    CHANGE_ROW_DISPLAY_BOUNDS,
    TOGGLE_SETTINGS_POPOVER,
    COLUMNS_UPDATE
}

export interface GigaAction {
    type: GigaActionType;
}

export interface ColumnResizeAction extends GigaAction {
    column: Column;
    newWidth: number;
}