class SubtotalRow {
    public detailRows:any[];
    public title:string;
    private children:SubtotalRow[] = [];
    private childrenByTitle:{ [title: string] : SubtotalRow; } = {};
    public data:any;

    constructor(title:string) {
        this.detailRows = [];
        this.title = title;
        this.data = {};
    }

    addChild(child:SubtotalRow) {
        // if already exist, pop it from the children array
        this.removeChild(child);
        this.children.push(child);
        this.childrenByTitle[child.title] = child;
    }

    removeChild(child: SubtotalRow) {
        if (this.childrenByTitle[child.title] != undefined) {
            const idx = this.children.findIndex((c)=>c.title === child.title);
            this.children.splice(idx, 1);
            this.childrenByTitle[child.title] = undefined;
        }
    }

    getChildByTitle(title:string):SubtotalRow {
        return this.childrenByTitle[title];
    }

    getNumChildren(): number {
        return this.children.length;
    }

    getChildren(): SubtotalRow[] {
        return this.children;
    }

    getChildAtIndex(idx: number):SubtotalRow {
        return this.children[idx];
    }

    hasChildWithTitle(title:string):boolean {
        return this.getChildByTitle(title) != undefined;
    }
}
