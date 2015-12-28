import {GigaGridState,GigaGridProps} from "../components/GigaGrid";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree} from "../static/TreeBuilder";
import {TreeBuilder} from "../static/TreeBuilder";
import {SubtotalBy} from "../models/ColumnLike";
import * as Flux from 'flux';
import * as FluxUtils from 'flux/utils';
import ReduceStore = FluxUtils.ReduceStore;
import Dispatcher = Flux.Dispatcher;

export class GigaGridStateStore extends ReduceStore<GigaGridState> {

    private props:GigaGridProps;

    constructor(dispatcher:Dispatcher<GigaGridAction>, props:GigaGridProps) {
        this.props = props;
        super(dispatcher);
    }

    getInitialState():GigaGridState {
        const tree = TreeBuilder.buildTree(this.props.data, this.props.initialSubtotalBys);
        SubtotalAggregator.aggregateTree(tree, this.props.columnDefs);
        return {
            subtotalBys: this.props.initialSubtotalBys,
            tree: tree
        }
    }

    reduce(state:GigaGridState,
           action:GigaGridAction):GigaGridState {
        switch (action.type) {
            case GigaGridActionType.NEW_SUBTOTAL:
                return this.handleSubtotal(state, action as NewSubtotalAction);
            case GigaGridActionType.CLEAR_SUBTOTAL:
                return this.handleClearSubtotal(state, action as ClearSubtotalAction);
            default:
                return state;
        }
    }

    // state transition handlers
    private handleSubtotal(state:GigaGridState,
                           action:NewSubtotalAction):GigaGridState {
        const newTree = TreeBuilder.buildTree(this.props.data, action.subtotalBys);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        return {
            subtotalBys: action.subtotalBys,
            tree: newTree
        }
    }

    private handleClearSubtotal(state:GigaGridState,
                                action:ClearSubtotalAction):GigaGridState {
        const newTree = TreeBuilder.buildTree(this.props.data, []);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        return {
            subtotalBys: [],
            tree: newTree
        };
    }

}

export enum GigaGridActionType {
    NEW_SUBTOTAL,
    ADD_SUBTOTAL,
    CLEAR_SUBTOTAL,
    NEW_SORT,
    ADD_SORT,
    CLEAR_SORT,
    NEW_FILTER,
    ADD_FILTER,
    CLEAR_FILTER,
    TOGGLE_ROW_COLLAPSE,
    TOGGLE_DETAIL_ROW_SELECT,
    TOGGLE_SUMMARY_ROW_SELECT
}

export interface GigaGridAction {
    type:GigaGridActionType;
}

export interface NewSubtotalAction extends GigaGridAction {
    subtotalBys:SubtotalBy[]
}

export interface ClearSubtotalAction extends GigaGridAction {

}
