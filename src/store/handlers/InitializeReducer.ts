import {PROGRESSIVE_RENDERING_THRESHOLD, GigaAction} from "../GigaStore";
import {TreeRasterizer} from "../../static/TreeRasterizer";
import {Row} from "../../models/Row";
import {SortFactory} from "../../static/SortFactory";
import {SubtotalAggregator} from "../../static/SubtotalAggregator";
import {TreeBuilder} from "../../static/TreeBuilder";
import {Column, SortDirection} from "../../models/ColumnLike";
import {GigaState} from "../../components/GigaGrid";
import {GigaProps} from "../../components/GigaProps";

/**
 * decorate any sortBy(s) with properties that might exist on the column - properties defined in sortBys override those
 * defined in the column definition
 * @param initialSortBys
 * @param columnsWithSort
 * @returns {Column[]}
 */
export function decorateInitialSortBys(initialSortBys, columnsWithSort:Column[]): Column[] {
    return (initialSortBys || []).map((sortBy:Column)=> {
        if( typeof sortBy === 'string' )
            return _.assign({}, _.find<Column>(columnsWithSort, column => column.colTag === sortBy), { direction: SortDirection.ASC });
        else if( typeof sortBy === 'object' )
            return _.assign({}, _.find<Column>(columnsWithSort, column => column.colTag === sortBy.colTag), sortBy) as Column;
        else
            throw `Invalid sortBy: ${sortBy}`
    });
}

/**
 * for every column, add the direction property if it is part of a initialSortBy
 * @param columns
 * @param initialSortBys
 * @returns {any}
 */
export function decorateColumnsWithSort(columns:any, initialSortBys): Column[] {
    return columns.map((column:Column)=> {
        const sortBy = _.find((initialSortBys || []), (s:Column)=>s.colTag == column.colTag);
        if (sortBy)
            return _.assign<{},{},{},Column>({}, column, {
                direction: sortBy.direction || SortDirection.DESC
            });
        else
            return column;
    });
}

export default function (action:InitializeAction):GigaState {

    const {
        data,
        columnDefs,
        columnGroups,
        initialSubtotalBys,
        initialSortBys,
        initialFilterBys,
        initiallyExpandedSubtotalRows,
        initiallySelectedSubtotalRows,
        expandTable,
        additionalUserButtons
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
        if( typeof subtotalBy === 'string' )
            return _.find<Column>(columns, column => column.colTag === subtotalBy);
        else if( typeof subtotalBy === 'object' )
            return _.assign({}, _.find<Column>(columns, column => column.colTag === subtotalBy.colTag), subtotalBy) as Column;
    });

    /**
     * create sortBys from columns (any properties passed via initialSortBys will override the same property in the corresponding Column object
     */
    const columnsWithSort:Column[] = decorateColumnsWithSort(columns, initialSortBys);
    const sortBys = decorateInitialSortBys(initialSortBys, columnsWithSort);

    const filteredColumns:Column[] = _.filter(columnsWithSort, (column:Column) => subtotalBys.map(subtotalBy => subtotalBy.colTag).indexOf(column.colTag) === -1);

    let tree = TreeBuilder.buildTree(
        data,
        subtotalBys,
        initiallyExpandedSubtotalRows,
        initiallySelectedSubtotalRows
    );
    SubtotalAggregator.aggregateTree(tree, columns);

    if (sortBys)
        tree = SortFactory.sortTree(tree, sortBys, columns[0]);

    const rasterizedRows:Row[] = TreeRasterizer.rasterize(tree);

    const gridID:number = parseInt(_.uniqueId());

    return {
        rasterizedRows: rasterizedRows,
        displayStart: 0,
        columns: columnGroups ? columnsWithSort : filteredColumns,
        displayEnd: Math.min(rasterizedRows.length - 1, PROGRESSIVE_RENDERING_THRESHOLD),
        subtotalBys: subtotalBys,
        sortBys: sortBys,
        filterBys: _.cloneDeep(initialFilterBys) || [],
        tree: tree,
        showSettingsPopover: false,
        viewport:undefined,
        canvas:undefined,
        expandTable,
        additionalUserButtons,
        gridID
    }

}

export interface InitializeAction extends GigaAction {
    props?:GigaProps
}