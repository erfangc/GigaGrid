/// <reference types="flux" />
import { AdditionalButton, GigaState } from "./GigaGrid";
import { ServerSubtotalRow } from "../store/ServerStore";
import { GigaAction } from "../store/GigaStore";
import { Dispatcher } from "flux";
import { Row } from "../models/Row";
import { ColumnGroupDef, ColumnDef, Column, FilterBy } from "../models/ColumnLike";
/**
 * Interface that describe the shape of the `Props` that `GigaGrid` accepts from the user
 * the bare minimum are: `data` and `columnDefs`
 * This is the Public API for GigaGrid by definition
 */
export interface GigaProps {
    /**
     * Initial set of SubtotalBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified subtotals
     */
    initialSubtotalBys?: (Column | string)[];
    /**
     * Initial set of SortBy declarations, default to `[]`. If set, the grid will initialize
     * with the specified sorting order
     */
    initialSortBys?: (Column | string)[];
    initialFilterBys?: FilterBy[];
    /**
     * Callback that fires when a row is clicked, return `false` in the passed callback function to suppress
     * default behavior (highlights the row)
     * @param row the `Row` object associated with the row the user clicked on
     */
    onRowClick?: (row: Row, state: GigaState) => boolean;
    enableMultiRowSelect?: boolean;
    /**
     * Callback that fires when a cell is clicked, return `false` in the passed callback function to suppress
     * default behavior
     *
     * Example
     *
     * ```js
     *
     * onCellClick = (row, columnDef) => {
     *  console.log(row.get(columnDef))
     *  // prints the value of the cell clicked on!
     * }
     *
     * ```
     * @param row
     * @param columnDef
     */
    onCellClick?: (row: Row, columnDef: Column, dispatcher: Dispatcher<any>) => boolean;
    /**
     * array of object literals representing the raw un-subtotaled data
     */
    data: any[];
    /**
     * array of [ColumnDef](_models_columnlike_.columndef.html) which defines the data type, header title
     * and other metadata about each column in `data`
     */
    columnDefs: ColumnDef[];
    columnGroups?: ColumnGroupDef[];
    bodyHeight?: string;
    rowHeight?: string;
    /**
     * If the height of the table itself is less than the container as defined in bodyHeight, the table's height will
     * be the size of the table itself
     */
    collapseHeight?: boolean;
    /**
     * EXPERIMENTAL - these props allow us to expand / select SubtotalRow on construction of the grid component
     */
    /**
     * create a ServerStore instead of GigaStore, this will drastically change the grid works
     * expand / collapse async action creators must also be provided
     */
    useServerStore?: boolean;
    fetchRowsActionCreator?: (row: Row, dispatch: Dispatcher<GigaAction>) => any;
    initialData?: ServerSubtotalRow[];
    /**
     * sector paths to expand by default
     */
    initiallyExpandedSubtotalRows?: string[][];
    /**
     * sector paths to mark as "selected"
     */
    initiallySelectedSubtotalRows?: string[][];
    disableConfiguration?: boolean;
    /**
     * custom classes
     */
    tableHeaderClass?: string;
    staticLeftHeaders?: number;
    additionalUserButtons?: AdditionalButton[];
}
