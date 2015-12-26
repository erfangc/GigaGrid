import {GigaGridState,GigaGridProps} from "../components/GigaGrid";
import EE = require('eventemitter3');
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree} from "../static/TreeBuilder";
import {TreeBuilder} from "../static/TreeBuilder";

export enum GigaGridEventType {
    REMOVE_SUBTOTAL, INCREMENTAL_SUBTOTAL, INCREMENTAL_SORT, NEW_SUBTOTAL, NEW_SORT
}

export interface GigaGridEvent {
    eventType:GigaGridEventType
}

/**
 * following the Flux doctrine. we extracted state management into its own module or "store".
 * the main GigaGrid component never mutate its own state. user events such as sorting/subtotaling or even cell level
 * data mutation are all emitted as events to a central dispatcher (instead of propagating up the parent through callbacks).
 * this state manager instance listens to to events from this central dispatcher and calls the proper handler for events as appropriate.
 *
 * this means two things:
 * 1. all children of the GigaGrid component should be virtually stateless (except for very localized situations such as dropdown menu visibility)
 * 2. both the main GigaGrid component as well as its children can never call setState() outside the state manager
 * to ensure #2, we should never pass a reference to the main GigaGrid to its children
 *
 */
export class StateManager {

    private stateChangeCallbacks:(GigaGridState)=>any;

    constructor(grid:number, gridEventPrefix?:string) {
        // TODO register event listeners and attach them to handlers
    }

    private processNextState(props: GigaGridProps, previousState:GigaGridState, event: GigaGridEvent) {
        // TODO route to event handler based on event type, event handler must be return the next state
        const nextState = this.handleSubtotalBy();
        // invoke state mutation call back registered by the "view", i.e. main GigaGrid component
        this.stateChangeCallbacks(nextState);
    }

    private handleSubtotalBy():GigaGridState {
        return null;
    }

    getInitialState(props:GigaGridProps):GigaGridState {
        const tree:Tree = TreeBuilder.buildTree(props.data, props.initialSubtotalBys);
        SubtotalAggregator.aggregateTree(tree, props.columnDefs);
        return {tree: tree, subtotalBys: props.initialSubtotalBys};
    }

    registerStateChangeCallback(fn:(GigaGridState)=>any):void {
        this.stateChangeCallbacks = fn;
    }
}