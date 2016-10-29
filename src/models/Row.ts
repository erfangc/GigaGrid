import {ColumnDef, BucketInfo} from "./ColumnLike";

export interface Row {
    data():any
    isDetail():boolean
    isHidden():boolean
    toggleHide(hide?:boolean):void
    isSelected():boolean
    get(columnDef:ColumnDef):any
    getByColTag(colTag:string):any
    toggleSelect(select?:boolean):void
    sectorPath():BucketInfo[]
    setSectorPath(sp:BucketInfo[])
}

export abstract class GenericRow implements Row {

    private _data:any;
    private _sectorPath:BucketInfo[];
    private _isSelected:boolean = false;
    private _isHidden:boolean = false;

    constructor(data:any) {
        this._data = data;
        this._sectorPath = [];
    }

    get(columnDef:ColumnDef):any {
        return this._data[columnDef.colTag];
    }

    getByColTag(colTag:string):any {
        return this._data[colTag];
    }

    toggleSelect(select?:boolean):void {
        if (typeof select !== "undefined")
            this._isSelected = select;
        else
            this._isSelected = !this._isSelected;
    }

    isSelected():boolean {
        return this._isSelected;
    }

    isHidden() {
        return this._isHidden;
    }

    toggleHide(hide?:boolean) {
        if (typeof hide !== "undefined")
            this._isHidden = hide;
        else
            this._isHidden = !this._isHidden;
    }

    sectorPath():BucketInfo[] {
        return this._sectorPath;
    }

    setSectorPath(sectorPath:BucketInfo[]) {
        this._sectorPath = sectorPath;
    }

    data():any {
        return this._data
    }

    setData(data:any) {
        this._data = data;
    }

    abstract isDetail():boolean;

}

export class DetailRow extends GenericRow {

    constructor(data:any) {
        super(data);
    }

    isDetail():boolean {
        return true
    }

}

/**
 * creating a subtotal row has the following ingredients
 *  - bucketInfo
 *  - sectorPath
 *  - data
 *  - optional: children
 *  - optional: detailRows
 */
export class SubtotalRow extends GenericRow {

    public detailRows:DetailRow[];
    private _isLoading:boolean = false;
    private _children:SubtotalRow[] = [];
    private childrenByTitle:{ [title:string]:SubtotalRow; } = {};
    private _isCollapsed:boolean = false;
    public bucketInfo:BucketInfo;

    set children(value: SubtotalRow[]) {
        this._children = value;
    }

    isLoading():boolean {
        return this._isLoading;
    }

    setIsLoading(state:boolean) {
        this._isLoading = state;
    }

    toggleCollapse(state?:boolean) {
        if (state != undefined)
            this._isCollapsed = state;
        else
            this._isCollapsed = !this._isCollapsed;
    }

    isCollapsed():boolean {
        return this._isCollapsed;
    }

    isDetail():boolean {
        return false;
    }

    private findIndex(child:SubtotalRow) {
        for (var i = 0; i < this._children.length; i++)
            if (this._children[i].bucketInfo.title === child.bucketInfo.title)
                return i;
        return -1;
    }

    constructor(bucketInfo:BucketInfo) {
        super({});
        this.detailRows = [];
        this.bucketInfo = bucketInfo;
    }

    addChild(child:SubtotalRow) {
        // if already exist, pop it from the children array
        this.removeChild(child);
        this._children.push(child);
        this.childrenByTitle[child.bucketInfo.title] = child;
    }

    removeChild(child:SubtotalRow) {
        if (this.childrenByTitle[child.bucketInfo.title] != undefined) {
            const idx = this.findIndex(child);
            this._children.splice(idx, 1);
            this.childrenByTitle[child.bucketInfo.title] = undefined;
        }
    }

    getChildByTitle(title:string):SubtotalRow {
        return this.childrenByTitle[title];
    }

    getNumChildren():number {
        return this._children.length;
    }

    getChildren():SubtotalRow[] {
        return this._children;
    }

    getChildAtIndex(idx:number):SubtotalRow {
        return this._children[idx];
    }

    hasChildWithTitle(title:string):boolean {
        return this.getChildByTitle(title) != undefined;
    }

}