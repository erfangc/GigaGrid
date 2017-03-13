import { PROGRESSIVE_RENDERING_THRESHOLD, GigaAction } from '../GigaStore';
import { TreeRasterizer } from '../../static/TreeRasterizer';
import { Row } from '../../models/Row';
import { SortFactory } from '../../static/SortFactory';
import { SubtotalAggregator } from '../../static/SubtotalAggregator';
import { TreeBuilder } from '../../static/TreeBuilder';
import { Column, SortDirection } from '../../models/ColumnLike';
import { GigaProps } from '../../components/GigaProps';
import { ServerStore } from '../ServerStore';
import {GigaState} from '../../components/GigaState';

/**
 * decorate any sortBy(s) with properties that might exist on the column - properties defined in sortBys override those
 * defined in the column definition
 * @param initialSortBys
 * @param columnsWithSort
 * @returns {Column[]}
 */
export function decorateInitialSortBys(initialSortBys, columnsWithSort: Column[]): Column[] {
    return (initialSortBys || []).map((sortBy: Column) => {
        if (typeof sortBy === 'string') {
            return Object.assign({}, columnsWithSort.find(column => column.colTag === sortBy), { direction: SortDirection.ASC });
        }
        else if (typeof sortBy === 'object') {
            return Object.assign({}, columnsWithSort.find(column => column.colTag === sortBy.colTag), sortBy) as Column;
        }
        else {
            throw `Invalid sortBy: ${sortBy}`;
        }
    });
}

/**
 * for every column, add the direction property if it is part of a initialSortBy
 * @param columns
 * @param initialSortBys
 * @returns {any}
 */
export function decorateColumnsWithSort(columns: any, initialSortBys): Column[] {
    return columns.map((column: Column) => {
        const sortBy = (initialSortBys || []).find((s: Column) => s.colTag === column.colTag);
        if (sortBy) {
            return Object.assign({}, column, {
                direction: sortBy.direction || SortDirection.DESC
            });
        }
        else {
            return column;
        }
    });
}

export default function (action: InitializeAction): GigaState {

    const {
        data,
        columnDefs,
        initialSubtotalBys,
        initialSortBys,
        initialFilterBys,
        additionalUserButtons
    } = action.props;

    /**
     * turn ColumnDefs into "Columns" which are decorated with behaviors
     */
    const columns = columnDefs.map(columnDef => {
        return Object.assign({}, columnDef, {});
    });

    /**
     * create subtotalBys from columns (any properties passed in via initialSubtotalBys will override the same property on the corresponding Column object
     */
    const subtotalBys: Column[] = (initialSubtotalBys || []).map(subtotalBy => {
        if (typeof subtotalBy === 'string') {
            return columns.find(column => column.colTag === subtotalBy);
        } else if (typeof subtotalBy === 'object') {
            return Object.assign({}, columns.find(column => column.colTag === subtotalBy.colTag), subtotalBy) as Column;
        }
    });

    /**
     * create sortBys from columns (any properties passed via initialSortBys will override the same property in the corresponding Column object
     */
    const columnsWithSort: Column[] = decorateColumnsWithSort(columns, initialSortBys);
    const sortBys = decorateInitialSortBys(initialSortBys, columnsWithSort);

    const filteredColumns: Column[] = columnsWithSort.filter((column: Column) => subtotalBys.map(subtotalBy => subtotalBy.colTag).indexOf(column.colTag) === -1);

    let tree = TreeBuilder.buildTree(
        data,
        subtotalBys
    );
    SubtotalAggregator.aggregateTree(tree, columns);

    if (sortBys) {
        tree = SortFactory.sortTree(tree, sortBys, columns[0]);
    }

    const rasterizedRows: Row[] = TreeRasterizer.rasterize(tree);

    const gridID: number = ServerStore.id++;

    return {
        rasterizedRows: rasterizedRows,
        displayStart: 0,
        columns: filteredColumns,
        displayEnd: PROGRESSIVE_RENDERING_THRESHOLD,
        subtotalBys: subtotalBys,
        sortBys: sortBys,
        filterBys: Object.assign({}, initialFilterBys) || [],
        tree: tree,
        showSettingsPopover: false,
        viewport: undefined,
        canvas: undefined,
        leftBody: undefined,
        rightBody: undefined,
        leftHeader: undefined,
        rightHeader: undefined,
        additionalUserButtons,
        gridID
    };

}

export interface InitializeAction extends GigaAction {
    props?: GigaProps;
}