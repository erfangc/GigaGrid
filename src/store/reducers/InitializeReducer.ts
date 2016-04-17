import {PROGRESSIVE_RENDERING_THRESHOLD, GigaAction} from "./../GigaStore";
import {TreeRasterizer} from "../../static/TreeRasterizer";
import {Row} from "../../models/Row";
import {SortFactory} from "../../static/SortFactory";
import {SubtotalAggregator} from "../../static/SubtotalAggregator";
import {TreeBuilder} from "../../static/TreeBuilder";
import {Column, SortDirection} from "../../models/ColumnLike";
import {GigaState, GigaProps} from "../../components/GigaGrid";

export default function (action:InitializeAction):GigaState {

    const {
        data,
        columnDefs,
        columnGroups,
        initialSubtotalBys,
        initialSortBys,
        initialFilterBys,
        initiallyExpandedSubtotalRows,
        initiallySelectedSubtotalRows
    } = action.props;

    /**
     * turn ColumnDefs into "Columns" which are decorated with behaviors
     */
    const columns = columnDefs.map(columnDef=> {
        return _.assign<{},Column>({}, columnDef, {});
    });

    /**
     * create subtotalBys from columns (any properties passed in via initialSubtotalBys will override the same property on the corresponding Column object
     */
    const subtotalBys:Column[] = (initialSubtotalBys || []).map(subtotalBy => {
        const column:Column = _.find(columns, column => column.colTag === subtotalBy.colTag);
        return _.assign<{}, Column>({}, column, subtotalBy);
    });

    /**
     * create sortBys from columns (any properties passed via initialSortBys will override the same property in the corresponding Column object
     */
    // FIXME we have a state sync issue, columns have "directions", but so does sortBys, the code below is a temp fix
    const columnsWithSort:Column[] = columns.map((column:Column)=> {
        const sortBy = _.find((initialSortBys || []), (s:Column)=>s.colTag == column.colTag);
        if (sortBy)
            return _.assign<{},{},{},Column>({}, column, {
                direction: sortBy.direction || SortDirection.DESC
            });
        else
            return column;
    });
    const sortBys:Column[] = (initialSortBys || []).map((sortBy:Column)=> {
        const column = _.find(columnsWithSort, (column:Column) => column.colTag === sortBy.colTag);
        return _.assign<{},Column,{},Column>({}, column, sortBy);
    });

    const filteredColumns:Column[] = _.filter(columnsWithSort, (column:Column) => subtotalBys.map(subtotalBy => subtotalBy.colTag).indexOf(column.colTag) === -1);

    var tree = TreeBuilder.buildTree(
        data,
        subtotalBys,
        initiallyExpandedSubtotalRows,
        initiallySelectedSubtotalRows
    );
    SubtotalAggregator.aggregateTree(tree, columns);

    if (sortBys)
        tree = SortFactory.sortTree(tree, sortBys, columns[0]);

    const rasterizedRows:Row[] = TreeRasterizer.rasterize(tree);

    return {
        rasterizedRows: rasterizedRows,
        displayStart: 0,
        columns: columnGroups ? columnsWithSort : filteredColumns,
        displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
        subtotalBys: subtotalBys,
        sortBys: sortBys,
        filterBys: _.cloneDeep(initialFilterBys) || [],
        tree: tree,
        showSettingsPopover: false
    }

}

export interface InitializeAction extends GigaAction {
    props?:GigaProps
}