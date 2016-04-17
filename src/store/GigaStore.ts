///<reference path="../../typings/tsd.d.ts"/>

import * as _ from "lodash";
import {GigaState, GigaProps} from "../components/GigaGrid";
import {ReduceStore} from "flux/utils";
import {Dispatcher} from "flux";
import {TreeRasterizer} from "../static/TreeRasterizer";
import initialStateReducer, {InitializeAction} from "./reducers/InitializeReducer";
import {
    rowSelectReducer,
    cellSelectReducer,
    ToggleRowSelectAction,
    ToggleCellSelectAction
} from "./reducers/SelectReducers";
import {changeDisplayBoundsReducer, ChangeRowDisplayBoundsAction} from "./reducers/ChangeRowDisplayBoundsReducer";
import {sortUpdateReducer, cleartSortReducer, SortUpdateAction} from "./reducers/SortReducers";
import {
    toggleCollapseReducer,
    collapseAllReducer,
    expandAllReducer,
    ToggleCollapseAction
} from "./reducers/RowCollapseReducers";
import {columnUpdateReducer, ColumnUpdateAction} from "./reducers/ColumnUpdateReducer";

/*
 define the # of rows necessary to trigger progressive rendering
 below which all row display bound change events are ignored
 */
export const PROGRESSIVE_RENDERING_THRESHOLD:number = 100;

/**
 * state store for the table, relevant states and stored here. the only way to mutate these states are by sending GigaAction(s) through the Dispatcher given to the store at construction
 * there are no way to direct set the state. The GigaGrid controller-view React Component draws its state updates from this store. Updates are automatically triggered for every state mutation through
 * a callback. (i.e. all GigaGrid instances must call store.addListener(()=>this.setState(this.store.getState())) during construction)
 */
export class GigaStore extends ReduceStore<GigaState> {

    private props:GigaProps;

    constructor(dispatcher:Dispatcher<GigaAction>, props:GigaProps) {
        super(dispatcher);
        this.props = props;
        dispatcher.dispatch({
            type: GigaActionType.INITIALIZE
        });
    }

    getInitialState():GigaState {
        return null;
    }

    /**
     * ES6 disallow using `this` before `super()`, however we need the props to derive the initial state
     * so we kind of hack around it ... the designers of the Flux paradigm never thought I would use flux store to manage widget
     * state as oppose to application state ...
     * This however, allow us a mechanism to derive initial state again when props change (i.e. such as when the parent component give us new props without un-mounting)
     */
    initialize(action:InitializeAction):GigaState {
        // if props not passed we will use this.props
        const overrideAction:InitializeAction = _.assign<{},{},{},InitializeAction>({}, action, {props: action.props || this.props});
        return initialStateReducer(overrideAction);
    }

    reduce(state:GigaState,
           action:GigaAction):GigaState {

        var newState:GigaState;
        switch (action.type) {
            case GigaActionType.INITIALIZE:
                newState = this.initialize(action as InitializeAction);
                break;
            case GigaActionType.CHANGE_ROW_DISPLAY_BOUNDS:
                newState = changeDisplayBoundsReducer(state, action as ChangeRowDisplayBoundsAction);
                break;
            case GigaActionType.COLUMNS_UPDATE:
                newState = columnUpdateReducer(state, action as ColumnUpdateAction, this.props);
                break;
            case GigaActionType.TOGGLE_ROW_COLLAPSE:
                newState = toggleCollapseReducer(state, action as ToggleCollapseAction);
                break;
            case GigaActionType.COLLAPSE_ALL:
                newState = collapseAllReducer(state);
                break;
            case GigaActionType.EXPAND_ALL:
                newState = expandAllReducer(state);
                break;
            case GigaActionType.NEW_SORT:
                newState = sortUpdateReducer(state, action as SortUpdateAction);
                break;
            case GigaActionType.CLEAR_SORT:
                newState = cleartSortReducer(state);
                break;
            case GigaActionType.TOGGLE_ROW_SELECT:
                newState = rowSelectReducer(state, action as ToggleRowSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_CELL_SELECT:
                newState = cellSelectReducer(state, action as ToggleCellSelectAction, this.props);
                break;
            case GigaActionType.TOGGLE_SETTINGS_POPOVER:
                newState = _.assign<{},GigaState>({}, state, {showSettingsPopover: !state.showSettingsPopover});
                break;
            default:
                newState = state;
        }

        /*
         determine if an action should trigger rasterization
         todo I wonder if we need to re-compute display bounds after rasterization if so, viewport and canvas must become states so we can access them here
         */
        if (GigaStore.shouldTriggerRasterization(action))
            newState.rasterizedRows = TreeRasterizer.rasterize(newState.tree);

        return newState;
    }

    private static shouldTriggerRasterization(action:GigaAction) {
        return [
                GigaActionType.CLEAR_SORT,
                GigaActionType.NEW_SORT,
                GigaActionType.TOGGLE_ROW_COLLAPSE,
                GigaActionType.COLLAPSE_ALL,
                GigaActionType.EXPAND_ALL,
                GigaActionType.COLUMNS_UPDATE
            ].indexOf(action.type) !== -1;
    }

}

/*
 Public Actions API
 */
export enum GigaActionType {
    INITIALIZE,
    NEW_SORT,
    CLEAR_SORT,
    TOGGLE_ROW_COLLAPSE,
    COLLAPSE_ALL,
    EXPAND_ALL,
    TOGGLE_ROW_SELECT,
    TOGGLE_CELL_SELECT,
    CHANGE_ROW_DISPLAY_BOUNDS,
    TOGGLE_SETTINGS_POPOVER,
    COLUMNS_UPDATE
}

export interface GigaAction {
    type:GigaActionType
}
