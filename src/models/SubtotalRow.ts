interface Row {
    data(): any;
    isDetail(): boolean;
    title:string;
    sectorPath(): string[];
}

class DetailRow implements Row {

    private _data:any;
    private _sectorPath:string[];

    public title:string = null;

    constructor(data:any) {
        this._data = data;
    }

    sectorPath():string[] {
        return this._sectorPath;
    }

    setSectorPath(sectorPath:string[]) {
        this._sectorPath = sectorPath;
    }

    isDetail():boolean {
        return true
    }

    data():any {
        return this._data
    }
}

class SubtotalRow implements Row {

    public detailRows:DetailRow[];
    public title:string;
    private children:SubtotalRow[] = [];
    private childrenByTitle:{ [title: string] : SubtotalRow; } = {};
    private _data:any;
    private _sectorPath:string[];

    sectorPath():string[] {
        return this._sectorPath;
    }

    setSectorPath(sectorPath:string[]) {
        this._sectorPath = sectorPath;
    }

    isDetail():boolean {
        return false;
    }

    data():any {
        return this._data;
    }

    setData(data:any):void {
        this._data = data;
    }

    private findIndex(child:SubtotalRow) {
        for (var i = 0; i < this.children.length; i++)
            if (this.children[i].title === child.title)
                return i;
        return -1;
    }

    constructor(title:string) {
        this.detailRows = [];
        this.title = title;
        this._data = {};
    }

    addChild(child:SubtotalRow) {
        // if already exist, pop it from the children array
        this.removeChild(child);
        this.children.push(child);
        this.childrenByTitle[child.title] = child;
    }

    removeChild(child:SubtotalRow) {
        if (this.childrenByTitle[child.title] != undefined) {
            const idx = this.findIndex(child);
            this.children.splice(idx, 1);
            this.childrenByTitle[child.title] = undefined;
        }
    }

    getChildByTitle(title:string):SubtotalRow {
        return this.childrenByTitle[title];
    }

    getNumChildren():number {
        return this.children.length;
    }

    getChildren():SubtotalRow[] {
        return this.children;
    }

    getChildAtIndex(idx:number):SubtotalRow {
        return this.children[idx];
    }

    hasChildWithTitle(title:string):boolean {
        return this.getChildByTitle(title) != undefined;
    }

}
