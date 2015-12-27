import {GigaGridState,GigaGridProps} from "../components/GigaGrid";
import {SubtotalAggregator} from "../static/SubtotalAggregator";
import {Tree} from "../static/TreeBuilder";
import {TreeBuilder} from "../static/TreeBuilder";
import {SubtotalBy} from "../models/ColumnLike";

export class GigaGridStateStore {

    private onStateChange:(GigaGridState)=>any;
    private props:GigaGridProps;

    constructor(props:GigaGridProps) {
        this.props = props;
    }

    handleSubtotalby(sbs:SubtotalBy[]) {
        const newTree:Tree = TreeBuilder.buildTree(this.props.data, sbs);
        SubtotalAggregator.aggregateTree(newTree, this.props.columnDefs);
        const nextState:GigaGridState = {
            subtotalBys: sbs,
            tree: newTree
        };
        this.onStateChange(nextState);
    }

    getInitialState():GigaGridState {
        const tree:Tree = TreeBuilder.buildTree(this.props.data, this.props.initialSubtotalBys);
        SubtotalAggregator.aggregateTree(tree, this.props.columnDefs);
        return {tree: tree, subtotalBys: this.props.initialSubtotalBys};
    }

    registerStateChangeCallback(fn:(GigaGridState)=>any):void {
        this.onStateChange = fn;
    }
}