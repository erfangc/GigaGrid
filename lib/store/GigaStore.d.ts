/// <reference types="flux" />
import { ReduceStore } from "flux/utils";
import { Dispatcher } from "flux";
import { InitializeAction } from "./handlers/InitializeReducer";
import { GigaProps } from "../components/GigaProps";
import { GigaState } from "../components/GigaState";
export declare const PROGRESSIVE_RENDERING_THRESHOLD: number;
/**
 * state store for the table, relevant states and stored here. the only way to mutate these states are by sending GigaAction(s) through the Dispatcher given to the store at construction
 * there are no way to direct set the state. The GigaGrid controller-view React Component draws its state updates from this store. Updates are automatically triggered for every state mutation through
 * a callback. (i.e. all GigaGrid instances must call store.addListener(()=>this.setState(this.store.getState())) during construction)
 */
export declare class GigaStore extends ReduceStore<GigaState, GigaAction> {
    private props;
    constructor(dispatcher: Dispatcher<GigaAction>, props: GigaProps);
    getInitialState(): GigaState;
    /**
     * ES6 disallow using `this` before `super()`, however we need the props to derive the initial state
     * so we kind of hack around it ... the designers of the Flux paradigm never thought I would use flux store to manage widget
     * state as oppose to application state ...
     * This however, allow us a mechanism to derive initial state again when props change (i.e. such as when the parent component give us new props without un-mounting)
     */
    initialize(action: InitializeAction): GigaState;
    reduce(state: GigaState, action: GigaAction): GigaState;
    static shouldTriggerRasterization(action: GigaAction): boolean;
}
export declare enum GigaActionType {
    INITIALIZE = 0,
    CELL_CONTENT_CHANGE = 1,
    NEW_SORT = 2,
    VIEWPORT_RESIZE = 3,
    CLEAR_SORT = 4,
    TOGGLE_ROW_COLLAPSE = 5,
    COLLAPSE_ALL = 6,
    EXPAND_ALL = 7,
    GOT_MORE_DATA = 8,
    LOADING_MORE_DATA = 9,
    STOP_LOADING_MORE_DATA = 10,
    SET_LOADING_DATA_ERROR_STATUS = 11,
    COLLAPSE_ROW = 12,
    TOGGLE_ROW_SELECT = 13,
    TOGGLE_CELL_SELECT = 14,
    CHANGE_ROW_DISPLAY_BOUNDS = 15,
    TOGGLE_SETTINGS_POPOVER = 16,
    COLUMNS_UPDATE = 17,
}
export interface GigaAction {
    type: GigaActionType;
}
