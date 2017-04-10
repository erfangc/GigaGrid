import { GigaProps } from '../../components/GigaProps';
import { GigaState } from '../../components/GigaState';
import { Column } from '../../models/ColumnLike';
import { SortFactory } from '../../static/SortFactory';
import { SubtotalAggregator } from '../../static/SubtotalAggregator';
import { Tree, TreeBuilder } from '../../static/TreeBuilder';
import { GigaAction } from '../GigaStore';

export function columnUpdateHandler(state: GigaState, action: ColumnUpdateAction, props: GigaProps) {
    const newColumnStates = {
        columns: action.columns || state.columns,
        subtotalBys: action.subtotalBys || state.subtotalBys,
        showSettingsPopover: !state.showSettingsPopover
    };
    // TODO we might not ALWAYS want to re-aggregate, but we need to think about how the object model works
    const tree: Tree = TreeBuilder.buildTree(props.data, newColumnStates.subtotalBys);
    TreeBuilder.recursivelyToggleChildrenCollapse(tree.getRoot(), false);
    SubtotalAggregator.aggregateTree(tree, newColumnStates.columns);
    newColumnStates['tree'] = SortFactory.sortTree(tree, state.sortBys);
    return Object.assign({}, state, newColumnStates);
}

export interface ColumnUpdateAction extends GigaAction {
    columns: Column[];
    subtotalBys: Column[];
}