import {ColumnDef, BucketInfo} from "./ColumnLike";

/**
 * The Row class is the central abstraction and data structure to represent a row in the table
 * A Row can contain some data, which is a map whose keys correspond to colTags - which are column identifiers
 * A Row can optionally have child rows
 * A Row can be in an expanded or collapsed state, which signifies whether its children will be displayed or not
 * A Row with children is known as a Subtotal Row whereas a Row without children is a detail row
 * Row(s) can be in a expanded/collapsed state
 */
export class Row {

    /**
     * properties
     */
    data: any = {};
    hidden: boolean;
    selected: boolean = false;
    sectorPath: BucketInfo[] = [];
    detailRows: Row[] = [];
    /**
     * this flag overrides isDetail() to always return false if set to true
     * we need this b/c server-side returned subtotal rows do not have children or ultimate descendants and thus
     * will be indistinguishable from a detail row
     * @type {boolean}
     */
    isSubtotal: boolean = false;
    loading: boolean = false;
    children: Row[] = [];
    collapsed: boolean = true;
    bucketInfo: BucketInfo;

    private _childrenByTitle: { [title: string]: Row; } = {};

    private findIndex(child: Row) {
        for (var i = 0; i < this.children.length; i++)
            if (this.children[i].bucketInfo.title === child.bucketInfo.title)
                return i;
        return -1;
    }

    get(columnDef: ColumnDef): any {
        return this.data[columnDef.colTag];
    }

    addChild(child: Row) {
        // if already exist, pop it from the children array
        this.removeChild(child);
        this.children.push(child);
        this._childrenByTitle[child.bucketInfo.title] = child;
    }

    removeChild(child: Row) {
        if (this._childrenByTitle[child.bucketInfo.title] != undefined) {
            const idx = this.findIndex(child);
            this.children.splice(idx, 1);
            this._childrenByTitle[child.bucketInfo.title] = undefined;
        }
    }

    getChildByTitle(title: string): Row {
        return this._childrenByTitle[title];
    }

    getNumChildren(): number {
        return this.children.length;
    }

    getChildAtIndex(idx: number): Row {
        return this.children[idx];
    }

    hasChildWithTitle(title: string): boolean {
        return this.getChildByTitle(title) != undefined;
    }

    getByColTag(colTag: string): any {
        return this.data[colTag];
    }

    /**
     * returns true if this row contains ultimate descendants (i.e. detail rows) but no immediate children
     * this is true if the current row is a subtotal row, but is the last subtotal row in the current tree
     * @return {boolean}
     */
    containsDetailRowsOnly(): boolean {
        let {children, detailRows} = this;
        return children.length === 0 && detailRows.length !== 0;
    }

    /**
     * a detail row is one with no direct descendants nor ultimate descendants
     * @return {boolean}
     */
    isDetailRow(): boolean {
        let {children, detailRows, isSubtotal} = this;
        return !isSubtotal && children.length === 0 && detailRows.length === 0;
    }

    toggleCollapse() {
        this.collapsed = !this.collapsed;
    }

    toggleSelect() {
        this.selected = !this.selected;
    }
}
