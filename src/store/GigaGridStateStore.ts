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

    reduce(state:GigaGridState, action:GigaGridAction):GigaGridState {
        switch (action.type) {
            case "subtotal":
                return this.handleSubtotal(state, action as SubtotalAction);
            default:
                return state;
        }
    }

    // state transition handlers
    private handleSubtotal(state:GigaGridState, action:SubtotalAction):GigaGridState {
        const newTree = TreeBuilder.buildTree(this.props.data, action.subtotalBys);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        return {
            subtotalBys: action.subtotalBys,
            tree: newTree
        }
    }

}

export interface GigaGridAction {
    type:string;
}

export interface SubtotalAction extends GigaGridAction {
    subtotalBys:SubtotalBy[]
}