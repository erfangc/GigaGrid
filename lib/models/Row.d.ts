import { ColumnDef, BucketInfo } from "./ColumnLike";
/**
 * The Row class is the central abstraction and data structure to represent a row in the table
 * A Row can contain some data, which is a map whose keys correspond to colTags - which are column identifiers
 * A Row can optionally have child rows
 * A Row can be in an expanded or collapsed state, which signifies whether its children will be displayed or not
 * A Row with children is known as a Subtotal Row whereas a Row without children is a detail row
 * Row(s) can be in a expanded/collapsed state
 */
export declare class Row {
    /**
     * properties
     */
    data: any;
    hidden: boolean;
    selected: boolean;
    sectorPath: BucketInfo[];
    detailRows: Row[];
    /**
     * this flag overrides isDetail() to always return false if set to true
     * we need this b/c server-side returned subtotal rows do not have children or ultimate descendants and thus
     * will be indistinguishable from a detail row
     * @type {boolean}
     */
    isSubtotal: boolean;
    loading: boolean;
    children: Row[];
    collapsed: boolean;
    bucketInfo: BucketInfo;
    /**
     * If this Row is server side rendered and there is an issue with the server call
     */
    errorStatus?: number;
    private _childrenByTitle;
    private findIndex(child);
    get(columnDef: ColumnDef): any;
    addChild(child: Row): void;
    removeChild(child: Row): void;
    getChildByTitle(title: string): Row;
    getNumChildren(): number;
    getChildAtIndex(idx: number): Row;
    hasChildWithTitle(title: string): boolean;
    getByColTag(colTag: string): any;
    /**
     * returns true if this row contains ultimate descendants (i.e. detail rows) but no immediate children
     * this is true if the current row is a subtotal row, but is the last subtotal row in the current tree
     * @return {boolean}
     */
    containsDetailRowsOnly(): boolean;
    /**
     * legacy is detail function
     * @deprecated
     * @return {boolean}
     */
    isDetail(): boolean;
    /**
     * a detail row is one with no direct descendants nor ultimate descendants
     * @return {boolean}
     */
    isDetailRow(): boolean;
    toggleCollapse(): void;
    toggleSelect(): void;
}
