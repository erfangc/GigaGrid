import {Column, FilterBy} from '../models/ColumnLike';
import {Row} from '../models/Row';
import {Tree} from '../static/TreeBuilder';
import {AdditionalButton} from './GigaGrid';
/**
 * Interface that Declares the Valid State of GigaGrid
 * The grid's state consists of an `Tree` object that model the rows in a hierarchical structure (representing subtotals)
 *
 * `rasterizedRows` is a flattened version of `tree`. Each `Row` in `rasterizedRows` is converted into a `TableRow` component
 * at render time. (even though we represent subtotal-ed data as a tree in-memory, HTML tables must ultimately be rendered as a two-dimensional grid
 * and that is why `rasterizedRow` exists
 *
 * `displayStart`, `displayEnd` determines the range in `rasterizedRows` that is actually rendered as `tr` elements. This is the avoid needlessly rendering rows that will not be visible in the viewport
 *
 * `widthMeasures` contain state information on the width of each column and the table
 */
export interface GigaState {

    gridID?: number;
    /**
     *  the Tree stores structured data, it is the primary data structure and data source for GigaGrid
     */
    tree: Tree;
    /**
     * stores the current state of Columns
     */
    columns: Column[];
    /**
     * stores the current state of Columns upon which data in the table is grouped
     */
    subtotalBys: Column[];
    sortBys: Column[];
    filterBys: FilterBy[];
    /**
     * a flattened view of tree
     */
    rasterizedRows: Row[];
    /**
     * the first row visible in viewport
     */
    displayStart: number;
    /**
     * the last row visible in viewport
     */
    displayEnd: number;
    showSettingsPopover: boolean;
    additionalUserButtons?: AdditionalButton[];

    /**
     * the HTML elements below reference the key native components that makes scrolling possible
     * they are populated via react's ref feature
     */
    leftHeader: HTMLDivElement;
    rightHeader: HTMLDivElement;
    leftBody: HTMLDivElement;
    rightBody: HTMLDivElement;
    canvas: HTMLDivElement;
    viewport: HTMLDivElement;
}
